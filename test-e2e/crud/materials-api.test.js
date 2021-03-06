import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Materials API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new material', async () => {

			const response = await chai.request(app)
				.get('/materials/new');

			const expectedResponseBody = {
				model: 'material',
				name: '',
				differentiator: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(MATERIAL_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(0);

			const response = await chai.request(app)
				.post('/materials')
				.send({
					name: 'Uncle Vanya'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Uncle Vanya',
				differentiator: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(1);

		});

		it('gets data required to edit specific material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Uncle Vanya',
				differentiator: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'The Cherry Orchard'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'The Cherry Orchard',
				differentiator: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(1);

		});

		it('shows material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'The Cherry Orchard',
				differentiator: null,
				format: null,
				year: null,
				originalVersionMaterial: null,
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				writingCredits: [],
				characterGroups: [],
				productions: [],
				sourcingMaterialProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				name: 'The Cherry Orchard',
				differentiator: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const MATERIAL_UUID = '9';
		const JOHN_GABRIEL_BORKMAN_ORIGINAL_VERSION_MATERIAL_UUID = '10';
		const HENRIK_IBSEN_PERSON_UUID = '11';
		const IBSEN_THEATRE_COMPANY_UUID = '12';
		const DAVID_ELDRIDGE_PERSON_UUID = '13';
		const JOHN_GABRIEL_BORKMAN_SOURCE_MATERIAL_MATERIAL_UUID = '14';
		const JOHN_GABRIEL_BORKMAN_CHARACTER_UUID = '15';
		const GUNHILD_BORKMAN_CHARACTER_UUID = '16';
		const ERHART_BORKMAN_CHARACTER_UUID = '17';
		const THREE_SISTERS_ORIGINAL_VERSION_MATERIAL_UUID = '26';
		const ANTON_CHEKHOV_PERSON_UUID = '27';
		const CHEKHOV_THEATRE_COMPANY_UUID = '28';
		const BENEDICT_ANDREWS_PERSON_UUID = '29';
		const THREE_SISTERS_SOURCE_MATERIAL_MATERIAL_UUID = '30';
		const OLGA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID = '31';
		const MARIA_SERGEYEVNA_KULYGINA_CHARACTER_UUID = '32';
		const IRINA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID = '33';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(0);

			const response = await chai.request(app)
				.post('/materials')
				.send({
					name: 'John Gabriel Borkman',
					differentiator: '2',
					format: 'play',
					year: 2007,
					originalVersionMaterial: {
						name: 'John Gabriel Borkman',
						differentiator: '1'
					},
					writingCredits: [
						{
							name: '',
							entities: [
								{
									name: 'Henrik Ibsen',
									differentiator: '1'
								},
								// Contrivance for purposes of test.
								{
									model: 'company',
									name: 'Ibsen Theatre Company',
									differentiator: '1'
								}
							]
						},
						{
							name: 'version by',
							entities: [
								{
									name: 'David Eldridge',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'based on',
							entities: [
								{
									model: 'material',
									name: 'John Gabriel Borkman',
									differentiator: '3'
								}
							]
						}
					],
					characterGroups: [
						{
							name: 'The Borkmans',
							characters: [
								{
									name: 'John Gabriel Borkman',
									underlyingName: 'Mr John Gabriel Borkman',
									differentiator: '1',
									qualifier: 'foo'
								},
								{
									name: 'Gunhild Borkman',
									underlyingName: 'Mrs Gunhild Borkman',
									differentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'Erhart Borkman',
									underlyingName: 'Mr Erhart Borkman',
									differentiator: '1',
									qualifier: 'baz'
								}
							]
						}
					]
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				year: 2007,
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: 'John Gabriel Borkman',
					differentiator: '1',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Henrik Ibsen',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'company',
								name: 'Ibsen Theatre Company',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'version by',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'David Eldridge',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'based on',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'material',
								name: 'John Gabriel Borkman',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Borkmans',
						errors: {},
						characters: [
							{
								model: 'character',
								name: 'John Gabriel Borkman',
								underlyingName: 'Mr John Gabriel Borkman',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'character',
								name: 'Gunhild Borkman',
								underlyingName: 'Mrs Gunhild Borkman',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'character',
								name: 'Erhart Borkman',
								underlyingName: 'Mr Erhart Borkman',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(3);

		});

		it('shows material (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				year: 2007,
				originalVersionMaterial: {
					model: 'material',
					uuid: JOHN_GABRIEL_BORKMAN_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'John Gabriel Borkman',
					format: null,
					year: null,
					writingCredits: []
				},
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				writingCredits: [
					{
						model: 'writingCredit',
						name: 'by',
						entities: [
							{
								model: 'person',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
							},
							{
								model: 'company',
								uuid: IBSEN_THEATRE_COMPANY_UUID,
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'version by',
						entities: [
							{
								model: 'person',
								uuid: DAVID_ELDRIDGE_PERSON_UUID,
								name: 'David Eldridge'
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'based on',
						entities: [
							{
								model: 'material',
								uuid: JOHN_GABRIEL_BORKMAN_SOURCE_MATERIAL_MATERIAL_UUID,
								name: 'John Gabriel Borkman',
								format: null,
								year: null,
								writingCredits: []
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Borkmans',
						position: null,
						characters: [
							{
								model: 'character',
								uuid: JOHN_GABRIEL_BORKMAN_CHARACTER_UUID,
								name: 'John Gabriel Borkman',
								qualifier: 'foo'
							},
							{
								model: 'character',
								uuid: GUNHILD_BORKMAN_CHARACTER_UUID,
								name: 'Gunhild Borkman',
								qualifier: 'bar'
							},
							{
								model: 'character',
								uuid: ERHART_BORKMAN_CHARACTER_UUID,
								name: 'Erhart Borkman',
								qualifier: 'baz'
							}
						]
					}
				],
				productions: [],
				sourcingMaterialProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				year: 2007,
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: 'John Gabriel Borkman',
					differentiator: '1',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Henrik Ibsen',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'company',
								name: 'Ibsen Theatre Company',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'version by',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'David Eldridge',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'based on',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'material',
								name: 'John Gabriel Borkman',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Borkmans',
						errors: {},
						characters: [
							{
								model: 'character',
								name: 'John Gabriel Borkman',
								underlyingName: 'Mr John Gabriel Borkman',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'character',
								name: 'Gunhild Borkman',
								underlyingName: 'Mrs Gunhild Borkman',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'character',
								name: 'Erhart Borkman',
								underlyingName: 'Mr Erhart Borkman',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(3);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '2',
					format: 'play',
					year: 2012,
					originalVersionMaterial: {
						name: 'Three Sisters',
						differentiator: '1'
					},
					writingCredits: [
						{
							name: '',
							entities: [
								{
									name: 'Anton Chekhov',
									differentiator: '1'
								},
								// Contrivance for purposes of test.
								{
									model: 'company',
									name: 'Chekhov Theatre Company',
									differentiator: '1'
								}
							]
						},
						{
							name: 'adaptation by',
							entities: [
								{
									name: 'Benedict Andrews',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'based on',
							entities: [
								{
									model: 'material',
									name: 'Three Sisters',
									differentiator: '3'
								}
							]
						}
					],
					characterGroups: [
						{
							name: 'The Prozorovs',
							characters: [
								{
									name: 'Olga',
									underlyingName: 'Olga Sergeyevna Prozorova',
									differentiator: '1',
									qualifier: 'foo'
								},
								{
									name: 'Maria',
									underlyingName: 'Maria Sergeyevna Kulygina',
									differentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'Irina',
									underlyingName: 'Irina Sergeyevna Prozorova',
									differentiator: '1',
									qualifier: 'baz'
								}
							]
						}
					]
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				format: 'play',
				year: 2012,
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: 'Three Sisters',
					differentiator: '1',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Anton Chekhov',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'company',
								name: 'Chekhov Theatre Company',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'adaptation by',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Benedict Andrews',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'based on',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'material',
								name: 'Three Sisters',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Prozorovs',
						errors: {},
						characters: [
							{
								model: 'character',
								name: 'Olga',
								underlyingName: 'Olga Sergeyevna Prozorova',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'character',
								name: 'Maria',
								underlyingName: 'Maria Sergeyevna Kulygina',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'character',
								name: 'Irina',
								underlyingName: 'Irina Sergeyevna Prozorova',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(5);

		});

		it('shows material (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				format: 'play',
				year: 2012,
				originalVersionMaterial: {
					model: 'material',
					uuid: THREE_SISTERS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Three Sisters',
					format: null,
					year: null,
					writingCredits: []
				},
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				writingCredits: [
					{
						model: 'writingCredit',
						name: 'by',
						entities: [
							{
								model: 'person',
								uuid: ANTON_CHEKHOV_PERSON_UUID,
								name: 'Anton Chekhov'
							},
							{
								model: 'company',
								uuid: CHEKHOV_THEATRE_COMPANY_UUID,
								name: 'Chekhov Theatre Company'
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'adaptation by',
						entities: [
							{
								model: 'person',
								uuid: BENEDICT_ANDREWS_PERSON_UUID,
								name: 'Benedict Andrews'
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'based on',
						entities: [
							{
								model: 'material',
								uuid: THREE_SISTERS_SOURCE_MATERIAL_MATERIAL_UUID,
								name: 'Three Sisters',
								format: null,
								year: null,
								writingCredits: []
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Prozorovs',
						position: null,
						characters: [
							{
								model: 'character',
								uuid: OLGA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID,
								name: 'Olga',
								qualifier: 'foo'
							},
							{
								model: 'character',
								uuid: MARIA_SERGEYEVNA_KULYGINA_CHARACTER_UUID,
								name: 'Maria',
								qualifier: 'bar'
							},
							{
								model: 'character',
								uuid: IRINA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID,
								name: 'Irina',
								qualifier: 'baz'
							}
						]
					}
				],
				productions: [],
				sourcingMaterialProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates material to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(5);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '2'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(5);

		});

		it('deletes material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(5);

			const response = await chai.request(app)
				.delete(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				name: 'Three Sisters',
				differentiator: '2',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(4);

		});

	});

	describe('GET list endpoint', () => {

		const HAUNTING_JULIA_MATERIAL_UUID = '2';
		const A_WORD_FROM_OUR_SPONSOR_MATERIAL_UUID = '6';
		const THE_MUSICAL_JIGSAW_PLAY_MATERIAL_UUID = '10';
		const DREAMS_FROM_A_SUMMER_HOUSE_MATERIAL_UUID = '14';
		const COMMUNICATING_DOORS_MATERIAL_UUID = '18';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'Haunting Julia',
					format: 'play',
					year: 1994
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'A Word from Our Sponsor',
					format: 'play',
					year: 1995
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'The Musical Jigsaw Play',
					format: 'play',
					year: 1994
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'Dreams from a Summer House',
					format: 'play',
					year: 1992
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'Communicating Doors',
					format: 'play',
					year: 1994
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all materials ordered by year then name', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'material',
					uuid: A_WORD_FROM_OUR_SPONSOR_MATERIAL_UUID,
					name: 'A Word from Our Sponsor',
					format: 'play',
					year: 1995,
					writingCredits: []
				},
				{
					model: 'material',
					uuid: COMMUNICATING_DOORS_MATERIAL_UUID,
					name: 'Communicating Doors',
					format: 'play',
					year: 1994,
					writingCredits: []
				},
				{
					model: 'material',
					uuid: HAUNTING_JULIA_MATERIAL_UUID,
					name: 'Haunting Julia',
					format: 'play',
					year: 1994,
					writingCredits: []
				},
				{
					model: 'material',
					uuid: THE_MUSICAL_JIGSAW_PLAY_MATERIAL_UUID,
					name: 'The Musical Jigsaw Play',
					format: 'play',
					year: 1994,
					writingCredits: []
				},
				{
					model: 'material',
					uuid: DREAMS_FROM_A_SUMMER_HOUSE_MATERIAL_UUID,
					name: 'Dreams from a Summer House',
					format: 'play',
					year: 1992,
					writingCredits: []
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
