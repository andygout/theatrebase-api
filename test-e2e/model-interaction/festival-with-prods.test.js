import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const ROMEO_AND_JULIET_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'ROMEO_AND_JULIET_PRODUCTION_UUID';
const ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID = 'ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID';
const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'THE_COMPLETE_WORKS_FESTIVAL_UUID';
const ANTONY_AND_CLEOPATRA_SWAN_PRODUCTION_UUID = 'ANTONY_AND_CLEOPATRA_PRODUCTION_UUID';
const SWAN_THEATRE_VENUE_UUID = 'SWAN_THEATRE_VENUE_UUID';
const JULIUS_CAESAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'JULIUS_CAESAR_PRODUCTION_UUID';
const EDINBURGH_INTERNATIONAL_FESTIVAL_2006_FESTIVAL_UUID = '2006_FESTIVAL_UUID';
const EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID = 'EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID';
const TROILUS_AND_CRESSIDA_KINGS_PRODUCTION_UUID = 'TROILUS_AND_CRESSIDA_PRODUCTION_UUID';

let theCompleteWorksFestival;
let romeoAndJulietRoyalShakespeareProduction;
let antonyAndCleopatraSwanProduction;
let juliusCaesarRoyalShakespeareProduction;
let troilusAndCressidaKingsProduction;

const sandbox = createSandbox();

describe('Festival with multiple productions', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Antony and Cleopatra',
				startDate: '2006-04-12',
				pressDate: '2006-04-19',
				endDate: '2006-10-14',
				venue: {
					name: 'Swan Theatre'
				},
				festival: {
					name: 'The Complete Works'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Julius Caesar',
				startDate: '2006-05-06',
				pressDate: '2006-05-16',
				endDate: '2006-10-10',
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				festival: {
					name: 'The Complete Works'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Romeo and Juliet',
				startDate: '2006-04-06',
				pressDate: '2006-04-18',
				endDate: '2006-10-14',
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				festival: {
					name: 'The Complete Works'
				}
			});

		await chai.request(app)
			.post('/festivals')
			.send({
				name: '2006',
				festivalSeries: {
					name: 'Edinburgh International Festival'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Troilus and Cressida',
				startDate: '2006-08-14',
				endDate: '2006-08-26',
				venue: {
					name: 'King\'s Theatre'
				},
				festival: {
					name: '2006'
				}
			});

		theCompleteWorksFestival = await chai.request(app)
			.get(`/festivals/${THE_COMPLETE_WORKS_FESTIVAL_UUID}`);

		romeoAndJulietRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${ROMEO_AND_JULIET_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		antonyAndCleopatraSwanProduction = await chai.request(app)
			.get(`/productions/${ANTONY_AND_CLEOPATRA_SWAN_PRODUCTION_UUID}`);

		juliusCaesarRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${JULIUS_CAESAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		troilusAndCressidaKingsProduction = await chai.request(app)
			.get(`/productions/${TROILUS_AND_CRESSIDA_KINGS_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Complete Works (festival)', () => {

		it('includes productions in this festival', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2006-05-06',
					endDate: '2006-10-10',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: ANTONY_AND_CLEOPATRA_SWAN_PRODUCTION_UUID,
					name: 'Antony and Cleopatra',
					startDate: '2006-04-12',
					endDate: '2006-10-14',
					venue: {
						model: 'VENUE',
						uuid: SWAN_THEATRE_VENUE_UUID,
						name: 'Swan Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: ROMEO_AND_JULIET_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Romeo and Juliet',
					startDate: '2006-04-06',
					endDate: '2006-10-14',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: null
				}
			];

			const { productions } = theCompleteWorksFestival.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Romeo and Juliet at Royal Shakespeare Theatre (production)', () => {

		it('attributes festival as The Complete Works', () => {

			const expectedFestival = {
				model: 'FESTIVAL',
				uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
				name: 'The Complete Works',
				festivalSeries: null
			};

			const { festival } = romeoAndJulietRoyalShakespeareProduction.body;

			expect(festival).to.deep.equal(expectedFestival);

		});

	});

	describe('Antony and Cleopatra at Swan Theatre (production)', () => {

		it('attributes festival as The Complete Works', () => {

			const expectedFestival = {
				model: 'FESTIVAL',
				uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
				name: 'The Complete Works',
				festivalSeries: null
			};

			const { festival } = antonyAndCleopatraSwanProduction.body;

			expect(festival).to.deep.equal(expectedFestival);

		});

	});

	describe('Julius Caesar at Royal Shakespeare Theatre (production)', () => {

		it('attributes festival as The Complete Works', () => {

			const expectedFestival = {
				model: 'FESTIVAL',
				uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
				name: 'The Complete Works',
				festivalSeries: null
			};

			const { festival } = juliusCaesarRoyalShakespeareProduction.body;

			expect(festival).to.deep.equal(expectedFestival);

		});

	});

	describe('Troilus and Cressida at King\'s Theatre (production)', () => {

		it('attributes festival as The Complete Works', () => {

			const expectedFestival = {
				model: 'FESTIVAL',
				uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_2006_FESTIVAL_UUID,
				name: '2006',
				festivalSeries: {
					model: 'FESTIVAL_SERIES',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
					name: 'Edinburgh International Festival'
				}
			};

			const { festival } = troilusAndCressidaKingsProduction.body;

			expect(festival).to.deep.equal(expectedFestival);

		});

	});

});
