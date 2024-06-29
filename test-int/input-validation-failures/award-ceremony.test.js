import { expect } from 'chai';
import { createSandbox } from 'sinon';

import AwardCeremony from '../../src/models/AwardCeremony.js';
import * as neo4jQueryModule from '../../src/neo4j/query.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

const methods = [
	'create',
	'update'
];

const sandbox = createSandbox();

describe('Input validation failures: AwardCeremony instance', () => {

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

				const instance = new AwardCeremony({ name: '' });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instance = new AwardCeremony({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('award name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2020',
					award: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					categories: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('award differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: 'Laurence Olivier Awards',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					categories: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('category name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2020',
					categories: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							nominations: []
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate categories', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2020',
					categories: [
						{
							name: 'Best New Play'
						},
						{
							name: 'Best New Musical'
						},
						{
							name: 'Best New Play'
						},
						{
							name: 'Best Revival'
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best New Play',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							nominations: []
						},
						{
							name: 'Best New Musical',
							errors: {},
							nominations: []
						},
						{
							name: 'Best New Play',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							nominations: []
						},
						{
							name: 'Best Revival',
							errors: {},
							nominations: []
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('category without name has named nomination entities', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: '',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt'
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: '',
							errors: {
								name: [
									'Value is required if named children exist'
								]
							},
							nominations: [
								{
									isWinner: false,
									customType: '',
									entities: [
										{
											uuid: undefined,
											name: 'Christopher Shutt',
											differentiator: '',
											errors: {}
										}
									],
									productions: [],
									materials: [],
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

	context('category nomination customType value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									customType: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: ABOVE_MAX_LENGTH_STRING,
									entities: [],
									productions: [],
									materials: [],
									errors: {
										customType: [
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

	context('category nomination entity (person) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
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
									],
									productions: [],
									materials: [],
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

	context('category nomination entity (person) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
									entities: [
										{
											uuid: undefined,
											name: 'Christopher Shutt',
											differentiator: ABOVE_MAX_LENGTH_STRING,
											errors: {
												differentiator: [
													'Value is too long'
												]
											}
										}
									],
									productions: [],
									materials: [],
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

	context('category nomination entity (company) name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
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
									],
									productions: [],
									materials: [],
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

	context('category nomination entity (company) differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
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
									],
									productions: [],
									materials: [],
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

	context('duplicate category nomination entities, including category nomination entity (company) nominated members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson'
												},
												{
													name: 'Foo'
												}
											]
										},
										{
											name: 'Ian Dickinson'
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
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
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
													name: 'Ian Dickinson',
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
											name: 'Ian Dickinson',
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
									],
									productions: [],
									materials: [],
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

	context('category nomination entity (company) without name has named nominated members', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: '',
											members: [
												{
													name: 'Ian Dickinson'
												}
											]
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
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
													name: 'Ian Dickinson',
													differentiator: '',
													errors: {}
												}
											]
										}
									],
									productions: [],
									materials: [],
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

	context('category nomination entity (company) nominated member name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
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
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
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
									],
									productions: [],
									materials: [],
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

	context('category nomination entity (company) nominated member differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson',
													differentiator: ABOVE_MAX_LENGTH_STRING
												}
											]
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
									entities: [
										{
											uuid: undefined,
											name: 'Autograph',
											differentiator: '',
											errors: {},
											members: [
												{
													uuid: undefined,
													name: 'Ian Dickinson',
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
									productions: [],
									materials: [],
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

	context('category nomination production uuid value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									productions: [
										{
											uuid: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
									entities: [],
									productions: [
										{
											uuid: ABOVE_MAX_LENGTH_STRING,
											errors: {
												uuid: [
													'Value is too long'
												]
											}
										}
									],
									materials: [],
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

	context('duplicate category nomination productions', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									productions: [
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
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best Sound Design',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
									entities: [],
									productions: [
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
									materials: [],
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

	context('category nomination material name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best New Play',
							nominations: [
								{
									entities: [
										{
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best New Play',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
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
									],
									productions: [],
									materials: [],
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

	context('category nomination material differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best New Play',
							nominations: [
								{
									entities: [
										{
											name: 'Jerusalem',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best New Play',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
									entities: [
										{
											uuid: undefined,
											name: 'Jerusalem',
											differentiator: ABOVE_MAX_LENGTH_STRING,
											errors: {
												differentiator: [
													'Value is too long'
												]
											}
										}
									],
									productions: [],
									materials: [],
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

	context('duplicate category nomination materials', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const instanceProps = {
					name: '2010',
					categories: [
						{
							name: 'Best New Play',
							nominations: [
								{
									materials: [
										{
											name: 'Jerusalem'
										},
										{
											name: 'The Mountaintop'
										},
										{
											name: 'Jerusalem'
										}
									]
								}
							]
						}
					]
				};

				const instance = new AwardCeremony(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '2010',
					hasErrors: true,
					errors: {},
					award: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							name: 'Best New Play',
							errors: {},
							nominations: [
								{
									isWinner: false,
									customType: '',
									entities: [],
									productions: [],
									materials: [
										{
											uuid: undefined,
											name: 'Jerusalem',
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
											name: 'The Mountaintop',
											differentiator: '',
											errors: {}
										},
										{
											uuid: undefined,
											name: 'Jerusalem',
											differentiator: '',
											errors: {
												name: [
													'This item has been duplicated within the group'
												],
												differentiator: [
													'This item has been duplicated within the group'
												]
											}
										}
									],
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
