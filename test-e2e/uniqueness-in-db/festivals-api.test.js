import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, createNode, purgeDatabase } from '../test-helpers/neo4j/index.js';

chai.use(chaiHttp);

const sandbox = createSandbox();

describe('Uniqueness in database: Festivals API', () => {

	describe('Festival uniqueness in database', () => {

		const FESTIVAL_1_UUID = '1';
		const FESTIVAL_2_UUID = '4';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates festival without differentiator', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(0);

			const response = await chai.request(app)
				.post('/festivals')
				.send({
					name: 'Globe to Globe'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_1_UUID,
				name: 'Globe to Globe',
				differentiator: '',
				errors: {},
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(1);

		});

		it('responds with errors if trying to create existing festival that does also not have differentiator', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.post('/festivals')
				.send({
					name: 'Globe to Globe'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				name: 'Globe to Globe',
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
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(1);

		});

		it('creates festival with same name as existing festival but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.post('/festivals')
				.send({
					name: 'Globe to Globe',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_2_UUID,
				name: 'Globe to Globe',
				differentiator: '1',
				errors: {},
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(2);

		});

		it('responds with errors if trying to update festival to one with same name and differentiator combination', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(2);

			const response = await chai.request(app)
				.put(`/festivals/${FESTIVAL_1_UUID}`)
				.send({
					name: 'Globe to Globe',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_1_UUID,
				name: 'Globe to Globe',
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
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(2);

		});

		it('updates festival with same name as existing festival but uses a different differentiator', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(2);

			const response = await chai.request(app)
				.put(`/festivals/${FESTIVAL_1_UUID}`)
				.send({
					name: 'Globe to Globe',
					differentiator: '2'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_1_UUID,
				name: 'Globe to Globe',
				differentiator: '2',
				errors: {},
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(2);

		});

		it('updates festival with same name as existing festival but without a differentiator', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(2);

			const response = await chai.request(app)
				.put(`/festivals/${FESTIVAL_2_UUID}`)
				.send({
					name: 'Globe to Globe'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_2_UUID,
				name: 'Globe to Globe',
				differentiator: '',
				errors: {},
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(2);

		});

	});

	describe('Festival festival series uniqueness in database', () => {

		const TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedFestivalSeriesPerthArtsFestival1 = {
			model: 'FESTIVAL_SERIES',
			name: 'Perth Arts Festival',
			differentiator: '',
			errors: {}
		};

		const expectedFestivalSeriesPerthArtsFestival2 = {
			model: 'FESTIVAL_SERIES',
			name: 'Perth Arts Festival',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Festival',
				uuid: TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID,
				name: '2008'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates festival and creates festival series that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('FestivalSeries')).to.equal(0);

			const response = await chai.request(app)
				.put(`/festivals/${TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID}`)
				.send({
					name: '2008',
					festivalSeries: {
						name: 'Perth Arts Festival'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.festivalSeries).to.deep.equal(expectedFestivalSeriesPerthArtsFestival1);
			expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

		});

		it('updates festival and creates festival series that has same name as existing festival series but uses a differentiator', async () => {

			expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

			const response = await chai.request(app)
				.put(`/festivals/${TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID}`)
				.send({
					name: '2008',
					festivalSeries: {
						name: 'Perth Arts Festival',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.festivalSeries).to.deep.equal(expectedFestivalSeriesPerthArtsFestival2);
			expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

		});

		it('updates festival and uses existing festival series that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

			const response = await chai.request(app)
				.put(`/festivals/${TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID}`)
				.send({
					name: '2008',
					festivalSeries: {
						name: 'Perth Arts Festival'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.festivalSeries).to.deep.equal(expectedFestivalSeriesPerthArtsFestival1);
			expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

		});

		it('updates festival and uses existing festival series that has a differentiator', async () => {

			expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

			const response = await chai.request(app)
				.put(`/festivals/${TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID}`)
				.send({
					name: '2008',
					festivalSeries: {
						name: 'Perth Arts Festival',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.festivalSeries).to.deep.equal(expectedFestivalSeriesPerthArtsFestival2);
			expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

		});

	});

});
