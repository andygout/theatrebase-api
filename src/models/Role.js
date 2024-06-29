import { getTrimmedOrEmptyString } from '../lib/strings.js';
import Base from './Base.js';
import { MODELS } from '../utils/constants.js';

export default class Role extends Base {

	constructor (props = {}) {

		super(props);

		const { characterName, characterDifferentiator, qualifier, isAlternate } = props;

		this.characterName = getTrimmedOrEmptyString(characterName);

		this.characterDifferentiator = getTrimmedOrEmptyString(characterDifferentiator);

		this.qualifier = getTrimmedOrEmptyString(qualifier);

		this.isAlternate = Boolean(isAlternate);

	}

	get model () {

		return MODELS.ROLE;

	}

	validateCharacterName () {

		this.validateStringForProperty('characterName', { isRequired: false });

	}

	validateCharacterDifferentiator () {

		this.validateStringForProperty('characterDifferentiator', { isRequired: false });

	}

	validateRoleNameCharacterNameDisparity () {

		if (Boolean(this.characterName) && this.name === this.characterName) {

			this.addPropertyError('characterName', 'Character name is only required if different from role name');

		}

	}

}
