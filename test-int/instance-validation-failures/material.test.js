import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Material from '../../src/models/Material';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Material instance', () => {

	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);
	const INVALID_YEAR_STRING = 'Nineteen Fifty-Nine';

	const sandbox = createSandbox();

	afterEach(() => {

		sandbox.restore();

	});

	describe('input validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 0 });

		});

		context('name value is empty string', () => {

			it('assigns appropriate error', async () => {

				const instance = new Material({ name: '' });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Material({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Material({ name: 'Rosmersholm', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: ABOVE_MAX_LENGTH_STRING,
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('format value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Material({ name: 'Rosmersholm', format: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('year value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Material({ name: 'Rosmersholm', year: INVALID_YEAR_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('original version material name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					originalVersionMaterial: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('original version material differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					originalVersionMaterial: {
						name: 'Rosmersholm',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('material instance assigns itself as the original version material', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					originalVersionMaterial: {
						name: 'Rosmersholm'
					}
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writingCredit name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate writingCredits', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writing entity (person) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writing entity (person) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writing entity (company) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'company',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writing entity (company) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'company',
									name: 'Ibsen Theatre Company',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writing entity (source material) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'material',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writing entity (source material) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'material',
									name: 'Rosmersholm',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate entities', () => {

			it('assigns appropriate error', async () => {

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
									model: 'company',
									name: 'Foo'
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);
				expect(result.writingCredits[0].entities[1].model).to.equal('person');
				expect(result.writingCredits[0].entities[3].model).to.equal('company');

			});

		});

		context('material instance assigns itself as source material', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writingCredits: [
						{
							entities: [
								{
									model: 'material',
									name: 'Rosmersholm'
								}
							]
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('characterGroup name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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

		});

		context('duplicate characterGroups', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characterGroups: [
						{
							name: 'Rosmersholm residents'
						},
						{
							name: 'Rosmersholm residents'
						}
					]
				};

				const instance = new Material(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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
					characterGroups: [
						{
							name: 'Rosmersholm residents',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							characters: []
						},
						{
							name: 'Rosmersholm residents',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							characters: []
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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

		});

		context('character underlyingName value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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

		});

		context('character differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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

		});

		context('character qualifier value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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

		});

		context('character name and underlyingName values are the same', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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

		});

		context('duplicate characters', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
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

		});

	});

	describe('database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 1 });

		});

		context('name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instance = new Material({ name: 'Rosmersholm' });

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					characterGroups: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('combined input and database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 1 });

		});

		context('character name value exceeds maximum limit and name value already exists in database', () => {

			it('assigns appropriate error', async () => {

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

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					originalVersionMaterial: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
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

		});

	});

});
