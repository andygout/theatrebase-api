import { getTrimmedOrEmptyString } from '../lib/strings.js';
import Character from './Character.js';

export default class CharacterDepiction extends Character {

	constructor (props = {}) {

		super(props);

		const { underlyingName, qualifier } = props;

		this.underlyingName = getTrimmedOrEmptyString(underlyingName);

		this.qualifier = getTrimmedOrEmptyString(qualifier);

	}

	validateUnderlyingName () {

		this.validateStringForProperty('underlyingName', { isRequired: false });

	}

	validateCharacterNameUnderlyingNameDisparity () {

		if (Boolean(this.underlyingName) && this.name === this.underlyingName) {

			this.addPropertyError('underlyingName', 'Underlying name is only required if different from character name');

		}

	}

}
