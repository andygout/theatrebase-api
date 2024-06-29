import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

chai.use(chaiHttp);

const AWARD_1_UUID = '1';
const AWARD_2_UUID = '4';

const sandbox = createSandbox();

describe('Uniqueness in database: Awards API', () => {

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('creates award without differentiator', async () => {

		expect(await countNodesWithLabel('Award')).to.equal(0);

		const response = await chai.request(app)
			.post('/awards')
			.send({
				name: 'Critics\' Circle Theatre Awards'
			});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_1_UUID,
			name: 'Critics\' Circle Theatre Awards',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Award')).to.equal(1);

	});

	it('responds with errors if trying to create existing award that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('Award')).to.equal(1);

		const response = await chai.request(app)
			.post('/awards')
			.send({
				name: 'Critics\' Circle Theatre Awards'
			});

		const expectedResponseBody = {
			model: 'AWARD',
			name: 'Critics\' Circle Theatre Awards',
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
		expect(await countNodesWithLabel('Award')).to.equal(1);

	});

	it('creates award with same name as existing award but uses a differentiator', async () => {

		expect(await countNodesWithLabel('Award')).to.equal(1);

		const response = await chai.request(app)
			.post('/awards')
			.send({
				name: 'Critics\' Circle Theatre Awards',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_2_UUID,
			name: 'Critics\' Circle Theatre Awards',
			differentiator: '1',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Award')).to.equal(2);

	});

	it('responds with errors if trying to update award to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('Award')).to.equal(2);

		const response = await chai.request(app)
			.put(`/awards/${AWARD_1_UUID}`)
			.send({
				name: 'Critics\' Circle Theatre Awards',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_1_UUID,
			name: 'Critics\' Circle Theatre Awards',
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
		expect(await countNodesWithLabel('Award')).to.equal(2);

	});

	it('updates award with same name as existing award but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('Award')).to.equal(2);

		const response = await chai.request(app)
			.put(`/awards/${AWARD_1_UUID}`)
			.send({
				name: 'Critics\' Circle Theatre Awards',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_1_UUID,
			name: 'Critics\' Circle Theatre Awards',
			differentiator: '2',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Award')).to.equal(2);

	});

	it('updates award with same name as existing award but without a differentiator', async () => {

		expect(await countNodesWithLabel('Award')).to.equal(2);

		const response = await chai.request(app)
			.put(`/awards/${AWARD_2_UUID}`)
			.send({
				name: 'Critics\' Circle Theatre Awards'
			});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_2_UUID,
			name: 'Critics\' Circle Theatre Awards',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Award')).to.equal(2);

	});

});
