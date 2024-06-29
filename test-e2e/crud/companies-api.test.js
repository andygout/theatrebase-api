import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const sandbox = createSandbox();

describe('CRUD (Create, Read, Update, Delete): Companies API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new company', async () => {

			const response = await chai.request(app)
				.get('/companies/new');

			const expectedResponseBody = {
				model: 'COMPANY',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const COMPANY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').returns(COMPANY_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates company', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(0);

			const response = await chai.request(app)
				.post('/companies')
				.send({
					name: 'National Theatre Company'
				});

			const expectedResponseBody = {
				model: 'COMPANY',
				uuid: COMPANY_UUID,
				name: 'National Theatre Company',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('gets data required to edit specific company', async () => {

			const response = await chai.request(app)
				.get(`/companies/${COMPANY_UUID}/edit`);

			const expectedResponseBody = {
				model: 'COMPANY',
				uuid: COMPANY_UUID,
				name: 'National Theatre Company',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates company', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.put(`/companies/${COMPANY_UUID}`)
				.send({
					name: 'Royal Shakespeare Company'
				});

			const expectedResponseBody = {
				model: 'COMPANY',
				uuid: COMPANY_UUID,
				name: 'Royal Shakespeare Company',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('shows company', async () => {

			const response = await chai.request(app)
				.get(`/companies/${COMPANY_UUID}`);

			const expectedResponseBody = {
				model: 'COMPANY',
				uuid: COMPANY_UUID,
				name: 'Royal Shakespeare Company',
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
				creativeProductions: [],
				crewProductions: [],
				reviewPublicationProductions: [],
				awards: [],
				subsequentVersionMaterialAwards: [],
				sourcingMaterialAwards: [],
				rightsGrantorMaterialAwards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes company', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/companies/${COMPANY_UUID}`);

			const expectedResponseBody = {
				model: 'COMPANY',
				name: 'Royal Shakespeare Company',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Company')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const NATIONAL_THEATRE_COMPANY_UUID = 'NATIONAL_THEATRE_COMPANY_COMPANY_UUID';
		const ROYAL_SHAKESPEARE_COMPANY_UUID = 'ROYAL_SHAKESPEARE_COMPANY_COMPANY_UUID';
		const ALMEIDA_THEATRE_COMPANY_UUID = 'ALMEIDA_THEATRE_COMPANY_COMPANY_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

			await purgeDatabase();

			await chai.request(app)
				.post('/companies')
				.send({
					name: 'National Theatre Company'
				});

			await chai.request(app)
				.post('/companies')
				.send({
					name: 'Royal Shakespeare Company'
				});

			await chai.request(app)
				.post('/companies')
				.send({
					name: 'Almeida Theatre Company'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all companies ordered by name', async () => {

			const response = await chai.request(app)
				.get('/companies');

			const expectedResponseBody = [
				{
					model: 'COMPANY',
					uuid: ALMEIDA_THEATRE_COMPANY_UUID,
					name: 'Almeida Theatre Company'
				},
				{
					model: 'COMPANY',
					uuid: NATIONAL_THEATRE_COMPANY_UUID,
					name: 'National Theatre Company'
				},
				{
					model: 'COMPANY',
					uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
					name: 'Royal Shakespeare Company'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
