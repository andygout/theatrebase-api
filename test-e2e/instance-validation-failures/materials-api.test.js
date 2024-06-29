import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app.js';
import {
	countNodesWithLabel,
	createNode,
	createRelationship,
	isNodeExistent,
	purgeDatabase
} from '../test-helpers/neo4j/index.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

chai.use(chaiHttp);

describe('Instance validation failures: Materials API', () => {

	describe('attempt to create instance', () => {

		const THE_WILD_DUCK_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: THE_WILD_DUCK_MATERIAL_UUID,
				name: 'The Wild Duck'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(1);

				const response = await chai.request(app)
					.post('/materials')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
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
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(1);

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(1);

				const response = await chai.request(app)
					.post('/materials')
					.send({
						name: 'The Wild Duck'
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					name: 'The Wild Duck',
					differentiator: '',
					subtitle: '',
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
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(1);

			});

		});

		context('instance has both input and database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(1);

				const response = await chai.request(app)
					.post('/materials')
					.send({
						name: 'The Wild Duck',
						characterGroups: [
							{
								name: ABOVE_MAX_LENGTH_STRING
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					name: 'The Wild Duck',
					differentiator: '',
					subtitle: '',
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
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							model: 'CHARACTER_GROUP',
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(1);

			});

		});

	});

	describe('attempt to update instance', () => {

		const GHOSTS_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const THE_WILD_DUCK_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: GHOSTS_MATERIAL_UUID,
				name: 'Ghosts'
			});

			await createNode({
				label: 'Material',
				uuid: THE_WILD_DUCK_MATERIAL_UUID,
				name: 'The Wild Duck'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.put(`/materials/${GHOSTS_MATERIAL_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: GHOSTS_MATERIAL_UUID,
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
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Ghosts',
					uuid: GHOSTS_MATERIAL_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.put(`/materials/${GHOSTS_MATERIAL_UUID}`)
					.send({
						name: 'The Wild Duck'
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: GHOSTS_MATERIAL_UUID,
					name: 'The Wild Duck',
					differentiator: '',
					subtitle: '',
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
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Ghosts',
					uuid: GHOSTS_MATERIAL_UUID
				})).to.be.true;

			});

		});

		context('instance has both input and database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.put(`/materials/${GHOSTS_MATERIAL_UUID}`)
					.send({
						name: 'The Wild Duck',
						characterGroups: [
							{
								name: ABOVE_MAX_LENGTH_STRING
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: GHOSTS_MATERIAL_UUID,
					name: 'The Wild Duck',
					differentiator: '',
					subtitle: '',
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
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: [
						{
							model: 'CHARACTER_GROUP',
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Ghosts',
					uuid: GHOSTS_MATERIAL_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const GHOSTS_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const GHOSTS_ALMEIDA_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: GHOSTS_MATERIAL_UUID,
				name: 'Ghosts'
			});

			await createNode({
				label: 'Production',
				uuid: GHOSTS_ALMEIDA_PRODUCTION_UUID,
				name: 'Ghosts'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: GHOSTS_ALMEIDA_PRODUCTION_UUID,
				destinationLabel: 'Material',
				destinationUuid: GHOSTS_MATERIAL_UUID,
				relationshipName: 'PRODUCTION_OF'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/materials/${GHOSTS_MATERIAL_UUID}`);

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: GHOSTS_MATERIAL_UUID,
					name: 'Ghosts',
					differentiator: null,
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {
						associations: [
							'Production'
						]
					},
					originalVersionMaterial: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(1);

			});

		});

	});

});
