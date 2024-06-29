import { expect } from 'chai';

import { hasErrors } from '../../../src/lib/has-errors.js';

describe('Has Errors module', () => {

	context('no valid error values present', () => {

		it('returns false if no error values present', () => {

			const instance = { errors: {}, venue: { errors: {} } };
			const result = hasErrors(instance);
			expect(result).to.be.false;

		});

		it('returns false if no error properties present', () => {

			const instance = { notErrors: {} };
			const result = hasErrors(instance);
			expect(result).to.be.false;

		});

		it('returns false if errors present in form of null value', () => {

			const instance = { errors: null };
			const result = hasErrors(instance);
			expect(result).to.be.false;

		});

		it('returns false if errors present in form of array', () => {

			const instance = { errors: ['Value is too short'] };
			const result = hasErrors(instance);
			expect(result).to.be.false;

		});

	});

	context('top level errors present', () => {

		it('returns true', () => {

			const instance = { errors: { name: ['Value is too short'] } };
			const result = hasErrors(instance);
			expect(result).to.be.true;

		});

	});

	context('nested errors present', () => {

		it('returns true', () => {

			const instance = { venue: { errors: { name: ['Value is too short'] } } };
			const result = hasErrors(instance);
			expect(result).to.be.true;

		});

	});

	context('errors present in objects in arrays at top level', () => {

		it('returns true', () => {

			const instance = { cast: [{ errors: { name: ['Value is too short'] } }] };
			const result = hasErrors(instance);
			expect(result).to.be.true;

		});

	});

});
