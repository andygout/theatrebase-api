import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Instance validation failures: Materials API', () => {

	chai.use(chaiHttp);

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

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(1);

				const response = await chai.request(app)
					.post('/materials')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'material',
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
				expect(await countNodesWithLabel('Material')).to.equal(1);

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(1);

				const response = await chai.request(app)
					.post('/materials')
					.send({
						name: 'The Wild Duck'
					});

				const expectedResponseBody = {
					model: 'material',
					name: 'The Wild Duck',
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

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.put(`/materials/${GHOSTS_MATERIAL_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'material',
					uuid: GHOSTS_MATERIAL_UUID,
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
				expect(await countNodesWithLabel('Material')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Ghosts',
					uuid: GHOSTS_MATERIAL_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.put(`/materials/${GHOSTS_MATERIAL_UUID}`)
					.send({
						name: 'The Wild Duck'
					});

				const expectedResponseBody = {
					model: 'material',
					uuid: GHOSTS_MATERIAL_UUID,
					name: 'The Wild Duck',
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
					model: 'material',
					uuid: GHOSTS_MATERIAL_UUID,
					name: 'Ghosts',
					differentiator: null,
					format: '',
					year: '',
					hasErrors: true,
					errors: {
						associations: [
							'Production'
						]
					},
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
				expect(await countNodesWithLabel('Material')).to.equal(1);

			});

		});

	});

});
