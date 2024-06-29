import { expect } from 'chai';

import { isValidDate } from '../../../src/lib/is-valid-date.js';

describe('Is Valid Date module', () => {

	context('string is empty', () => {

		it('returns false', () => {

			expect(isValidDate('')).to.be.false;

		});

	});

	context('string is not a date', () => {

		it('returns false', () => {

			expect(isValidDate('foobar')).to.be.false;

		});

	});

	context('string is a date in DD-MM-YYYY format', () => {

		it('returns false', () => {

			expect(isValidDate('16-04-2020')).to.be.false;

		});

	});

	context('string is a date in YYYY-MM-DD format', () => {

		it('returns true', () => {

			expect(isValidDate('2020-04-16')).to.be.true;

		});

	});

	context('string is a date in MM-DD-YYYY format', () => {

		it('returns true', () => {

			expect(isValidDate('04-16-2020')).to.be.true;

		});

	});

});
