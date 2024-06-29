import { expect } from 'chai';

import { validateString } from '../../../src/lib/validate-string.js';

const STRING_MAX_LENGTH = 1000;
const MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH);
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Validate String module', () => {

	context('string is empty', () => {

		context('string is required', () => {

			it('returns error text explaining that value is too short', () => {

				expect(validateString('', { isRequired: true })).to.equal('Value is too short');

			});

		});

		context('string is not required', () => {

			it('returns undefined', () => {

				expect(validateString('', { isRequired: false })).to.equal(undefined);

			});

		});

	});

	context('string is not empty and does not exceed maximum length', () => {

		context('string is required', () => {

			it('returns undefined', () => {

				expect(validateString(MAX_LENGTH_STRING, { isRequired: true })).to.equal(undefined);

			});

		});

		context('string is not required', () => {

			it('returns undefined', () => {

				expect(validateString(MAX_LENGTH_STRING, { isRequired: false })).to.equal(undefined);

			});

		});

	});

	context('string exceeds maximum length', () => {

		context('string is required', () => {

			it('returns error text explaining that value is too long', () => {

				expect(
					validateString(ABOVE_MAX_LENGTH_STRING, { isRequired: true })
				).to.equal('Value is too long');

			});

		});

		context('string is not required', () => {

			it('returns error text explaining that value is too long', () => {

				expect(
					validateString(ABOVE_MAX_LENGTH_STRING, { isRequired: false })
				).to.equal('Value is too long');

			});

		});

	});

	context('given value is null', () => {

		context('string is required', () => {

			it('returns error text explaining that value is too short', () => {

				expect(validateString(null, { isRequired: true })).to.equal('Value is too short');

			});

		});

		context('string is not required', () => {

			it('returns undefined', () => {

				expect(validateString(null, { isRequired: false })).to.equal(undefined);

			});

		});

	});

});
