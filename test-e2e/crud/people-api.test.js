import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const sandbox = createSandbox();

describe('CRUD (Create, Read, Update, Delete): People API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new person', async () => {

			const response = await chai.request(app)
				.get('/people/new');

			const expectedResponseBody = {
				model: 'PERSON',
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

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').returns(PERSON_UUID);

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
				model: 'PERSON',
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
				model: 'PERSON',
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
				model: 'PERSON',
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
				model: 'PERSON',
				uuid: PERSON_UUID,
				name: 'Patrick Stewart',
				differentiator: null,
				materials: [],
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				rightsGrantorMaterials: [],
				materialProductions: [],
				subsequentVersionMaterialProductions: [],
				sourcingMaterialProductions: [],
				rightsGrantorMaterialProductions: [],
				producerProductions: [],
				castMemberProductions: [],
				creativeProductions: [],
				crewProductions: [],
				reviewCriticProductions: [],
				awards: [],
				subsequentVersionMaterialAwards: [],
				sourcingMaterialAwards: [],
				rightsGrantorMaterialAwards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes person', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/people/${PERSON_UUID}`);

			const expectedResponseBody = {
				model: 'PERSON',
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

		const IAN_MCKELLEN_PERSON_UUID = 'IAN_MCKELLEN_PERSON_UUID';
		const PATRICK_STEWART_PERSON_UUID = 'PATRICK_STEWART_PERSON_UUID';
		const MATTHEW_KELLY_PERSON_UUID = 'MATTHEW_KELLY_PERSON_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

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
					model: 'PERSON',
					uuid: IAN_MCKELLEN_PERSON_UUID,
					name: 'Ian McKellen'
				},
				{
					model: 'PERSON',
					uuid: MATTHEW_KELLY_PERSON_UUID,
					name: 'Matthew Kelly'
				},
				{
					model: 'PERSON',
					uuid: PATRICK_STEWART_PERSON_UUID,
					name: 'Patrick Stewart'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
