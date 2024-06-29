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

describe('Instance validation failures: Productions API', () => {

	describe('attempt to create instance', () => {

		before(async () => {

			await purgeDatabase();

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(0);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					subtitle: '',
					name: '',
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
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						model: 'SEASON',
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						model: 'FESTIVAL',
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(0);

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(0);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: 'Macbeth',
						subProductions: [
							{
								uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					name: 'Macbeth',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						model: 'SEASON',
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						model: 'FESTIVAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [
						{
							model: 'PRODUCTION_IDENTIFIER',
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							errors: {
								uuid: [
									'Production with this UUID does not exist'
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(0);

			});

		});

		context('instance has both input and database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(0);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: 'Macbeth',
						material: {
							name: ABOVE_MAX_LENGTH_STRING
						},
						subProductions: [
							{
								uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					name: 'Macbeth',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						model: 'MATERIAL',
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						model: 'SEASON',
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						model: 'FESTIVAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [
						{
							model: 'PRODUCTION_IDENTIFIER',
							uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
							errors: {
								uuid: [
									'Production with this UUID does not exist'
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(0);

			});

		});

	});

	describe('attempt to update instance', () => {

		const MACBETH_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: MACBETH_PRODUCTION_UUID,
				name: 'Macbeth'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.put(`/productions/${MACBETH_PRODUCTION_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: MACBETH_PRODUCTION_UUID,
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
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						model: 'SEASON',
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						model: 'FESTIVAL',
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(1);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Macbeth',
					uuid: MACBETH_PRODUCTION_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.put(`/productions/${MACBETH_PRODUCTION_UUID}`)
					.send({
						name: 'Macbeth',
						subProductions: [
							{
								uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: MACBETH_PRODUCTION_UUID,
					name: 'Macbeth',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						model: 'SEASON',
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						model: 'FESTIVAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [
						{
							model: 'PRODUCTION_IDENTIFIER',
							uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
							errors: {
								uuid: [
									'Production with this UUID does not exist'
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(1);

			});

		});

		context('instance has both input and database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.put(`/productions/${MACBETH_PRODUCTION_UUID}`)
					.send({
						name: 'Macbeth',
						material: {
							name: ABOVE_MAX_LENGTH_STRING
						},
						subProductions: [
							{
								uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: MACBETH_PRODUCTION_UUID,
					name: 'Macbeth',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						model: 'MATERIAL',
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						model: 'SEASON',
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						model: 'FESTIVAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					subProductions: [
						{
							model: 'PRODUCTION_IDENTIFIER',
							uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
							errors: {
								uuid: [
									'Production with this UUID does not exist'
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(1);

			});

		});

	});

	describe('attempt to delete instance', () => {

		const OTHELLO_DONMAR_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const DONMAR_WAREHOUSE_VENUE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
		const OTHELLO_MATERIAL_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: OTHELLO_DONMAR_PRODUCTION_UUID,
				name: 'Othello'
			});

			await createNode({
				label: 'Venue',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse'
			});

			await createNode({
				label: 'Material',
				uuid: OTHELLO_MATERIAL_UUID,
				name: 'Othello'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: OTHELLO_DONMAR_PRODUCTION_UUID,
				destinationLabel: 'Venue',
				destinationUuid: DONMAR_WAREHOUSE_VENUE_UUID,
				relationshipName: 'PLAYS_AT'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: OTHELLO_DONMAR_PRODUCTION_UUID,
				destinationLabel: 'Material',
				destinationUuid: OTHELLO_MATERIAL_UUID,
				relationshipName: 'PRODUCTION_OF'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/productions/${OTHELLO_DONMAR_PRODUCTION_UUID}`);

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: OTHELLO_DONMAR_PRODUCTION_UUID,
					name: 'Othello',
					subtitle: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						associations: [
							'Material',
							'Venue'
						]
					},
					material: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					season: {
						model: 'SEASON',
						name: '',
						differentiator: '',
						errors: {}
					},
					festival: {
						model: 'FESTIVAL',
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

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(1);

			});

		});

	});

});
