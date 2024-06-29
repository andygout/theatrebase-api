import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const ROYAL_COURT_THEATRE_VENUE_UUID = 'ROYAL_COURT_THEATRE_VENUE_UUID';
const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = 'JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID';
const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = 'JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID';
const THE_SITE_VENUE_UUID = 'THE_SITE_VENUE_UUID';
const HANGMEN_WYNDHAMS_PRODUCTION_UUID = 'HANGMEN_PRODUCTION_UUID';
const WYNDHAMS_THEATRE_VENUE_UUID = 'WYNDHAMS_THEATRE_VENUE_UUID';
const ROBERT_FOX_PERSON_UUID = 'ROBERT_FOX_PERSON_UUID';
const SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID = 'SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID';
const ROYAL_COURT_THEATRE_COMPANY_UUID = 'ROYAL_COURT_THEATRE_COMPANY_UUID';
const VICKY_FEATHERSTONE_PERSON_UUID = 'VICKY_FEATHERSTONE_PERSON_UUID';
const LUCY_DAVIES_PERSON_UUID = 'LUCY_DAVIES_PERSON_UUID';
const OLA_INCE_PERSON_UUID = 'OLA_INCE_PERSON_UUID';
const PAUL_ELLIOTT_PERSON_UUID = 'PAUL_ELLIOTT_PERSON_UUID';
const OLD_VIC_PRODUCTIONS_COMPANY_UUID = 'OLD_VIC_PRODUCTIONS_COMPANY_UUID';
const PLAYFUL_PRODUCTIONS_COMPANY_UUID = 'PLAYFUL_PRODUCTIONS_COMPANY_UUID';
const MATTHEW_BYAM_SHAW_PERSON_UUID = 'MATTHEW_BYAM_SHAW_PERSON_UUID';
const NIA_JANIS_PERSON_UUID = 'NIA_JANIS_PERSON_UUID';
const NICK_SALMON_PERSON_UUID = 'NICK_SALMON_PERSON_UUID';
const ERIC_ABRAHAM_PERSON_UUID = 'ERIC_ABRAHAM_PERSON_UUID';
const WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = 'WHITE_PEARL_PRODUCTION_UUID';
const HAMISH_PIRIE_PERSON_UUID = 'HAMISH_PIRIE_PERSON_UUID';
const HARRIET_ASTBURY_PERSON_UUID = 'HARRIET_ASTBURY_PERSON_UUID';
const PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = 'PAH_LA_PRODUCTION_UUID';
const SAM_PRITCHARD_PERSON_UUID = 'SAM_PRITCHARD_PERSON_UUID';
const ROGER_CHAPMAN_PERSON_UUID = 'ROGER_CHAPMAN_PERSON_UUID';
const LIGHTS_OUT_THE_SITE_PRODUCTION_UUID = 'LIGHTS_OUT_PRODUCTION_UUID';

let hangmenWyndhamsProduction;
let whitePearlJerwoodTheatreDownstairsProduction;
let pahLaJerwoodTheatreUpstairsProduction;
let lightsOutTheSiteProduction;
let robertFoxPerson;
let ericAbrahamPerson;
let matthewByamShawPerson;
let rogerChapmanPerson;
let soniaFriedmanProductionsCompany;
let royalCourtTheatreCompany;
let playfulProductionsCompany;

const sandbox = createSandbox();

describe('Productions with producers', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'Royal Court Theatre',
				subVenues: [
					{
						name: 'Jerwood Theatre Downstairs'
					},
					{
						name: 'Jerwood Theatre Upstairs'
					},
					{
						name: 'The Site'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hangmen',
				startDate: '2015-12-01',
				pressDate: '2015-12-07',
				endDate: '2016-03-05',
				venue: {
					name: 'Wyndham\'s Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Robert Fox'
							}
						]
					},
					{
						name: 'in association with',
						entities: [
							{
								model: 'COMPANY',
								name: 'Sonia Friedman Productions'
							}
						]
					},
					{
						name: 'in partnership with',
						entities: [
							{
								model: 'COMPANY',
								name: 'Sonia Friedman Productions'
							}
						]
					},
					{
						name: 'in a co-production with',
						entities: [
							{
								model: 'COMPANY',
								name: 'Royal Court Theatre',
								members: [
									{
										name: 'Vicky Featherstone'
									},
									{
										name: 'Lucy Davies'
									},
									{
										name: 'Ola Ince'
									}
								]
							},
							{
								name: 'Paul Elliott'
							},
							{
								model: 'COMPANY',
								name: 'Old Vic Productions'
							},
							{
								model: 'COMPANY',
								name: 'Playful Productions',
								members: [
									{
										name: 'Matthew Byam Shaw'
									},
									{
										name: 'Nia Janis'
									},
									{
										name: 'Nick Salmon'
									}
								]
							},
							{
								name: 'Eric Abraham'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'White Pearl',
				startDate: '2019-05-10',
				pressDate: '2019-05-16',
				endDate: '2019-06-15',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				},
				producerCredits: [
					{
						name: 'producing by',
						entities: [
							{
								name: 'Robert Fox'
							}
						]
					},
					{
						name: 'associate producing by',
						entities: [
							{
								name: 'Eric Abraham'
							}
						]
					},
					{
						name: 'partnership producing by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Sonia Friedman Productions'
							}
						]
					},
					{
						name: 'co-producing by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Old Vic Productions'
							},
							{
								name: 'Paul Elliott'
							},
							{
								model: 'COMPANY',
								name: 'Royal Court Theatre',
								members: [
									{
										name: 'Vicky Featherstone'
									},
									{
										name: 'Hamish Pirie'
									},
									{
										name: 'Lucy Davies'
									}
								]
							},
							{
								name: 'Eric Abraham'
							},
							{
								model: 'COMPANY',
								name: 'Playful Productions',
								members: [
									{
										name: 'Matthew Byam Shaw'
									},
									{
										name: 'Harriet Astbury'
									},
									{
										name: 'Nia Janis'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Pah-La',
				startDate: '2019-04-03',
				pressDate: '2019-04-08',
				endDate: '2019-04-27',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				producerCredits: [
					{
						name: 'producing services by',
						entities: [
							{
								name: 'Robert Fox'
							}
						]
					},
					{
						name: 'associate producing services by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Playful Productions',
								members: [
									{
										name: 'Matthew Byam Shaw'
									}
								]
							}
						]
					},
					{
						name: 'partnership producing services by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Sonia Friedman Productions'
							}
						]
					},
					{
						name: 'co-producing services by',
						entities: [
							{
								name: 'Eric Abraham'
							},
							{
								model: 'COMPANY',
								name: 'Royal Court Theatre',
								members: [
									{
										name: 'Sam Pritchard'
									},
									{
										name: 'Vicky Featherstone'
									},
									{
										name: 'Lucy Davies'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Playful Productions',
								members: [
									{
										name: 'Roger Chapman'
									},
									{
										name: 'Matthew Byam Shaw'
									},
									{
										name: 'Nia Janis'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Old Vic Productions'
							},
							{
								name: 'Paul Elliott'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Lights Out',
				startDate: '2017-05-17',
				endDate: '2017-05-19',
				venue: {
					name: 'The Site'
				},
				producerCredits: [
					{
						name: 'co-producing services by',
						entities: [
							{
								name: 'Eric Abraham'
							},
							{
								model: 'COMPANY',
								name: 'Royal Court Theatre',
								members: [
									{
										name: 'Sam Pritchard'
									},
									{
										name: 'Vicky Featherstone'
									},
									{
										name: 'Lucy Davies'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Playful Productions',
								members: [
									{
										name: 'Nick Salmon'
									},
									{
										name: 'Matthew Byam Shaw'
									},
									{
										name: 'Nia Janis'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Old Vic Productions'
							},
							{
								name: 'Paul Elliott'
							}
						]
					}
				]
			});

		hangmenWyndhamsProduction = await chai.request(app)
			.get(`/productions/${HANGMEN_WYNDHAMS_PRODUCTION_UUID}`);

		whitePearlJerwoodTheatreDownstairsProduction = await chai.request(app)
			.get(`/productions/${WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID}`);

		pahLaJerwoodTheatreUpstairsProduction = await chai.request(app)
			.get(`/productions/${PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID}`);

		lightsOutTheSiteProduction = await chai.request(app)
			.get(`/productions/${LIGHTS_OUT_THE_SITE_PRODUCTION_UUID}`);

		robertFoxPerson = await chai.request(app)
			.get(`/people/${ROBERT_FOX_PERSON_UUID}`);

		ericAbrahamPerson = await chai.request(app)
			.get(`/people/${ERIC_ABRAHAM_PERSON_UUID}`);

		matthewByamShawPerson = await chai.request(app)
			.get(`/people/${MATTHEW_BYAM_SHAW_PERSON_UUID}`);

		rogerChapmanPerson = await chai.request(app)
			.get(`/people/${ROGER_CHAPMAN_PERSON_UUID}`);

		soniaFriedmanProductionsCompany = await chai.request(app)
			.get(`/companies/${SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID}`);

		royalCourtTheatreCompany = await chai.request(app)
			.get(`/companies/${ROYAL_COURT_THEATRE_COMPANY_UUID}`);

		playfulProductionsCompany = await chai.request(app)
			.get(`/companies/${PLAYFUL_PRODUCTIONS_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Hangmen at Wyndham\'s Theatre (production)', () => {

		it('includes producer credits', () => {

			const expectedProducerCredits = [
				{
					model: 'PRODUCER_CREDIT',
					name: 'produced by',
					entities: [
						{
							model: 'PERSON',
							uuid: ROBERT_FOX_PERSON_UUID,
							name: 'Robert Fox'
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'in association with',
					entities: [
						{
							model: 'COMPANY',
							uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
							name: 'Sonia Friedman Productions',
							members: []
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'in partnership with',
					entities: [
						{
							model: 'COMPANY',
							uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
							name: 'Sonia Friedman Productions',
							members: []
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'in a co-production with',
					entities: [
						{
							model: 'COMPANY',
							uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
							name: 'Royal Court Theatre',
							members: [
								{
									model: 'PERSON',
									uuid: VICKY_FEATHERSTONE_PERSON_UUID,
									name: 'Vicky Featherstone'
								},
								{
									model: 'PERSON',
									uuid: LUCY_DAVIES_PERSON_UUID,
									name: 'Lucy Davies'
								},
								{
									model: 'PERSON',
									uuid: OLA_INCE_PERSON_UUID,
									name: 'Ola Ince'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: PAUL_ELLIOTT_PERSON_UUID,
							name: 'Paul Elliott'
						},
						{
							model: 'COMPANY',
							uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
							name: 'Old Vic Productions',
							members: []
						},
						{
							model: 'COMPANY',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							members: [
								{
									model: 'PERSON',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								},
								{
									model: 'PERSON',
									uuid: NIA_JANIS_PERSON_UUID,
									name: 'Nia Janis'
								},
								{
									model: 'PERSON',
									uuid: NICK_SALMON_PERSON_UUID,
									name: 'Nick Salmon'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						}
					]
				}
			];

			const { producerCredits } = hangmenWyndhamsProduction.body;

			expect(producerCredits).to.deep.equal(expectedProducerCredits);

		});

	});

	describe('White Pearl at Jerwood Theatre Downstairs (production)', () => {

		it('includes producer credits', () => {

			const expectedProducerCredits = [
				{
					model: 'PRODUCER_CREDIT',
					name: 'producing by',
					entities: [
						{
							model: 'PERSON',
							uuid: ROBERT_FOX_PERSON_UUID,
							name: 'Robert Fox'
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'associate producing by',
					entities: [
						{
							model: 'PERSON',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'partnership producing by',
					entities: [
						{
							model: 'COMPANY',
							uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
							name: 'Sonia Friedman Productions',
							members: []
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'co-producing by',
					entities: [
						{
							model: 'COMPANY',
							uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
							name: 'Old Vic Productions',
							members: []
						},
						{
							model: 'PERSON',
							uuid: PAUL_ELLIOTT_PERSON_UUID,
							name: 'Paul Elliott'
						},
						{
							model: 'COMPANY',
							uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
							name: 'Royal Court Theatre',
							members: [
								{
									model: 'PERSON',
									uuid: VICKY_FEATHERSTONE_PERSON_UUID,
									name: 'Vicky Featherstone'
								},
								{
									model: 'PERSON',
									uuid: HAMISH_PIRIE_PERSON_UUID,
									name: 'Hamish Pirie'
								},
								{
									model: 'PERSON',
									uuid: LUCY_DAVIES_PERSON_UUID,
									name: 'Lucy Davies'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						},
						{
							model: 'COMPANY',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							members: [
								{
									model: 'PERSON',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								},
								{
									model: 'PERSON',
									uuid: HARRIET_ASTBURY_PERSON_UUID,
									name: 'Harriet Astbury'
								},
								{
									model: 'PERSON',
									uuid: NIA_JANIS_PERSON_UUID,
									name: 'Nia Janis'
								}
							]
						}
					]
				}
			];

			const { producerCredits } = whitePearlJerwoodTheatreDownstairsProduction.body;

			expect(producerCredits).to.deep.equal(expectedProducerCredits);

		});

	});

	describe('Pah-La at Jerwood Theatre Upstairs (production)', () => {

		it('includes producer credits', () => {

			const expectedProducerCredits = [
				{
					model: 'PRODUCER_CREDIT',
					name: 'producing services by',
					entities: [
						{
							model: 'PERSON',
							uuid: ROBERT_FOX_PERSON_UUID,
							name: 'Robert Fox'
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'associate producing services by',
					entities: [
						{
							model: 'COMPANY',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							members: [
								{
									model: 'PERSON',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'partnership producing services by',
					entities: [
						{
							model: 'COMPANY',
							uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
							name: 'Sonia Friedman Productions',
							members: []
						}
					]
				},
				{
					model: 'PRODUCER_CREDIT',
					name: 'co-producing services by',
					entities: [
						{
							model: 'PERSON',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						},
						{
							model: 'COMPANY',
							uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
							name: 'Royal Court Theatre',
							members: [
								{
									model: 'PERSON',
									uuid: SAM_PRITCHARD_PERSON_UUID,
									name: 'Sam Pritchard'
								},
								{
									model: 'PERSON',
									uuid: VICKY_FEATHERSTONE_PERSON_UUID,
									name: 'Vicky Featherstone'
								},
								{
									model: 'PERSON',
									uuid: LUCY_DAVIES_PERSON_UUID,
									name: 'Lucy Davies'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							members: [
								{
									model: 'PERSON',
									uuid: ROGER_CHAPMAN_PERSON_UUID,
									name: 'Roger Chapman'
								},
								{
									model: 'PERSON',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								},
								{
									model: 'PERSON',
									uuid: NIA_JANIS_PERSON_UUID,
									name: 'Nia Janis'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
							name: 'Old Vic Productions',
							members: []
						},
						{
							model: 'PERSON',
							uuid: PAUL_ELLIOTT_PERSON_UUID,
							name: 'Paul Elliott'
						}
					]
				}
			];

			const { producerCredits } = pahLaJerwoodTheatreUpstairsProduction.body;

			expect(producerCredits).to.deep.equal(expectedProducerCredits);

		});

	});

	describe('Lights Out at The Site (production)', () => {

		it('includes producer credits', () => {

			const expectedProducerCredits = [
				{
					model: 'PRODUCER_CREDIT',
					name: 'co-producing services by',
					entities: [
						{
							model: 'PERSON',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						},
						{
							model: 'COMPANY',
							uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
							name: 'Royal Court Theatre',
							members: [
								{
									model: 'PERSON',
									uuid: SAM_PRITCHARD_PERSON_UUID,
									name: 'Sam Pritchard'
								},
								{
									model: 'PERSON',
									uuid: VICKY_FEATHERSTONE_PERSON_UUID,
									name: 'Vicky Featherstone'
								},
								{
									model: 'PERSON',
									uuid: LUCY_DAVIES_PERSON_UUID,
									name: 'Lucy Davies'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							members: [
								{
									model: 'PERSON',
									uuid: NICK_SALMON_PERSON_UUID,
									name: 'Nick Salmon'
								},
								{
									model: 'PERSON',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								},
								{
									model: 'PERSON',
									uuid: NIA_JANIS_PERSON_UUID,
									name: 'Nia Janis'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
							name: 'Old Vic Productions',
							members: []
						},
						{
							model: 'PERSON',
							uuid: PAUL_ELLIOTT_PERSON_UUID,
							name: 'Paul Elliott'
						}
					]
				}
			];

			const { producerCredits } = lightsOutTheSiteProduction.body;

			expect(producerCredits).to.deep.equal(expectedProducerCredits);

		});

	});

	describe('Robert Fox (person)', () => {

		it('includes productions for which they have a producer credit', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in partnership with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in a co-production with',
							entities: [
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'PERSON',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						}
					]
				}
			];

			const { producerProductions } = robertFoxPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Eric Abraham (person)', () => {

		it('includes productions for which they have a producer credit, included co-credited entities', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: LIGHTS_OUT_THE_SITE_PRODUCTION_UUID,
					name: 'Lights Out',
					startDate: '2017-05-17',
					endDate: '2017-05-19',
					venue: {
						model: 'VENUE',
						uuid: THE_SITE_VENUE_UUID,
						name: 'The Site',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in partnership with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in a co-production with',
							entities: [
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'PERSON',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						}
					]
				}
			];

			const { producerProductions } = ericAbrahamPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Matthew Byam Shaw (person)', () => {

		it('includes productions for which they have a producer credit, included co-credited entities', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: LIGHTS_OUT_THE_SITE_PRODUCTION_UUID,
					name: 'Lights Out',
					startDate: '2017-05-17',
					endDate: '2017-05-19',
					venue: {
						model: 'VENUE',
						uuid: THE_SITE_VENUE_UUID,
						name: 'The Site',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in partnership with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in a co-production with',
							entities: [
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'PERSON',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						}
					]
				}
			];

			const { producerProductions } = matthewByamShawPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Roger Chapman (person)', () => {

		it('includes productions for which they have a producer credit, included co-credited entities', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				}
			];

			const { producerProductions } = rogerChapmanPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Sonia Friedman Productions (company)', () => {

		it('includes productions for which they have a producer credit', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in partnership with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in a co-production with',
							entities: [
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'PERSON',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						}
					]
				}
			];

			const { producerProductions } = soniaFriedmanProductionsCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Royal Court Theatre (company)', () => {

		it('includes productions for which they have a producer credit', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: LIGHTS_OUT_THE_SITE_PRODUCTION_UUID,
					name: 'Lights Out',
					startDate: '2017-05-17',
					endDate: '2017-05-19',
					venue: {
						model: 'VENUE',
						uuid: THE_SITE_VENUE_UUID,
						name: 'The Site',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in partnership with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in a co-production with',
							entities: [
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'PERSON',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						}
					]
				}
			];

			const { producerProductions } = royalCourtTheatreCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Playful Productions (company)', () => {

		it('includes productions for which they have a producer credit, included co-credited entities', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing by',
							entities: [
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'associate producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: LIGHTS_OUT_THE_SITE_PRODUCTION_UUID,
					name: 'Lights Out',
					startDate: '2017-05-17',
					endDate: '2017-05-19',
					venue: {
						model: 'VENUE',
						uuid: THE_SITE_VENUE_UUID,
						name: 'The Site',
						surVenue: {
							model: 'VENUE',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'co-producing services by',
							entities: [
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										},
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in partnership with',
							entities: [
								{
									model: 'COMPANY',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									members: []
								}
							]
						},
						{
							model: 'PRODUCER_CREDIT',
							name: 'in a co-production with',
							entities: [
								{
									model: 'COMPANY',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									members: [
										{
											model: 'PERSON',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'PERSON',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'PERSON',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'COMPANY',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									members: []
								},
								{
									model: 'COMPANY',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									members: [
										{
											model: 'PERSON',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'PERSON',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'PERSON',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						}
					]
				}
			];

			const { producerProductions } = playfulProductionsCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

});
