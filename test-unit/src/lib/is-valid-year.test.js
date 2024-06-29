import { expect } from 'chai';

import { isValidYear } from '../../../src/lib/is-valid-year.js';

describe('Is Valid Year module', () => {

	context('year cannot be parsed as integer', () => {

		it('returns false', () => {

			expect(isValidYear('Nineteen Fifty-Nine')).to.be.false;

		});

	});

	context('year is less than 0', () => {

		it('returns false', () => {

			expect(isValidYear(-1)).to.be.false;

		});

	});

	context('year is more than 9999', () => {

		it('returns false', () => {

			expect(isValidYear(10000)).to.be.false;

		});

	});

	context('year is 0', () => {

		it('returns true', () => {

			expect(isValidYear(0)).to.be.true;

		});

	});

	context('year is 9999', () => {

		it('returns true', () => {

			expect(isValidYear(9999)).to.be.true;

		});

	});

});
