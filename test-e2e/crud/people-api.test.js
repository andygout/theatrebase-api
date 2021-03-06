import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): People API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new person', async () => {

			const response = await chai.request(app)
				.get('/people/new');

			const expectedResponseBody = {
				model: 'person',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const PERSON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(PERSON_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates person', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.post('/people')
				.send({
					name: 'Ian McKellen'
				});

			const expectedResponseBody = {
				model: 'person',
				uuid: PERSON_UUID,
				name: 'Ian McKellen',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('gets data required to edit specific person', async () => {

			const response = await chai.request(app)
				.get(`/people/${PERSON_UUID}/edit`);

			const expectedResponseBody = {
				model: 'person',
				uuid: PERSON_UUID,
				name: 'Ian McKellen',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates person', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/people/${PERSON_UUID}`)
				.send({
					name: 'Patrick Stewart'
				});

			const expectedResponseBody = {
				model: 'person',
				uuid: PERSON_UUID,
				name: 'Patrick Stewart',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('shows person', async () => {

			const response = await chai.request(app)
				.get(`/people/${PERSON_UUID}`);

			const expectedResponseBody = {
				model: 'person',
				uuid: PERSON_UUID,
				name: 'Patrick Stewart',
				differentiator: null,
				materials: [],
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				rightsGrantorMaterials: [],
				producerProductions: [],
				castMemberProductions: [],
				creativeProductions: [],
				crewProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes person', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/people/${PERSON_UUID}`);

			const expectedResponseBody = {
				model: 'person',
				name: 'Patrick Stewart',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Person')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const IAN_MCKELLEN_PERSON_UUID = '1';
		const PATRICK_STEWART_PERSON_UUID = '3';
		const MATTHEW_KELLY_PERSON_UUID = '5';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/people')
				.send({
					name: 'Ian McKellen'
				});

			await chai.request(app)
				.post('/people')
				.send({
					name: 'Patrick Stewart'
				});

			await chai.request(app)
				.post('/people')
				.send({
					name: 'Matthew Kelly'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all people ordered by name', async () => {

			const response = await chai.request(app)
				.get('/people');

			const expectedResponseBody = [
				{
					model: 'person',
					uuid: IAN_MCKELLEN_PERSON_UUID,
					name: 'Ian McKellen'
				},
				{
					model: 'person',
					uuid: MATTHEW_KELLY_PERSON_UUID,
					name: 'Matthew Kelly'
				},
				{
					model: 'person',
					uuid: PATRICK_STEWART_PERSON_UUID,
					name: 'Patrick Stewart'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
