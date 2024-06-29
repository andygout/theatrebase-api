import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

chai.use(chaiHttp);

const CHARACTER_1_UUID = '1';
const CHARACTER_2_UUID = '4';

const sandbox = createSandbox();

describe('Uniqueness in database: Characters API', () => {

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('creates character without differentiator', async () => {

		expect(await countNodesWithLabel('Character')).to.equal(0);

		const response = await chai.request(app)
			.post('/characters')
			.send({
				name: 'Demetrius'
			});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_1_UUID,
			name: 'Demetrius',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Character')).to.equal(1);

	});

	it('responds with errors if trying to create existing character that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('Character')).to.equal(1);

		const response = await chai.request(app)
			.post('/characters')
			.send({
				name: 'Demetrius'
			});

		const expectedResponseBody = {
			model: 'CHARACTER',
			name: 'Demetrius',
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
		expect(await countNodesWithLabel('Character')).to.equal(1);

	});

	it('creates character with same name as existing character but uses a differentiator', async () => {

		expect(await countNodesWithLabel('Character')).to.equal(1);

		const response = await chai.request(app)
			.post('/characters')
			.send({
				name: 'Demetrius',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_2_UUID,
			name: 'Demetrius',
			differentiator: '1',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Character')).to.equal(2);

	});

	it('responds with errors if trying to update character to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('Character')).to.equal(2);

		const response = await chai.request(app)
			.put(`/characters/${CHARACTER_1_UUID}`)
			.send({
				name: 'Demetrius',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_1_UUID,
			name: 'Demetrius',
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
		expect(await countNodesWithLabel('Character')).to.equal(2);

	});

	it('updates character with same name as existing character but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('Character')).to.equal(2);

		const response = await chai.request(app)
			.put(`/characters/${CHARACTER_1_UUID}`)
			.send({
				name: 'Demetrius',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_1_UUID,
			name: 'Demetrius',
			differentiator: '2',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Character')).to.equal(2);

	});

	it('updates character with same name as existing character but without a differentiator', async () => {

		expect(await countNodesWithLabel('Character')).to.equal(2);

		const response = await chai.request(app)
			.put(`/characters/${CHARACTER_2_UUID}`)
			.send({
				name: 'Demetrius'
			});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_2_UUID,
			name: 'Demetrius',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Character')).to.equal(2);

	});

});
