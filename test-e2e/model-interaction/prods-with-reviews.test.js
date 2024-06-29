import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';
const OLIVIER_THEATRE_VENUE_UUID = 'OLIVIER_THEATRE_VENUE_UUID';
const LONG_DAYS_JOURNEY_INTO_NIGHT_WYNDHAMS_PRODUCTION_UUID = 'LONG_DAYS_JOURNEY_INTO_NIGHT_PRODUCTION_UUID';
const WYNDHAMS_THEATRE_VENUE_UUID = 'WYNDHAMS_THEATRE_VENUE_UUID';
const FINANCIAL_TIMES_COMPANY_UUID = 'FINANCIAL_TIMES_COMPANY_UUID';
const SARAH_HEMMING_PERSON_UUID = 'SARAH_HEMMING_PERSON_UUID';
const THE_GUARDIAN_COMPANY_UUID = 'THE_GUARDIAN_COMPANY_UUID';
const ARIFA_AKBAR_PERSON_UUID = 'ARIFA_AKBAR_PERSON_UUID';
const THE_TELEGRAPH_COMPANY_UUID = 'THE_TELEGRAPH_COMPANY_UUID';
const DOMINIC_CAVENDISH_PERSON_UUID = 'DOMINIC_CAVENDISH_PERSON_UUID';
const NYE_OLIVIER_PRODUCTION_UUID = 'NYE_PRODUCTION_UUID';
const HARRY_CLARKE_AMBASSADORS_PRODUCTION_UUID = 'HARRY_CLARKE_PRODUCTION_UUID';
const AMBASSADORS_THEATRE_VENUE_UUID = 'AMBASSADORS_THEATRE_VENUE_UUID';

let aLongDaysJourneyIntoNightWyndhamsProduction;
let financialTimesCompany;
let sarahHemmingPerson;

const sandbox = createSandbox();

describe('Productions with reviews', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'National Theatre',
				subVenues: [
					{
						name: 'Olivier Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Long Day\'s Journey Into Night',
				startDate: '2024-03-19',
				pressDate: '2024-04-02',
				endDate: '2024-06-08',
				venue: {
					name: 'Wyndham\'s Theatre'
				},
				reviews: [
					{
						url: 'https://www.ft.com/content/bcf4484a-5200-4961-ac12-1e0138518f89',
						date: '2024-04-04',
						publication: {
							name: 'Financial Times'
						},
						critic: {
							name: 'Sarah Hemming'
						}
					},
					{
						url: 'https://www.theguardian.com/stage/2024/apr/03/long-days-journey-into-night-review-brian-cox-patricia-clarkson-eugene-oneill-wyndham-london',
						date: '2024-04-05',
						publication: {
							name: 'The Guardian'
						},
						critic: {
							name: 'Arifa Akbar'
						}
					},
					{
						url: 'https://www.telegraph.co.uk/theatre/what-to-see/long-days-journey-into-night-wyndhams-theatre-review',
						date: '2024-04-03',
						publication: {
							name: 'The Telegraph'
						},
						critic: {
							name: 'Dominic Cavendish'
						}
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Nye',
				startDate: '2024-02-24',
				pressDate: '2024-03-06',
				endDate: '2024-05-11',
				venue: {
					name: 'Olivier Theatre'
				},
				reviews: [
					{
						url: 'https://www.ft.com/content/e1119366-74a5-41ac-ae55-202749143f6d',
						date: '2024-03-08',
						publication: {
							name: 'Financial Times'
						},
						critic: {
							name: 'Sarah Hemming'
						}
					},
					{
						url: 'https://www.theguardian.com/stage/2024/mar/07/nye-review-michael-sheen-olivier-theatre',
						date: '2024-03-09',
						publication: {
							name: 'The Guardian'
						},
						critic: {
							name: 'Arifa Akbar'
						}
					},
					{
						url: 'https://www.telegraph.co.uk/theatre/what-to-see/nye-nationals-olivier-theatre-review-a-valiant-and-valuable',
						date: '2024-03-07',
						publication: {
							name: 'The Telegraph'
						},
						critic: {
							name: 'Dominic Cavendish'
						}
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Harry Clarke',
				startDate: '2024-03-09',
				pressDate: '2024-03-12',
				endDate: '2024-05-11',
				venue: {
					name: 'Ambassadors Theatre'
				},
				reviews: [
					{
						url: 'https://www.ft.com/content/5f5d4d51-28c6-4672-a963-6a7d8e0ad517',
						date: '2024-03-14',
						publication: {
							name: 'Financial Times'
						},
						critic: {
							name: 'Sarah Hemming'
						}
					},
					{
						url: 'https://www.theguardian.com/stage/2024/mar/13/harry-clarke-review-billy-crudup-ambassadors-theatre-london',
						date: '2024-03-15',
						publication: {
							name: 'The Guardian'
						},
						critic: {
							name: 'Arifa Akbar'
						}
					},
					{
						url: 'https://www.telegraph.co.uk/theatre/what-to-see/harry-clarke-ambassadors-theatre-review',
						date: '2024-03-13',
						publication: {
							name: 'The Telegraph'
						},
						critic: {
							name: 'Dominic Cavendish'
						}
					}
				]
			});

		aLongDaysJourneyIntoNightWyndhamsProduction = await chai.request(app)
			.get(`/productions/${LONG_DAYS_JOURNEY_INTO_NIGHT_WYNDHAMS_PRODUCTION_UUID}`);

		financialTimesCompany = await chai.request(app)
			.get(`/companies/${FINANCIAL_TIMES_COMPANY_UUID}`);

		sarahHemmingPerson = await chai.request(app)
			.get(`/people/${SARAH_HEMMING_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Long Day\'s Journey Into Night at Wyndham\'s Theatre (production)', () => {

		it('includes reviews', () => {

			const expectedReviews = [
				{
					model: 'REVIEW',
					url: 'https://www.telegraph.co.uk/theatre/what-to-see/long-days-journey-into-night-wyndhams-theatre-review',
					date: '2024-04-03',
					publication: {
						model: 'COMPANY',
						uuid: THE_TELEGRAPH_COMPANY_UUID,
						name: 'The Telegraph'
					},
					critic: {
						model: 'PERSON',
						uuid: DOMINIC_CAVENDISH_PERSON_UUID,
						name: 'Dominic Cavendish'
					}
				},
				{
					model: 'REVIEW',
					url: 'https://www.ft.com/content/bcf4484a-5200-4961-ac12-1e0138518f89',
					date: '2024-04-04',
					publication: {
						model: 'COMPANY',
						uuid: FINANCIAL_TIMES_COMPANY_UUID,
						name: 'Financial Times'
					},
					critic: {
						model: 'PERSON',
						uuid: SARAH_HEMMING_PERSON_UUID,
						name: 'Sarah Hemming'
					}
				},
				{
					model: 'REVIEW',
					url: 'https://www.theguardian.com/stage/2024/apr/03/long-days-journey-into-night-review-brian-cox-patricia-clarkson-eugene-oneill-wyndham-london',
					date: '2024-04-05',
					publication: {
						model: 'COMPANY',
						uuid: THE_GUARDIAN_COMPANY_UUID,
						name: 'The Guardian'
					},
					critic: {
						model: 'PERSON',
						uuid: ARIFA_AKBAR_PERSON_UUID,
						name: 'Arifa Akbar'
					}
				}
			];

			const { reviews } = aLongDaysJourneyIntoNightWyndhamsProduction.body;

			expect(reviews).to.deep.equal(expectedReviews);

		});

	});

	describe('Financial Times (company)', () => {

		it('includes productions they have reviewed as a publication', () => {

			const expectedReviewPublicationProductions = [
				{
					model: 'PRODUCTION',
					uuid: LONG_DAYS_JOURNEY_INTO_NIGHT_WYNDHAMS_PRODUCTION_UUID,
					name: 'Long Day\'s Journey Into Night',
					startDate: '2024-03-19',
					endDate: '2024-06-08',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					review: {
						model: 'REVIEW',
						url: 'https://www.ft.com/content/bcf4484a-5200-4961-ac12-1e0138518f89',
						date: '2024-04-04',
						critic: {
							model: 'PERSON',
							uuid: SARAH_HEMMING_PERSON_UUID,
							name: 'Sarah Hemming'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: HARRY_CLARKE_AMBASSADORS_PRODUCTION_UUID,
					name: 'Harry Clarke',
					startDate: '2024-03-09',
					endDate: '2024-05-11',
					venue: {
						model: 'VENUE',
						uuid: AMBASSADORS_THEATRE_VENUE_UUID,
						name: 'Ambassadors Theatre',
						surVenue: null
					},
					surProduction: null,
					review: {
						model: 'REVIEW',
						url: 'https://www.ft.com/content/5f5d4d51-28c6-4672-a963-6a7d8e0ad517',
						date: '2024-03-14',
						critic: {
							model: 'PERSON',
							uuid: SARAH_HEMMING_PERSON_UUID,
							name: 'Sarah Hemming'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: NYE_OLIVIER_PRODUCTION_UUID,
					name: 'Nye',
					startDate: '2024-02-24',
					endDate: '2024-05-11',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					review: {
						model: 'REVIEW',
						url: 'https://www.ft.com/content/e1119366-74a5-41ac-ae55-202749143f6d',
						date: '2024-03-08',
						critic: {
							model: 'PERSON',
							uuid: SARAH_HEMMING_PERSON_UUID,
							name: 'Sarah Hemming'
						}
					}
				}
			];

			const { reviewPublicationProductions } = financialTimesCompany.body;

			expect(reviewPublicationProductions).to.deep.equal(expectedReviewPublicationProductions);

		});

	});

	describe('Sarah Hemming (person)', () => {

		it('includes productions they have reviewed as a critic', () => {

			const expectedReviewPublicationProductions = [
				{
					model: 'PRODUCTION',
					uuid: LONG_DAYS_JOURNEY_INTO_NIGHT_WYNDHAMS_PRODUCTION_UUID,
					name: 'Long Day\'s Journey Into Night',
					startDate: '2024-03-19',
					endDate: '2024-06-08',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					review: {
						model: 'REVIEW',
						url: 'https://www.ft.com/content/bcf4484a-5200-4961-ac12-1e0138518f89',
						date: '2024-04-04',
						publication: {
							model: 'COMPANY',
							uuid: FINANCIAL_TIMES_COMPANY_UUID,
							name: 'Financial Times'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: HARRY_CLARKE_AMBASSADORS_PRODUCTION_UUID,
					name: 'Harry Clarke',
					startDate: '2024-03-09',
					endDate: '2024-05-11',
					venue: {
						model: 'VENUE',
						uuid: AMBASSADORS_THEATRE_VENUE_UUID,
						name: 'Ambassadors Theatre',
						surVenue: null
					},
					surProduction: null,
					review: {
						model: 'REVIEW',
						url: 'https://www.ft.com/content/5f5d4d51-28c6-4672-a963-6a7d8e0ad517',
						date: '2024-03-14',
						publication: {
							model: 'COMPANY',
							uuid: FINANCIAL_TIMES_COMPANY_UUID,
							name: 'Financial Times'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: NYE_OLIVIER_PRODUCTION_UUID,
					name: 'Nye',
					startDate: '2024-02-24',
					endDate: '2024-05-11',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					review: {
						model: 'REVIEW',
						url: 'https://www.ft.com/content/e1119366-74a5-41ac-ae55-202749143f6d',
						date: '2024-03-08',
						publication: {
							model: 'COMPANY',
							uuid: FINANCIAL_TIMES_COMPANY_UUID,
							name: 'Financial Times'
						}
					}
				}
			];

			const { reviewCriticProductions } = sarahHemmingPerson.body;

			expect(reviewCriticProductions).to.deep.equal(expectedReviewPublicationProductions);

		});

	});

});
