import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Company from '../../src/models/Company.js';
import * as neo4jQueryModule from '../../src/neo4j/query.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

const methods = [
	'create',
	'update'
];

const sandbox = createSandbox();

describe('Input validation failures: Company instance', () => {

	beforeEach(() => {

		// Stub with a contrived resolution that ensures various
		// neo4jQuery function calls all pass database validation.
		sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ isExistent: true, isDuplicateRecord: false });

	});

	afterEach(() => {

		sandbox.restore();

	});

	context('name value is empty string', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Company({ name: '' });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Company({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Company({ name: 'Playful Productions', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Playful Productions',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: [
							'Value is too long'
						]
					}
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

});
