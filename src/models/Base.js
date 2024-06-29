import { getTrimmedOrEmptyString } from '../lib/strings.js';
import { validateString } from '../lib/validate-string.js';
import { MODELS } from '../utils/constants.js';

const NAME_EXEMPT_MODELS = new Set([
	MODELS.NOMINATION,
	MODELS.PRODUCTION_IDENTIFIER,
	MODELS.REVIEW
]);

export default class Base {

	constructor (props = {}) {

		if (!NAME_EXEMPT_MODELS.has(this.model)) this.name = getTrimmedOrEmptyString(props.name);

		this.errors = {};

	}

	toJSON () {

		return Object.assign({}, { model: this.model }, this);

	}

	validateName (opts) {

		this.validateStringForProperty('name', { isRequired: opts.isRequired });

	}

	validateQualifier () {

		this.validateStringForProperty('qualifier', { isRequired: false });

	}

	validateStringForProperty (property, opts) {

		const stringErrorText = validateString(this[property], { isRequired: opts.isRequired });

		if (stringErrorText) this.addPropertyError(property, stringErrorText);

	}

	validateUniquenessInGroup (opts) {

		if (opts.isDuplicate) {

			const uniquenessErrorMessage = 'This item has been duplicated within the group';

			const defaultProperties = new Set([
				'name',
				'differentiator',
				'underlyingName',
				'characterName',
				'characterDifferentiator',
				'qualifier'
			]);

			(opts.properties || defaultProperties).forEach(property => {

				if (Object.hasOwn(this, property))
					this.addPropertyError(property, uniquenessErrorMessage);

			});

		}

	}

	validateNamePresenceIfNamedChildren (children) {

		this.validatePropertyPresenceIfNamedChildren('name', children);

	}

	validatePropertyPresenceIfNamedChildren (property, children) {

		if (this[property] === '' && children.some(child => Boolean(child.name))) {

			this.addPropertyError(property, 'Value is required if named children exist');

		}

	}

	addPropertyError (property, errorText) {

		this.errors[property]
			? this.errors[property].push(errorText)
			: this.errors[property] = [errorText];

	}

}
