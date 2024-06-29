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

chai.use(chaiHttp);

describe('Database validation failures: Productions API', () => {

	describe('attempt to create instance', () => {

		context('sub-production uuid does not exist in database', () => {

			before(async () => {

				await purgeDatabase();

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(0);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: 'Sur-Grault',
						subProductions: [
							{
								uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					name: 'Sur-Grault',
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

		context('sub-production is already assigned to another sur-production', () => {

			const SUR_GRAULT_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Production',
					uuid: SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: SUR_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: SUB_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(2);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: 'Sur-Garply',
						subProductions: [
							{
								uuid: SUB_GRAULT_PRODUCTION_UUID
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					name: 'Sur-Garply',
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
							uuid: SUB_GRAULT_PRODUCTION_UUID,
							errors: {
								uuid: [
									'Production with this UUID is already assigned to another sur-production'
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
				expect(await countNodesWithLabel('Production')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Sur-Garply'
				})).to.be.false;

			});

		});

		context('sub-production is the sur-most production of an existing three-tiered production collection', () => {

			const SUR_GRAULT_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const MID_GRAULT_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUB_GRAULT_PRODUCTION_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Production',
					uuid: SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: MID_GRAULT_PRODUCTION_UUID,
					name: 'Mid-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: SUR_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: MID_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: MID_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: SUB_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(3);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: 'Sur-Sur-Grault',
						subProductions: [
							{
								uuid: SUR_GRAULT_PRODUCTION_UUID
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					name: 'Sur-Sur-Grault',
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
							uuid: SUR_GRAULT_PRODUCTION_UUID,
							errors: {
								uuid: [
									'Production with this UUID is the sur-most production of a three-tiered production collection'
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
				expect(await countNodesWithLabel('Production')).to.equal(3);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Sur-Sur-Grault'
				})).to.be.false;

			});

		});

	});

	describe('attempt to update instance', () => {

		context('sub-production uuid does not exist in database', () => {

			const SUR_GRAULT_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Production',
					uuid: SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Grault'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.put(`/productions/${SUR_GRAULT_PRODUCTION_UUID}`)
					.send({
						name: 'Sur-Grault',
						subProductions: [
							{
								uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Grault',
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
				expect(await countNodesWithLabel('Production')).to.equal(1);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Sur-Grault',
					uuid: SUR_GRAULT_PRODUCTION_UUID
				})).to.be.true;

			});

		});

		context('sub-production is instance\'s sur-production', () => {

			const SUR_GRAULT_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Production',
					uuid: SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: SUR_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: SUB_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(2);

				const response = await chai.request(app)
					.put(`/productions/${SUB_GRAULT_PRODUCTION_UUID}`)
					.send({
						name: 'Sub-Grault',
						subProductions: [
							{
								uuid: SUR_GRAULT_PRODUCTION_UUID
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Grault',
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
							uuid: SUR_GRAULT_PRODUCTION_UUID,
							errors: {
								uuid: [
									'Production with this UUID is this production\'s sur-production'
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
				expect(await countNodesWithLabel('Production')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Sub-Grault',
					uuid: SUB_GRAULT_PRODUCTION_UUID
				})).to.be.true;

			});

		});

		context('sub-production is already assigned to another sur-production', () => {

			const SUR_GRAULT_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUR_GARPLY_PRODUCTION_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Production',
					uuid: SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: SUR_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: SUB_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

				await createNode({
					label: 'Production',
					uuid: SUR_GARPLY_PRODUCTION_UUID,
					name: 'Sur-Garply'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(3);

				const response = await chai.request(app)
					.put(`/productions/${SUR_GARPLY_PRODUCTION_UUID}`)
					.send({
						name: 'Sur-Garply',
						subProductions: [
							{
								uuid: SUB_GRAULT_PRODUCTION_UUID
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: SUR_GARPLY_PRODUCTION_UUID,
					name: 'Sur-Garply',
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
							uuid: SUB_GRAULT_PRODUCTION_UUID,
							errors: {
								uuid: [
									'Production with this UUID is already assigned to another sur-production'
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
				expect(await countNodesWithLabel('Production')).to.equal(3);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Sur-Garply',
					uuid: SUR_GARPLY_PRODUCTION_UUID
				})).to.be.true;

			});

		});

		context('sub-production is the sur-most production of an existing three-tiered production collection', () => {

			const SUR_GRAULT_PRODUCTION_UUID = 'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww';
			const MID_GRAULT_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUR_SUR_GRAULT_PRODUCTION_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Production',
					uuid: SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: MID_GRAULT_PRODUCTION_UUID,
					name: 'Mid-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: SUR_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: MID_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: MID_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: SUB_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

				await createNode({
					label: 'Production',
					uuid: SUR_SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Sur-Grault'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(4);

				const response = await chai.request(app)
					.put(`/productions/${SUR_SUR_GRAULT_PRODUCTION_UUID}`)
					.send({
						name: 'Sur-Sur-Grault',
						subProductions: [
							{
								uuid: SUR_GRAULT_PRODUCTION_UUID
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: SUR_SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Sur-Grault',
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
							uuid: SUR_GRAULT_PRODUCTION_UUID,
							errors: {
								uuid: [
									'Production with this UUID is the sur-most production of a three-tiered production collection'
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
				expect(await countNodesWithLabel('Production')).to.equal(4);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Sur-Sur-Grault',
					uuid: SUR_SUR_GRAULT_PRODUCTION_UUID
				})).to.be.true;

			});

		});

		context('subject production is the sub-most production of an existing three-tiered production collection; a further sub-production tier is disallowed', () => {

			const SUR_GRAULT_PRODUCTION_UUID = 'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww';
			const MID_GRAULT_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUB_SUB_GRAULT_PRODUCTION_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Production',
					uuid: SUR_GRAULT_PRODUCTION_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: MID_GRAULT_PRODUCTION_UUID,
					name: 'Mid-Grault'
				});

				await createNode({
					label: 'Production',
					uuid: SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: SUR_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: MID_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

				await createRelationship({
					sourceLabel: 'Production',
					sourceUuid: MID_GRAULT_PRODUCTION_UUID,
					destinationLabel: 'Production',
					destinationUuid: SUB_GRAULT_PRODUCTION_UUID,
					relationshipName: 'HAS_SUB_PRODUCTION'
				});

				await createNode({
					label: 'Production',
					uuid: SUB_SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Sub-Grault'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(4);

				const response = await chai.request(app)
					.put(`/productions/${SUB_GRAULT_PRODUCTION_UUID}`)
					.send({
						name: 'Sub-Grault',
						subProductions: [
							{
								uuid: SUB_SUB_GRAULT_PRODUCTION_UUID
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: SUB_GRAULT_PRODUCTION_UUID,
					name: 'Sub-Grault',
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
							uuid: SUB_SUB_GRAULT_PRODUCTION_UUID,
							errors: {
								uuid: [
									'Sub-production cannot be assigned to a three-tiered production collection'
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
				expect(await countNodesWithLabel('Production')).to.equal(4);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Sub-Grault',
					uuid: SUB_GRAULT_PRODUCTION_UUID
				})).to.be.true;

			});

		});

	});

});
