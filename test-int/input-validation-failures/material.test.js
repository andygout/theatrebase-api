import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Material from '../../src/models/Material.js';
import * as neo4jQueryModule from '../../src/neo4j/query.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);
const INVALID_YEAR_STRING = 'Nineteen Fifty-Nine';

const methods = [
	'create',
	'update'
];

const sandbox = createSandbox();

describe('Input validation failures: Material instance', () => {

	beforeEach(() => {

		// Stub with a contrived resolution that ensures various
		// neo4jQuery function calls all pass database validation.
		sandbox
			.stub(neo4jQueryModule, 'neo4jQuery')
			.resolves({
				isExistent: true,
				isDuplicate: false,
				isAssignedToSurMaterial: false,
				isSourcingMaterialOfSubjectMaterial: false,
				isSubsequentVersionMaterialOfSubjectMaterial: false,
				isSurSurMaterial: false,
				isSurMaterialOfSubjectMaterial: false,
				isSubjectMaterialASubSubMaterial: false
			});

	});

	afterEach(() => {

		sandbox.restore();

	});

	context('name value is empty string', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Material({ name: '' });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Material({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Material({ name: 'Rosmersholm', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {
						differentiator: [
							'Value is too long'
						]
					},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('subtitle value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Material({ name: 'Rosmersholm', subtitle: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: ABOVE_MAX_LENGTH_STRING,
					format: '',
					year: '',
					hasErrors: true,
					errors: {
						subtitle: [
							'Value is too long'
						]
					},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('format value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Material({ name: 'Rosmersholm', format: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: ABOVE_MAX_LENGTH_STRING,
					year: '',
					hasErrors: true,
					errors: {
						format: [
							'Value is too long'
						]
					},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('year value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new Material({ name: 'Rosmersholm', year: INVALID_YEAR_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: INVALID_YEAR_STRING,
					hasErrors: true,
					errors: {
						year: [
							'Value must be a valid year'
						]
					},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('original version material name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					originalVersionMaterial: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('original version material differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					originalVersionMaterial: {
						name: 'Rosmersholm',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: 'Rosmersholm',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('material instance assigns itself as the original version material', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					originalVersionMaterial: {
						name: 'Rosmersholm'
					}
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: 'Rosmersholm',
						differentiator: '',
						errors: {
							name: [
								'Instance cannot form association with itself'
							],
							differentiator: [
								'Instance cannot form association with itself'
							]
						}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('writingCredit name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							creditType: null,
							errors: {
								name: [
									'Value is too long'
								]
							},
							entities: []
						}
					],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate writingCredits', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							name: 'version by'
						},
						{
							name: 'version by'
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: 'version by',
							creditType: null,
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						},
						{
							name: 'version by',
							creditType: null,
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						}
					],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('writing entity (person) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: '',
							creditType: null,
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
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('writing entity (person) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									name: 'Henrik Ibsen',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: '',
							creditType: null,
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Henrik Ibsen',
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
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('writing entity (company) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'COMPANY',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: '',
							creditType: null,
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
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('writing entity (company) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'COMPANY',
									name: 'Ibsen Theatre Company',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: '',
							creditType: null,
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Ibsen Theatre Company',
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
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('writing entity (source material) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'MATERIAL',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: '',
							creditType: null,
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
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('writing entity (source material) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'MATERIAL',
									name: 'Rosmersholm',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: '',
							creditType: null,
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Rosmersholm',
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
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate entities', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									name: 'Henrik Ibsen'
								},
								{
									name: 'Foo'
								},
								{
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									name: 'Foo'
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: '',
							creditType: null,
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Henrik Ibsen',
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
								},
								{
									uuid: undefined,
									name: 'Henrik Ibsen',
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
						}
					],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);
				expect(result.writingCredits[0].entities[1].model).to.equal('PERSON');
				expect(result.writingCredits[0].entities[3].model).to.equal('COMPANY');

			});

		}

	});

	context('material instance assigns itself as source material', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'MATERIAL',
									name: 'Rosmersholm'
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [
						{
							name: '',
							creditType: null,
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Rosmersholm',
									differentiator: '',
									errors: {
										name: [
											'Instance cannot form association with itself'
										],
										differentiator: [
											'Instance cannot form association with itself'
										]
									}
								}
							]
						}
					],
					subMaterials: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('sub-material name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'The Coast of Utopia',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
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
					],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('sub-material differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'Voyage',
							differentiator: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'The Coast of Utopia',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							uuid: undefined,
							name: 'Voyage',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							errors: {
								differentiator: [
									'Value is too long'
								]
							}
						}
					],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('material instance assigns itself as a sub-material', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'The Coast of Utopia'
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'The Coast of Utopia',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							uuid: undefined,
							name: 'The Coast of Utopia',
							differentiator: '',
							errors: {
								name: [
									'Instance cannot form association with itself'
								],
								differentiator: [
									'Instance cannot form association with itself'
								]
							}
						}
					],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate sub-materials', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'Voyage'
						},
						{
							name: 'Shipwreck',
							differentiator: '1'
						},
						{
							name: 'Voyage'
						},
						{
							name: 'Shipwreck',
							differentiator: '2'
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'The Coast of Utopia',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							uuid: undefined,
							name: 'Voyage',
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
							name: 'Shipwreck',
							differentiator: '1',
							errors: {}
						},
						{
							uuid: undefined,
							name: 'Voyage',
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
							name: 'Shipwreck',
							differentiator: '2',
							errors: {}
						}
					],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('characterGroup name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							characters: []
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('character name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							characters: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							name: '',
							errors: {},
							characters: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									underlyingName: '',
									differentiator: '',
									qualifier: '',
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('character underlyingName value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							characters: [
								{
									name: 'Johannes Rosmer',
									underlyingName: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							name: '',
							errors: {},
							characters: [
								{
									uuid: undefined,
									name: 'Johannes Rosmer',
									underlyingName: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									qualifier: '',
									errors: {
										underlyingName: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('character differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							characters: [
								{
									name: 'Johannes Rosmer',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							name: '',
							errors: {},
							characters: [
								{
									uuid: undefined,
									name: 'Johannes Rosmer',
									underlyingName: '',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									qualifier: '',
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('character qualifier value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							characters: [
								{
									name: 'Johannes Rosmer',
									qualifier: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							name: '',
							errors: {},
							characters: [
								{
									uuid: undefined,
									name: 'Johannes Rosmer',
									underlyingName: '',
									differentiator: '',
									qualifier: ABOVE_MAX_LENGTH_STRING,
									errors: {
										qualifier: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('character name and underlyingName values are the same', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							characters: [
								{
									name: 'Johannes Rosmer',
									underlyingName: 'Johannes Rosmer'
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							name: '',
							errors: {},
							characters: [
								{
									uuid: undefined,
									name: 'Johannes Rosmer',
									underlyingName: 'Johannes Rosmer',
									differentiator: '',
									qualifier: '',
									errors: {
										underlyingName: [
											'Underlying name is only required if different from character name'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate characters', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							characters: [
								{
									name: 'Johannes Rosmer'
								},
								{
									name: 'Rebecca West',
									underlyingName: 'Becca West'
								},
								{
									name: 'Johannes Rosmer'
								},
								{
									name: 'Ms Rebecca West',
									underlyingName: 'Rebecca West'
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							name: '',
							errors: {},
							characters: [
								{
									uuid: undefined,
									name: 'Johannes Rosmer',
									underlyingName: '',
									differentiator: '',
									qualifier: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										underlyingName: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										],
										qualifier: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									uuid: undefined,
									name: 'Rebecca West',
									underlyingName: 'Becca West',
									differentiator: '',
									qualifier: '',
									errors: {}
								},
								{
									uuid: undefined,
									name: 'Johannes Rosmer',
									underlyingName: '',
									differentiator: '',
									qualifier: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										underlyingName: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										],
										qualifier: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									uuid: undefined,
									name: 'Ms Rebecca West',
									underlyingName: 'Rebecca West',
									differentiator: '',
									qualifier: '',
									errors: {}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

});
