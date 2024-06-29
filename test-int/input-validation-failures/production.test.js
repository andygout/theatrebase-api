import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Production from '../../src/models/Production.js';
import * as neo4jQueryModule from '../../src/neo4j/query.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

const methods = [
	'create',
	'update'
];

const sandbox = createSandbox();

describe('Input validation failures: Production instance', () => {

	beforeEach(() => {

		// Stub with a contrived resolution that ensures various
		// neo4jQuery function calls all pass database validation.
		sandbox
			.stub(neo4jQueryModule, 'neo4jQuery')
			.resolves({
				isExistent: true,
				isDuplicateRecord: false,
				isAssignedToSurProduction: false,
				isSurSurProduction: false,
				isSurProductionOfSubjectProduction: false,
				isSubjectProductionASubSubProduction: false
			});

	});

	afterEach(() => {

		sandbox.restore();

	});

	context('name value is empty string', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: ''
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: ABOVE_MAX_LENGTH_STRING
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('subtitle value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					subtitle: ABOVE_MAX_LENGTH_STRING
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: ABOVE_MAX_LENGTH_STRING,
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						subtitle: [
							'Value is too long'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('start date, press date, and end date values with invalid date format', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					startDate: 'foobar',
					pressDate: 'foobar',
					endDate: 'foobar'
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: 'foobar',
					pressDate: 'foobar',
					endDate: 'foobar',
					hasErrors: true,
					errors: {
						startDate: [
							'Value must be in date format'
						],
						pressDate: [
							'Value must be in date format'
						],
						endDate: [
							'Value must be in date format'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('start date, press date, and end date with valid date format with start date after press date and press date after end date', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					startDate: '2011-01-26',
					pressDate: '2010-10-07',
					endDate: '2010-09-30'
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '2011-01-26',
					pressDate: '2010-10-07',
					endDate: '2010-09-30',
					hasErrors: true,
					errors: {
						startDate: [
							'Start date must not be after end date',
							'Start date must not be after press date'
						],
						pressDate: [
							'Press date must not be before start date',
							'Press date must not be after end date'
						],
						endDate: [
							'End date must not be before start date',
							'End date must not be before press date'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('material name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					material: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('material differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					material: {
						name: 'Hamlet',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: 'Hamlet',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('venue name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					venue: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('venue differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					venue: {
						name: 'National Theatre',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: 'National Theatre',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('season name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					season: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('season differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					season: {
						name: 'Shakespearean Tragedy Season',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: 'Shakespearean Tragedy Season',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('festival name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					festival: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('festival differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					festival: {
						name: 'The Complete Works',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: 'The Complete Works',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('sub-production uuid value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'The Coast of Utopia',
					subProductions: [
						{
							uuid: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'The Coast of Utopia',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [
						{
							uuid: ABOVE_MAX_LENGTH_STRING,
							errors: {
								uuid: [
									'Value is too long'
								]
							}
						}
					],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('production instance assigns itself as a sub-production', () => {

		// N.B. Only tested for update method; for create method the production instance will not yet have a uuid value.
		it('assigns appropriate error (update method)', async () => {

			const PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

			const instanceProps = {
				uuid: PRODUCTION_UUID,
				name: 'The Coast of Utopia',
				subProductions: [
					{
						uuid: PRODUCTION_UUID
					}
				]
			};

			const instance = new Production(instanceProps);

			const result = await instance.update();

			const expectedResponseBody = {
				uuid: PRODUCTION_UUID,
				name: 'The Coast of Utopia',
				subtitle: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				hasErrors: true,
				errors: {},
				material: {
					uuid: undefined,
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					uuid: undefined,
					name: '',
					differentiator: '',
					errors: {}
				},
				season: {
					uuid: undefined,
					name: '',
					differentiator: '',
					errors: {}
				},
				festival: {
					uuid: undefined,
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						uuid: PRODUCTION_UUID,
						errors: {
							uuid: [
								'Instance cannot form association with itself'
							]
						}
					}
				],
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: [],
				reviews: []
			};

			expect(result).to.deep.equal(expectedResponseBody);

		});

	});

	context('duplicate sub-productions', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'The Coast of Utopia',
					subProductions: [
						{
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						},
						{
							uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						},
						{
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'The Coast of Utopia',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [
						{
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							errors: {
								uuid: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
							errors: {}
						},
						{
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							errors: {
								uuid: [
									'This item has been duplicated within the group'
								]
							}
						}
					],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('producer credit name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							entities: []
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate producer credit name values', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'produced by'
						},
						{
							name: 'produced by'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'produced by',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						},
						{
							name: 'produced by',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('producer credit entity (person) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'produced by',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('producer credit entity (person) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Elliott',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'produced by',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Paul Elliott',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('producer credit entity (company) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'produced by',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									members: [],
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('producer credit entity (company) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Duncan C Weldon Productions',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'produced by',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									members: [],
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate producer credit entities, including producer credit entity (company) credited members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'Producers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Duncan C Weldon Productions',
									members: [
										{
											name: 'Duncan C Weldon'
										},
										{
											name: 'Foo'
										}
									]
								},
								{
									name: 'Duncan C Weldon'
								},
								{
									model: 'COMPANY',
									name: 'Duncan C Weldon Productions'
								},
								{
									model: 'COMPANY',
									name: 'Foo'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'Producers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									members: [
										{
											uuid: undefined,
											name: 'Duncan C Weldon',
											differentiator: '',
											errors: {
												name: [
													'This item has been duplicated within the group'
												],
												differentiator: [
													'This item has been duplicated within the group'
												]
											}
										},
										{
											uuid: undefined,
											name: 'Foo',
											differentiator: '',
											errors: {}
										}
									]
								},
								{
									uuid: undefined,
									name: 'Duncan C Weldon',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									members: []
								},
								{
									uuid: undefined,
									name: 'Foo',
									differentiator: '',
									errors: {},
									members: []
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);
				expect(result.producerCredits[0].entities[0].members[1].model).to.equal('PERSON');
				expect(result.producerCredits[0].entities[3].model).to.equal('COMPANY');

			});

		}

	});

	context('producer credit entity (company) without name has named credited members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: '',
									members: [
										{
											name: 'Duncan C Weldon'
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'produced by',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: '',
									differentiator: '',
									errors: {
										name: [
											'Value is required if named children exist'
										]
									},
									members: [
										{
											uuid: undefined,
											name: 'Duncan C Weldon',
											differentiator: '',
											errors: {}
										}
									]
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('producer credit entity (company) credited member name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Duncan C Weldon Productions',
									members: [
										{
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'produced by',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: '',
									errors: {},
									members: [
										{
											uuid: undefined,
											name: ABOVE_MAX_LENGTH_STRING,
											differentiator: '',
											errors: {
												name: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('producer credit entity (company) credited member differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Duncan C Weldon Productions',
									members: [
										{
											name: 'Duncan C Weldon',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [
						{
							name: 'produced by',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: '',
									errors: {},
									members: [
										{
											uuid: undefined,
											name: 'Duncan C Weldon',
											differentiator: ABOVE_MAX_LENGTH_STRING,
											errors: {
												differentiator: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('cast member name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							roles: []
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							differentiator: '',
							errors: {
								name: [
									'Value is too long'
								]
							},
							roles: []
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('cast member differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							roles: []
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							errors: {
								differentiator: [
									'Value is too long'
								]
							},
							roles: []
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate cast members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear'
						},
						{
							name: 'Clare Higgins',
							differentiator: '1'
						},
						{
							name: 'Rory Kinnear'
						},
						{
							name: 'Clare Higgins',
							differentiator: '2'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								]
							},
							roles: []
						},
						{
							uuid: undefined,
							name: 'Clare Higgins',
							differentiator: '1',
							errors: {},
							roles: []
						},
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								]
							},
							roles: []
						},
						{
							uuid: undefined,
							name: 'Clare Higgins',
							differentiator: '2',
							errors: {},
							roles: []
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('cast member without name has named roles', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: '',
							roles: [
								{
									name: 'Hamlet'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: '',
							differentiator: '',
							errors: {
								name: [
									'Value is required if named children exist'
								]
							},
							roles: [
								{
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									isAlternate: false,
									errors: {}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('cast member role name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: ABOVE_MAX_LENGTH_STRING,
									characterName: ''
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: ABOVE_MAX_LENGTH_STRING,
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									isAlternate: false,
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('cast member role characterName value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									characterName: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Hamlet',
									characterName: ABOVE_MAX_LENGTH_STRING,
									characterDifferentiator: '',
									qualifier: '',
									isAlternate: false,
									errors: {
										characterName: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('cast member role characterDifferentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: ABOVE_MAX_LENGTH_STRING,
									qualifier: '',
									isAlternate: false,
									errors: {
										characterDifferentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('cast member role qualifier value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									qualifier: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: '',
									qualifier: ABOVE_MAX_LENGTH_STRING,
									isAlternate: false,
									errors: {
										qualifier: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('cast member role name and characterName values are the same', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									characterName: 'Hamlet'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Hamlet',
									characterName: 'Hamlet',
									characterDifferentiator: '',
									qualifier: '',
									isAlternate: false,
									errors: {
										characterName: [
											'Character name is only required if different from role name'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate cast member roles', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'David Calder',
							roles: [
								{
									name: 'Polonius'
								},
								{
									name: 'Gravedigger',
									characterDifferentiator: '1'
								},
								{
									name: 'Polonius'
								},
								{
									name: 'Gravedigger',
									characterDifferentiator: '2'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'David Calder',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Polonius',
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									isAlternate: false,
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										characterName: [
											'This item has been duplicated within the group'
										],
										characterDifferentiator: [
											'This item has been duplicated within the group'
										],
										qualifier: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									name: 'Gravedigger',
									characterName: '',
									characterDifferentiator: '1',
									qualifier: '',
									isAlternate: false,
									errors: {}
								},
								{
									name: 'Polonius',
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									isAlternate: false,
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										characterName: [
											'This item has been duplicated within the group'
										],
										characterDifferentiator: [
											'This item has been duplicated within the group'
										],
										qualifier: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									name: 'Gravedigger',
									characterName: '',
									characterDifferentiator: '2',
									qualifier: '',
									isAlternate: false,
									errors: {}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('creative credit name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							entities: []
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate creative credit name values', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design'
						},
						{
							name: 'Sound Design'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						},
						{
							name: 'Sound Design',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('creative credit without name has named creative entities', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: '',
							entities: [
								{
									name: 'Paul Groothuis'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: '',
							errors: {
								name: [
									'Value is required if named children exist'
								]
							},
							entities: [
								{
									uuid: undefined,
									name: 'Paul Groothuis',
									differentiator: '',
									errors: {}
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('creative credit entity (person) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('creative credit entity (person) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									name: 'Paul Groothuis',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Paul Groothuis',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('creative credit entity (company) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'COMPANY',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									members: [],
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('creative credit entity (company) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									members: [],
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate creative credit entities, including creative credit entity (company) credited members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									members: [
										{
											name: 'Andrew Bruce'
										},
										{
											name: 'Foo'
										}
									]
								},
								{
									name: 'Andrew Bruce'
								},
								{
									model: 'COMPANY',
									name: 'Autograph'
								},
								{
									model: 'COMPANY',
									name: 'Foo'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									members: [
										{
											uuid: undefined,
											name: 'Andrew Bruce',
											differentiator: '',
											errors: {
												name: [
													'This item has been duplicated within the group'
												],
												differentiator: [
													'This item has been duplicated within the group'
												]
											}
										},
										{
											uuid: undefined,
											name: 'Foo',
											differentiator: '',
											errors: {}
										}
									]
								},
								{
									uuid: undefined,
									name: 'Andrew Bruce',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									members: []
								},
								{
									uuid: undefined,
									name: 'Foo',
									differentiator: '',
									errors: {},
									members: []
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);
				expect(result.creativeCredits[0].entities[0].members[1].model).to.equal('PERSON');
				expect(result.creativeCredits[0].entities[3].model).to.equal('COMPANY');

			});

		}

	});

	context('creative credit entity (company) without name has named credited members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'COMPANY',
									name: '',
									members: [
										{
											name: 'Andrew Bruce'
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: '',
									differentiator: '',
									errors: {
										name: [
											'Value is required if named children exist'
										]
									},
									members: [
										{
											uuid: undefined,
											name: 'Andrew Bruce',
											differentiator: '',
											errors: {}
										}
									]
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('creative credit entity (company) credited member name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									members: [
										{
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {},
									members: [
										{
											uuid: undefined,
											name: ABOVE_MAX_LENGTH_STRING,
											differentiator: '',
											errors: {
												name: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('creative credit entity (company) credited member differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									members: [
										{
											name: 'Andrew Bruce',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {},
									members: [
										{
											uuid: undefined,
											name: 'Andrew Bruce',
											differentiator: ABOVE_MAX_LENGTH_STRING,
											errors: {
												differentiator: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					],
					crewCredits: [],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('crew credit name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							entities: []
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate crew credit name values', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager'
						},
						{
							name: 'Stage Manager'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Stage Manager',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						},
						{
							name: 'Stage Manager',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('crew credit without name has named crew entities', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: '',
							entities: [
								{
									name: 'Andrew Speed'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: '',
							errors: {
								name: [
									'Value is required if named children exist'
								]
							},
							entities: [
								{
									uuid: undefined,
									name: 'Andrew Speed',
									differentiator: '',
									errors: {}
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('crew credit entity (person) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager',
							entities: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Stage Manager',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('crew credit entity (person) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager',
							entities: [
								{
									name: 'Andrew Speed',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Stage Manager',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Andrew Speed',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('crew credit entity (company) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager',
							entities: [
								{
									model: 'COMPANY',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Stage Manager',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									members: [],
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('crew credit entity (company) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Assistant Stage Managers Ltd',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									members: [],
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate crew credit entities, including crew credit entity (company) credited members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Assistant Stage Managers Ltd',
									members: [
										{
											name: 'Sara Gunter'
										},
										{
											name: 'Foo'
										}
									]
								},
								{
									name: 'Sara Gunter'
								},
								{
									model: 'COMPANY',
									name: 'Assistant Stage Managers Ltd'
								},
								{
									model: 'COMPANY',
									name: 'Foo'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									members: [
										{
											uuid: undefined,
											name: 'Sara Gunter',
											differentiator: '',
											errors: {
												name: [
													'This item has been duplicated within the group'
												],
												differentiator: [
													'This item has been duplicated within the group'
												]
											}
										},
										{
											uuid: undefined,
											name: 'Foo',
											differentiator: '',
											errors: {}
										}
									]
								},
								{
									uuid: undefined,
									name: 'Sara Gunter',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									members: []
								},
								{
									uuid: undefined,
									name: 'Foo',
									differentiator: '',
									errors: {},
									members: []
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);
				expect(result.crewCredits[0].entities[0].members[1].model).to.equal('PERSON');
				expect(result.crewCredits[0].entities[3].model).to.equal('COMPANY');

			});

		}

	});

	context('crew credit entity (company) without name has named credited members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: '',
									members: [
										{
											name: 'Sara Gunter'
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: '',
									differentiator: '',
									errors: {
										name: [
											'Value is required if named children exist'
										]
									},
									members: [
										{
											uuid: undefined,
											name: 'Sara Gunter',
											differentiator: '',
											errors: {}
										}
									]
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('crew credit entity (company) credited member name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Assistant Stage Managers Ltd',
									members: [
										{
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: '',
									errors: {},
									members: [
										{
											uuid: undefined,
											name: ABOVE_MAX_LENGTH_STRING,
											differentiator: '',
											errors: {
												name: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('crew credit entity (company) credited member differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Assistant Stage Managers Ltd',
									members: [
										{
											name: 'Sara Gunter',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: '',
									errors: {},
									members: [
										{
											uuid: undefined,
											name: 'Sara Gunter',
											differentiator: ABOVE_MAX_LENGTH_STRING,
											errors: {
												differentiator: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					],
					reviews: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review url value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const urlProtocolAndSubdomain = 'https://www.';

				const urlDomainName = 'a'.repeat((STRING_MAX_LENGTH - urlProtocolAndSubdomain.length) + 1);

				const ABOVE_MAX_LENGTH_URL = urlProtocolAndSubdomain + urlDomainName;

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: ABOVE_MAX_LENGTH_URL,
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: ABOVE_MAX_LENGTH_URL,
							date: '',
							errors: {
								url: [
									'Value is too long'
								]
							},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review url value is not a valid URL', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const INVALID_URL = 'foobar';

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: INVALID_URL,
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: INVALID_URL,
							date: '',
							errors: {
								url: [
									'URL must be a valid URL'
								]
							},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate review url values', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						},
						{
							url: 'https://www.bar.com',
							publication: {
								name: 'The Guardian'
							},
							critic: {
								name: 'Arifa Akbar'
							}
						},
						{
							url: 'https://www.foo.com',
							publication: {
								name: 'The Telegraph'
							},
							critic: {
								name: 'Dominic Cavendish'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: '',
							errors: {
								url: [
									'This item has been duplicated within the group'
								]
							},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						},
						{
							url: 'https://www.bar.com',
							date: '',
							errors: {},
							publication: {
								uuid: undefined,
								name: 'The Guardian',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Arifa Akbar',
								differentiator: '',
								errors: {}
							}
						},
						{
							url: 'https://www.foo.com',
							date: '',
							errors: {
								url: [
									'This item has been duplicated within the group'
								]
							},
							publication: {
								uuid: undefined,
								name: 'The Telegraph',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Dominic Cavendish',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review without url value has named publication', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: '',
							publication: {
								name: 'Financial Times'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: '',
							date: '',
							errors: {
								url: [
									'Value is required if named children exist'
								]
							},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: '',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review without url value has named critic', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: '',
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: '',
							date: '',
							errors: {
								url: [
									'Value is required if named children exist'
								]
							},
							publication: {
								uuid: undefined,
								name: '',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review date value with invalid date format', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							date: 'foobar',
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: 'foobar',
							errors: {
								date: [
									'Value must be in date format'
								]
							},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review with url value has publication without name', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							publication: {
								name: ''
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: '',
							errors: {},
							publication: {
								uuid: undefined,
								name: '',
								differentiator: '',
								errors: {
									name: [
										'Value is too short'
									]
								}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review with url value has critic without name', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: ''
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: '',
							errors: {},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: '',
								differentiator: '',
								errors: {
									name: [
										'Value is too short'
									]
								}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review date is in an invalid date format', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							date: 'foobar',
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: 'foobar',
							errors: {
								date: [
									'Value must be in date format'
								]
							},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review publication name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							publication: {
								name: ABOVE_MAX_LENGTH_STRING
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: '',
							errors: {},
							publication: {
								uuid: undefined,
								name: ABOVE_MAX_LENGTH_STRING,
								differentiator: '',
								errors: {
									name: [
										'Value is too long'
									]
								}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review publication differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							publication: {
								name: 'Financial Times',
								differentiator: ABOVE_MAX_LENGTH_STRING
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: '',
							errors: {},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: ABOVE_MAX_LENGTH_STRING,
								errors: {
									differentiator: [
										'Value is too long'
									]
								}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: '',
								errors: {}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review critic name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: ABOVE_MAX_LENGTH_STRING
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: '',
							errors: {},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: ABOVE_MAX_LENGTH_STRING,
								differentiator: '',
								errors: {
									name: [
										'Value is too long'
									]
								}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('review critic differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com',
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: 'Sarah Hemming',
								differentiator: ABOVE_MAX_LENGTH_STRING
							}
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: [
						{
							url: 'https://www.foo.com',
							date: '',
							errors: {},
							publication: {
								uuid: undefined,
								name: 'Financial Times',
								differentiator: '',
								errors: {}
							},
							critic: {
								uuid: undefined,
								name: 'Sarah Hemming',
								differentiator: ABOVE_MAX_LENGTH_STRING,
								errors: {
									differentiator: [
										'Value is too long'
									]
								}
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

});
