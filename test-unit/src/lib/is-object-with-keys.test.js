import { expect } from 'chai';

import isObjectWithKeys from '../../../src/lib/is-object-with-keys.js';

describe('Is Object With Keys module', () => {

	it('considers object with keys as valid object', () => {

		expect(isObjectWithKeys({ key: 'value' })).to.be.true;

	});

	it('will not consider null (which is type of object) as valid object', () => {

		expect(isObjectWithKeys(null)).to.be.false;

	});

	it('will not consider empty array (which is type of object) as valid object', () => {

		expect(isObjectWithKeys([])).to.be.false;

	});

	it('will not consider populated array (which is type of object) as valid object', () => {

		expect(isObjectWithKeys([1, 2, 3])).to.be.false;

	});

	it('will not consider string type as valid object', () => {

		expect(isObjectWithKeys('string')).to.be.false;

	});

	it('will not consider number type as valid object', () => {

		expect(isObjectWithKeys(123)).to.be.false;

	});

	it('will not consider empty object (i.e. no keys) as valid object', () => {

		expect(isObjectWithKeys({})).to.be.false;

	});

});
