import { getDuplicateCharacterIndices } from '../lib/get-duplicate-indices.js';
import Base from './Base.js';
import { CharacterDepiction } from './index.js';
import { MODELS } from '../utils/constants.js';

export default class CharacterGroup extends Base {

	constructor (props = {}) {

		super(props);

		const { characters } = props;

		this.characters = characters
			? characters.map(character => new CharacterDepiction(character))
			: [];

	}

	get model () {

		return MODELS.CHARACTER_GROUP;

	}

	runInputValidations () {

		this.validateName({ isRequired: false });

		const duplicateCharacterIndices = getDuplicateCharacterIndices(this.characters);

		this.characters.forEach((character, index) => {

			character.validateName({ isRequired: false });

			character.validateUnderlyingName();

			character.validateDifferentiator();

			character.validateQualifier();

			character.validateCharacterNameUnderlyingNameDisparity();

			character.validateUniquenessInGroup({ isDuplicate: duplicateCharacterIndices.includes(index) });

		});

	}

}
