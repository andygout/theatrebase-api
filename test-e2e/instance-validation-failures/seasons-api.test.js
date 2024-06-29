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

describe('Instance validation failures: Seasons API', () => {

	describe('attempt to create instance', () => {

		const NOT_BLACK_AND_WHITE_SEASON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Season',
				uuid: NOT_BLACK_AND_WHITE_SEASON_UUID,
				name: 'Not Black and White'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Season')).to.equal(1);

				const response = await chai.request(app)
					.post('/seasons')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'SEASON',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Season')).to.equal(1);

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Season')).to.equal(1);

				const response = await chai.request(app)
					.post('/seasons')
					.send({
						name: 'Not Black and White'
					});

				const expectedResponseBody = {
					model: 'SEASON',
					name: 'Not Black and White',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Season')).to.equal(1);

			});

		});

	});

	describe('attempt to update instance', () => {

		const THE_DAVID_HARE_SEASON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const NOT_BLACK_AND_WHITE_SEASON_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Season',
				uuid: THE_DAVID_HARE_SEASON_UUID,
				name: 'The David Hare Season'
			});

			await createNode({
				label: 'Season',
				uuid: NOT_BLACK_AND_WHITE_SEASON_UUID,
				name: 'Not Black and White'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Season')).to.equal(2);

				const response = await chai.request(app)
					.put(`/seasons/${THE_DAVID_HARE_SEASON_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'SEASON',
					uuid: THE_DAVID_HARE_SEASON_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Season')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Season',
					name: 'The David Hare Season',
					uuid: THE_DAVID_HARE_SEASON_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Season')).to.equal(2);

				const response = await chai.request(app)
					.put(`/seasons/${THE_DAVID_HARE_SEASON_UUID}`)
					.send({
						name: 'Not Black and White'
					});

				const expectedResponseBody = {
					model: 'SEASON',
					uuid: THE_DAVID_HARE_SEASON_UUID,
					name: 'Not Black and White',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Season')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Season',
					name: 'The David Hare Season',
					uuid: THE_DAVID_HARE_SEASON_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const THE_DAVID_HARE_SEASON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const PLENTY_SHEFFIELD_THEATRES_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Season',
				uuid: THE_DAVID_HARE_SEASON_UUID,
				name: 'The David Hare Season'
			});

			await createNode({
				label: 'Production',
				uuid: PLENTY_SHEFFIELD_THEATRES_PRODUCTION_UUID,
				name: 'Plenty'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: PLENTY_SHEFFIELD_THEATRES_PRODUCTION_UUID,
				destinationLabel: 'Season',
				destinationUuid: THE_DAVID_HARE_SEASON_UUID,
				relationshipName: 'PART_OF_SEASON'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Season')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/seasons/${THE_DAVID_HARE_SEASON_UUID}`);

				const expectedResponseBody = {
					model: 'SEASON',
					uuid: THE_DAVID_HARE_SEASON_UUID,
					name: 'The David Hare Season',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: [
							'Production'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Season')).to.equal(1);

			});

		});

	});

});
