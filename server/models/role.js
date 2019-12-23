import { validateString } from '../lib/validate-string';

export default class Role {

	constructor (props = {}) {

		this.model = 'role';
		this.name = props.name.trim();
		this.characterName = props.characterName.trim();
		this.errors = {};

	}

	validate (opts = { requiresName: false, requiresCharacterName: false }) {

		const nameErrors = validateString(this.name, opts.requiresName);

		if (nameErrors.length) this.errors.name = nameErrors;

		const characterNameErrors = validateString(this.characterName, opts.requiresCharacterName);

		if (characterNameErrors.length) this.errors.characterName = characterNameErrors;

	}

}
