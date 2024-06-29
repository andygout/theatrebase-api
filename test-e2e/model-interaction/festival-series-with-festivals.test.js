import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const EDINBURGH_INTERNATIONAL_FESTIVAL_2008_FESTIVAL_UUID = '2008_EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_UUID';
const EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID = 'EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID';
const EDINBURGH_INTERNATIONAL_FESTIVAL_2009_FESTIVAL_UUID = '2009_EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_UUID';
const EDINBURGH_INTERNATIONAL_FESTIVAL_2010_FESTIVAL_UUID = '2010_EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_UUID';
const HIGHTIDE_FESTIVAL_2008_FESTIVAL_UUID = '2008_HIGHTIDE_FESTIVAL_FESTIVAL_UUID';
const HIGHTIDE_FESTIVAL_FESTIVAL_SERIES_UUID = 'HIGHTIDE_FESTIVAL_FESTIVAL_SERIES_UUID';
const HIGHTIDE_FESTIVAL_2009_FESTIVAL_UUID = '2009_HIGHTIDE_FESTIVAL_FESTIVAL_UUID';
const HIGHTIDE_FESTIVAL_2010_FESTIVAL_UUID = '2010_HIGHTIDE_FESTIVAL_FESTIVAL_UUID';
const CONNECTIONS_2008_FESTIVAL_UUID = '2008_CONNECTIONS_FESTIVAL_UUID';
const CONNECTIONS_FESTIVAL_SERIES_UUID = 'CONNECTIONS_FESTIVAL_SERIES_UUID';
const CONNECTIONS_2009_FESTIVAL_UUID = '2009_CONNECTIONS_FESTIVAL_UUID';
const CONNECTIONS_2010_FESTIVAL_UUID = '2010_CONNECTIONS_FESTIVAL_UUID';
const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'THE_COMPLETE_WORKS_FESTIVAL_UUID';
const GLOBE_TO_GLOBE_FESTIVAL_UUID = 'GLOBE_TO_GLOBE_FESTIVAL_UUID';

let edinburghInternationalFestivalFestivalSeries;

const sandbox = createSandbox();

describe('Festival series with festivals', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2008',
				differentiator: 'Edinburgh International Festival',
				festivalSeries: {
					name: 'Edinburgh International Festival'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2009',
				differentiator: 'Edinburgh International Festival',
				festivalSeries: {
					name: 'Edinburgh International Festival'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2010',
				differentiator: 'Edinburgh International Festival',
				festivalSeries: {
					name: 'Edinburgh International Festival'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2008',
				differentiator: 'HighTide Festival',
				festivalSeries: {
					name: 'HighTide Festival'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2009',
				differentiator: 'HighTide Festival',
				festivalSeries: {
					name: 'HighTide Festival'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2010',
				differentiator: 'HighTide Festival',
				festivalSeries: {
					name: 'HighTide Festival'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2008',
				differentiator: 'Connections',
				festivalSeries: {
					name: 'Connections'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2009',
				differentiator: 'Connections',
				festivalSeries: {
					name: 'Connections'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2010',
				differentiator: 'Connections',
				festivalSeries: {
					name: 'Connections'
				}
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

		edinburghInternationalFestivalFestivalSeries = await chai.request(app)
			.get(`/festival-serieses/${EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Edinburgh International Festival (festival series)', () => {

		it('includes its festivals', () => {

			const expectedFestivals = [
				{
					model: 'FESTIVAL',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_2010_FESTIVAL_UUID,
					name: '2010'
				},
				{
					model: 'FESTIVAL',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_2009_FESTIVAL_UUID,
					name: '2009'
				},
				{
					model: 'FESTIVAL',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_2008_FESTIVAL_UUID,
					name: '2008'
				}
			];

			const { festivals } = edinburghInternationalFestivalFestivalSeries.body;

			expect(festivals).to.deep.equal(expectedFestivals);

		});

	});

	describe('festival serieses list', () => {

		it('includes festival series', async () => {

			const response = await chai.request(app)
				.get('/festival-serieses');

			const expectedResponseBody = [
				{
					model: 'FESTIVAL_SERIES',
					uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
					name: 'Connections'
				},
				{
					model: 'FESTIVAL_SERIES',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
					name: 'Edinburgh International Festival'
				},
				{
					model: 'FESTIVAL_SERIES',
					uuid: HIGHTIDE_FESTIVAL_FESTIVAL_SERIES_UUID,
					name: 'HighTide Festival'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('festivals list', () => {

		it('includes festivals and (if applicable) corresponding festival series', async () => {

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
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: 'Globe to Globe',
					festivalSeries: null
				},
				{
					model: 'FESTIVAL',
					uuid: CONNECTIONS_2010_FESTIVAL_UUID,
					name: '2010',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
						name: 'Connections'
					}
				},
				{
					model: 'FESTIVAL',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_2010_FESTIVAL_UUID,
					name: '2010',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
						name: 'Edinburgh International Festival'
					}
				},
				{
					model: 'FESTIVAL',
					uuid: HIGHTIDE_FESTIVAL_2010_FESTIVAL_UUID,
					name: '2010',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: HIGHTIDE_FESTIVAL_FESTIVAL_SERIES_UUID,
						name: 'HighTide Festival'
					}
				},
				{
					model: 'FESTIVAL',
					uuid: CONNECTIONS_2009_FESTIVAL_UUID,
					name: '2009',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
						name: 'Connections'
					}
				},
				{
					model: 'FESTIVAL',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_2009_FESTIVAL_UUID,
					name: '2009',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
						name: 'Edinburgh International Festival'
					}
				},
				{
					model: 'FESTIVAL',
					uuid: HIGHTIDE_FESTIVAL_2009_FESTIVAL_UUID,
					name: '2009',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: HIGHTIDE_FESTIVAL_FESTIVAL_SERIES_UUID,
						name: 'HighTide Festival'
					}
				},
				{
					model: 'FESTIVAL',
					uuid: CONNECTIONS_2008_FESTIVAL_UUID,
					name: '2008',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
						name: 'Connections'
					}
				},
				{
					model: 'FESTIVAL',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_2008_FESTIVAL_UUID,
					name: '2008',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
						name: 'Edinburgh International Festival'
					}
				},
				{
					model: 'FESTIVAL',
					uuid: HIGHTIDE_FESTIVAL_2008_FESTIVAL_UUID,
					name: '2008',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: HIGHTIDE_FESTIVAL_FESTIVAL_SERIES_UUID,
						name: 'HighTide Festival'
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
