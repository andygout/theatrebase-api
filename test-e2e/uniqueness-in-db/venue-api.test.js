import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, createNode, purgeDatabase } from '../test-helpers/neo4j/index.js';

chai.use(chaiHttp);

const sandbox = createSandbox();

describe('Uniqueness in database: Venues API', () => {

	describe('Venue uniqueness in database', () => {

		const VENUE_1_UUID = '1';
		const VENUE_2_UUID = '4';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates venue without differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(0);

			const response = await chai.request(app)
				.post('/venues')
				.send({
					name: 'New Theatre'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_1_UUID,
				name: 'New Theatre',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(1);

		});

		it('responds with errors if trying to create existing venue that does also not have differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(1);

			const response = await chai.request(app)
				.post('/venues')
				.send({
					name: 'New Theatre'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				name: 'New Theatre',
				differentiator: '',
				hasErrors: true,
				errors: {
					name: [
						'Name and differentiator combination already exists'
					],
					differentiator: [
						'Name and differentiator combination already exists'
					]
				},
				subVenues: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(1);

		});

		it('creates venue with same name as existing venue but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(1);

			const response = await chai.request(app)
				.post('/venues')
				.send({
					name: 'New Theatre',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_2_UUID,
				name: 'New Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(2);

		});

		it('responds with errors if trying to update venue to one with same name and differentiator combination', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(2);

			const response = await chai.request(app)
				.put(`/venues/${VENUE_1_UUID}`)
				.send({
					name: 'New Theatre',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_1_UUID,
				name: 'New Theatre',
				differentiator: '1',
				hasErrors: true,
				errors: {
					name: [
						'Name and differentiator combination already exists'
					],
					differentiator: [
						'Name and differentiator combination already exists'
					]
				},
				subVenues: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(2);

		});

		it('updates venue with same name as existing venue but uses a different differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(2);

			const response = await chai.request(app)
				.put(`/venues/${VENUE_1_UUID}`)
				.send({
					name: 'New Theatre',
					differentiator: '2'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_1_UUID,
				name: 'New Theatre',
				differentiator: '2',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(2);

		});

		it('updates venue with same name as existing venue but without a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(2);

			const response = await chai.request(app)
				.put(`/venues/${VENUE_2_UUID}`)
				.send({
					name: 'New Theatre'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_2_UUID,
				name: 'New Theatre',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(2);

		});

	});

	describe('Venue sub-venue uniqueness in database', () => {

		const SHEFFIELD_THEATRES_VENUE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedSubVenueStudioTheatre1 = {
			model: 'VENUE',
			name: 'Studio Theatre',
			differentiator: '',
			errors: {}
		};

		const expectedSubVenueStudioTheatre2 = {
			model: 'VENUE',
			name: 'Studio Theatre',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Venue',
				uuid: SHEFFIELD_THEATRES_VENUE_UUID,
				name: 'Sheffield Theatres'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates venue and creates sub-venue that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(1);

			const response = await chai.request(app)
				.put(`/venues/${SHEFFIELD_THEATRES_VENUE_UUID}`)
				.send({
					name: 'Sheffield Theatres',
					subVenues: [
						{
							name: 'Studio Theatre'
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.subVenues[0]).to.deep.equal(expectedSubVenueStudioTheatre1);
			expect(await countNodesWithLabel('Venue')).to.equal(2);

		});

		it('updates venue and creates sub-venue that has same name as existing sub-venue but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(2);

			const response = await chai.request(app)
				.put(`/venues/${SHEFFIELD_THEATRES_VENUE_UUID}`)
				.send({
					name: 'Sheffield Theatres',
					subVenues: [
						{
							name: 'Studio Theatre',
							differentiator: '1'
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.subVenues[0]).to.deep.equal(expectedSubVenueStudioTheatre2);
			expect(await countNodesWithLabel('Venue')).to.equal(3);

		});

		it('updates venue and uses existing sub-venue that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(3);

			const response = await chai.request(app)
				.put(`/venues/${SHEFFIELD_THEATRES_VENUE_UUID}`)
				.send({
					name: 'Sheffield Theatres',
					subVenues: [
						{
							name: 'Studio Theatre'
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.subVenues[0]).to.deep.equal(expectedSubVenueStudioTheatre1);
			expect(await countNodesWithLabel('Venue')).to.equal(3);

		});

		it('updates venue and uses existing sub-venue that has a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(3);

			const response = await chai.request(app)
				.put(`/venues/${SHEFFIELD_THEATRES_VENUE_UUID}`)
				.send({
					name: 'Sheffield Theatres',
					subVenues: [
						{
							name: 'Studio Theatre',
							differentiator: '1'
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.subVenues[0]).to.deep.equal(expectedSubVenueStudioTheatre2);
			expect(await countNodesWithLabel('Venue')).to.equal(3);

		});

	});

});
