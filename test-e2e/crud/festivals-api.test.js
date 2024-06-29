import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const sandbox = createSandbox();

describe('CRUD (Create, Read, Update, Delete): Festivals API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new festival', async () => {

			const response = await chai.request(app)
				.get('/festivals/new');

			const expectedResponseBody = {
				model: 'FESTIVAL',
				name: '',
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

		});

	});

	describe('CRUD', () => {

		const FESTIVAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').returns(FESTIVAL_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates festival', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(0);

			const response = await chai.request(app)
				.post('/festivals')
				.send({
					name: 'The Complete Works'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: 'The Complete Works',
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

		it('gets data required to edit specific festival', async () => {

			const response = await chai.request(app)
				.get(`/festivals/${FESTIVAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: 'The Complete Works',
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

		});

		it('updates festival', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.put(`/festivals/${FESTIVAL_UUID}`)
				.send({
					name: 'Globe to Globe'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
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

		it('shows festival', async () => {

			const response = await chai.request(app)
				.get(`/festivals/${FESTIVAL_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: 'Globe to Globe',
				differentiator: null,
				festivalSeries: null,
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes festival', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/festivals/${FESTIVAL_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
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
			expect(await countNodesWithLabel('Festival')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const FESTIVAL_UUID = '2008_1_FESTIVAL_UUID';
		const EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID = 'EDINBURGH_INTERNATIONAL_FESTIVAL_1_FESTIVAL_SERIES_UUID';
		const CONNECTIONS_FESTIVAL_SERIES_UUID = 'CONNECTIONS_1_FESTIVAL_SERIES_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates festival', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(0);

			const response = await chai.request(app)
				.post('/festivals')
				.send({
					name: '2008',
					differentiator: '1',
					festivalSeries: {
						name: 'Edinburgh International Festival',
						differentiator: '1'
					}
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: '2008',
				differentiator: '1',
				errors: {},
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: 'Edinburgh International Festival',
					differentiator: '1',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(1);

		});

		it('shows festival (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/festivals/${FESTIVAL_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: '2008',
				differentiator: '1',
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
					name: 'Edinburgh International Festival'
				},
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific festival', async () => {

			const response = await chai.request(app)
				.get(`/festivals/${FESTIVAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: '2008',
				differentiator: '1',
				errors: {},
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: 'Edinburgh International Festival',
					differentiator: '1',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates festival (with existing data)', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.put(`/festivals/${FESTIVAL_UUID}`)
				.send({
					name: '2008',
					differentiator: '1',
					festivalSeries: {
						name: 'Edinburgh International Festival',
						differentiator: '1'
					}
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: '2008',
				differentiator: '1',
				errors: {},
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: 'Edinburgh International Festival',
					differentiator: '1',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(1);

		});

		it('updates festival (with new data)', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.put(`/festivals/${FESTIVAL_UUID}`)
				.send({
					name: '2009',
					differentiator: '1',
					festivalSeries: {
						name: 'Connections',
						differentiator: '1'
					}
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: '2009',
				differentiator: '1',
				errors: {},
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					name: 'Connections',
					differentiator: '1',
					errors: {}
				}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(1);

		});

		it('shows festival (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/festivals/${FESTIVAL_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: '2009',
				differentiator: '1',
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
					name: 'Connections'
				},
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates festival to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.put(`/festivals/${FESTIVAL_UUID}`)
				.send({
					name: '2009',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: '2009',
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
			expect(await countNodesWithLabel('Festival')).to.equal(1);

		});

		it('deletes festival', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/festivals/${FESTIVAL_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				name: '2009',
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
			expect(await countNodesWithLabel('Festival')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const SHAKESPEARE_400_ARTS_FESTIVAL_UUID = 'SHAKESPEARE_400_ARTS_FESTIVAL_FESTIVAL_UUID';
		const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'THE_COMPLETE_WORKS_FESTIVAL_UUID';
		const GLOBE_TO_GLOBE_FESTIVAL_UUID = 'GLOBE_TO_GLOBE_FESTIVAL_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

			await purgeDatabase();

			await chai.request(app)
				.post('/festivals')
				.send({
					name: 'Shakespeare 400 Arts Festival'
				});

			await chai.request(app)
				.post('/festivals')
				.send({
					name: 'The Complete Works'
				});

			await chai.request(app)
				.post('/festivals')
				.send({
					name: 'Globe to Globe'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all festivals ordered by name in descending order (and then by festival series name)', async () => {

			const response = await chai.request(app)
				.get('/festivals');

			const expectedResponseBody = [
				{
					model: 'FESTIVAL',
					uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
					name: 'The Complete Works',
					festivalSeries: null
				},
				{
					model: 'FESTIVAL',
					uuid: SHAKESPEARE_400_ARTS_FESTIVAL_UUID,
					name: 'Shakespeare 400 Arts Festival',
					festivalSeries: null
				},
				{
					model: 'FESTIVAL',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: 'Globe to Globe',
					festivalSeries: null
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
