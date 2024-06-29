import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

chai.use(chaiHttp);

const FESTIVAL_SERIES_1_UUID = '1';
const FESTIVAL_SERIES_2_UUID = '4';

const sandbox = createSandbox();

describe('Uniqueness in database: Festival Serieses API', () => {

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('creates festival series without differentiator', async () => {

		expect(await countNodesWithLabel('FestivalSeries')).to.equal(0);

		const response = await chai.request(app)
			.post('/festival-serieses')
			.send({
				name: 'Connections'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_1_UUID,
			name: 'Connections',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

	});

	it('responds with errors if trying to create existing festival series that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

		const response = await chai.request(app)
			.post('/festival-serieses')
			.send({
				name: 'Connections'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			name: 'Connections',
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
		expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

	});

	it('creates festival series with same name as existing festival series but uses a differentiator', async () => {

		expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

		const response = await chai.request(app)
			.post('/festival-serieses')
			.send({
				name: 'Connections',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_2_UUID,
			name: 'Connections',
			differentiator: '1',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

	});

	it('responds with errors if trying to update festival series to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

		const response = await chai.request(app)
			.put(`/festival-serieses/${FESTIVAL_SERIES_1_UUID}`)
			.send({
				name: 'Connections',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_1_UUID,
			name: 'Connections',
			differentiator: '1',
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
		expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

	});

	it('updates festival series with same name as existing festival series but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

		const response = await chai.request(app)
			.put(`/festival-serieses/${FESTIVAL_SERIES_1_UUID}`)
			.send({
				name: 'Connections',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_1_UUID,
			name: 'Connections',
			differentiator: '2',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

	});

	it('updates festival series with same name as existing festival series but without a differentiator', async () => {

		expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

		const response = await chai.request(app)
			.put(`/festival-serieses/${FESTIVAL_SERIES_2_UUID}`)
			.send({
				name: 'Connections'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_2_UUID,
			name: 'Connections',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('FestivalSeries')).to.equal(2);

	});

});
