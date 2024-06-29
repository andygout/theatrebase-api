import { expect } from 'chai';

import { getTrimmedOrEmptyString } from '../../../src/lib/strings.js';

describe('Strings module', () => {

	describe('getTrimmedOrEmptyString function', () => {

		it('assigns empty string if value is undefined', () => {

			expect(getTrimmedOrEmptyString(undefined)).to.equal('');

		});

		it('assigns empty string if value is empty string', () => {

			expect(getTrimmedOrEmptyString('')).to.equal('');

		});

		it('assigns empty string if value is whitespace-only string', () => {

			expect(getTrimmedOrEmptyString(' ')).to.equal('');

		});

		it('assigns value if value is string with length', () => {

			expect(getTrimmedOrEmptyString('foobar')).to.equal('foobar');

		});

		it('assigns trimmed value if value is string with leading and trailing whitespace', () => {

			expect(getTrimmedOrEmptyString(' foobar ')).to.equal('foobar');

		});

	});

});
