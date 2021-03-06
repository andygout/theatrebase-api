import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Productions with producer', () => {

	chai.use(chaiHttp);

	const ROYAL_COURT_THEATRE_VENUE_UUID = '4';
	const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = '5';
	const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '6';
	const THE_SITE_VENUE_UUID = '7';
	const HANGMEN_WYNDHAMS_PRODUCTION_UUID = '8';
	const WYNDHAMS_THEATRE_VENUE_UUID = '10';
	const ROBERT_FOX_PERSON_UUID = '11';
	const SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID = '12';
	const ROYAL_COURT_THEATRE_COMPANY_UUID = '13';
	const VICKY_FEATHERSTONE_PERSON_UUID = '14';
	const LUCY_DAVIES_PERSON_UUID = '15';
	const OLA_INCE_PERSON_UUID = '16';
	const PAUL_ELLIOTT_PERSON_UUID = '17';
	const OLD_VIC_PRODUCTIONS_COMPANY_UUID = '18';
	const PLAYFUL_PRODUCTIONS_COMPANY_UUID = '19';
	const MATTHEW_BYAM_SHAW_PERSON_UUID = '20';
	const NIA_JANIS_PERSON_UUID = '21';
	const NICK_SALMON_PERSON_UUID = '22';
	const ERIC_ABRAHAM_PERSON_UUID = '23';
	const WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '24';
	const HAMISH_PIRIE_PERSON_UUID = '34';
	const HARRIET_ASTBURY_PERSON_UUID = '38';
	const PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '40';
	const SAM_PRITCHARD_PERSON_UUID = '49';
	const ROGER_CHAPMAN_PERSON_UUID = '52';
	const LIGHTS_OUT_THE_SITE_PRODUCTION_UUID = '56';

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

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

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
					// Contrivance for purposes of test.
					{
						entities: [
							{
								name: 'Robert Fox'
							}
						]
					},
					// Contrivance for purposes of testing company with multiple producer credits for same production.
					{
						name: 'in association with',
						entities: [
							{
								model: 'company',
								name: 'Sonia Friedman Productions'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'in partnership with',
						entities: [
							{
								model: 'company',
								name: 'Sonia Friedman Productions'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'in a co-production with',
						entities: [
							{
								model: 'company',
								name: 'Royal Court Theatre',
								creditedMembers: [
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
								model: 'company',
								name: 'Old Vic Productions'
							},
							{
								model: 'company',
								name: 'Playful Productions',
								creditedMembers: [
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
					// Contrivance for purposes of test.
					{
						name: 'producing by',
						entities: [
							{
								name: 'Robert Fox'
							}
						]
					},
					// Contrivance for purposes of testing person with multiple producer credits for same production.
					{
						name: 'associate producing by',
						entities: [
							{
								name: 'Eric Abraham'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'partnership producing by',
						entities: [
							{
								model: 'company',
								name: 'Sonia Friedman Productions'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'co-producing by',
						entities: [
							{
								model: 'company',
								name: 'Old Vic Productions'
							},
							{
								name: 'Paul Elliott'
							},
							{
								model: 'company',
								name: 'Royal Court Theatre',
								creditedMembers: [
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
								model: 'company',
								name: 'Playful Productions',
								creditedMembers: [
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
					// Contrivance for purposes of test.
					{
						name: 'producing services by',
						entities: [
							{
								name: 'Robert Fox'
							}
						]
					},
					// Contrivance for purposes of testing company and credited member with multiple producer credits for same production.
					{
						name: 'associate producing services by',
						entities: [
							{
								model: 'company',
								name: 'Playful Productions',
								creditedMembers: [
									{
										name: 'Matthew Byam Shaw'
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'partnership producing services by',
						entities: [
							{
								model: 'company',
								name: 'Sonia Friedman Productions'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'co-producing services by',
						entities: [
							{
								name: 'Eric Abraham'
							},
							{
								model: 'company',
								name: 'Royal Court Theatre',
								creditedMembers: [
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
								model: 'company',
								name: 'Playful Productions',
								creditedMembers: [
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
								model: 'company',
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
					// Contrivance for purposes of test.
					{
						name: 'co-producing services by',
						entities: [
							{
								name: 'Eric Abraham'
							},
							{
								model: 'company',
								name: 'Royal Court Theatre',
								creditedMembers: [
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
								model: 'company',
								name: 'Playful Productions',
								creditedMembers: [
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
								model: 'company',
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
					model: 'producerCredit',
					name: 'produced by',
					entities: [
						{
							model: 'person',
							uuid: ROBERT_FOX_PERSON_UUID,
							name: 'Robert Fox'
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'in association with',
					entities: [
						{
							model: 'company',
							uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
							name: 'Sonia Friedman Productions',
							creditedMembers: []
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'in partnership with',
					entities: [
						{
							model: 'company',
							uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
							name: 'Sonia Friedman Productions',
							creditedMembers: []
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'in a co-production with',
					entities: [
						{
							model: 'company',
							uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
							name: 'Royal Court Theatre',
							creditedMembers: [
								{
									model: 'person',
									uuid: VICKY_FEATHERSTONE_PERSON_UUID,
									name: 'Vicky Featherstone'
								},
								{
									model: 'person',
									uuid: LUCY_DAVIES_PERSON_UUID,
									name: 'Lucy Davies'
								},
								{
									model: 'person',
									uuid: OLA_INCE_PERSON_UUID,
									name: 'Ola Ince'
								}
							]
						},
						{
							model: 'person',
							uuid: PAUL_ELLIOTT_PERSON_UUID,
							name: 'Paul Elliott'
						},
						{
							model: 'company',
							uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
							name: 'Old Vic Productions',
							creditedMembers: []
						},
						{
							model: 'company',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							creditedMembers: [
								{
									model: 'person',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								},
								{
									model: 'person',
									uuid: NIA_JANIS_PERSON_UUID,
									name: 'Nia Janis'
								},
								{
									model: 'person',
									uuid: NICK_SALMON_PERSON_UUID,
									name: 'Nick Salmon'
								}
							]
						},
						{
							model: 'person',
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
					model: 'producerCredit',
					name: 'producing by',
					entities: [
						{
							model: 'person',
							uuid: ROBERT_FOX_PERSON_UUID,
							name: 'Robert Fox'
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'associate producing by',
					entities: [
						{
							model: 'person',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'partnership producing by',
					entities: [
						{
							model: 'company',
							uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
							name: 'Sonia Friedman Productions',
							creditedMembers: []
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'co-producing by',
					entities: [
						{
							model: 'company',
							uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
							name: 'Old Vic Productions',
							creditedMembers: []
						},
						{
							model: 'person',
							uuid: PAUL_ELLIOTT_PERSON_UUID,
							name: 'Paul Elliott'
						},
						{
							model: 'company',
							uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
							name: 'Royal Court Theatre',
							creditedMembers: [
								{
									model: 'person',
									uuid: VICKY_FEATHERSTONE_PERSON_UUID,
									name: 'Vicky Featherstone'
								},
								{
									model: 'person',
									uuid: HAMISH_PIRIE_PERSON_UUID,
									name: 'Hamish Pirie'
								},
								{
									model: 'person',
									uuid: LUCY_DAVIES_PERSON_UUID,
									name: 'Lucy Davies'
								}
							]
						},
						{
							model: 'person',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						},
						{
							model: 'company',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							creditedMembers: [
								{
									model: 'person',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								},
								{
									model: 'person',
									uuid: HARRIET_ASTBURY_PERSON_UUID,
									name: 'Harriet Astbury'
								},
								{
									model: 'person',
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
					model: 'producerCredit',
					name: 'producing services by',
					entities: [
						{
							model: 'person',
							uuid: ROBERT_FOX_PERSON_UUID,
							name: 'Robert Fox'
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'associate producing services by',
					entities: [
						{
							model: 'company',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							creditedMembers: [
								{
									model: 'person',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								}
							]
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'partnership producing services by',
					entities: [
						{
							model: 'company',
							uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
							name: 'Sonia Friedman Productions',
							creditedMembers: []
						}
					]
				},
				{
					model: 'producerCredit',
					name: 'co-producing services by',
					entities: [
						{
							model: 'person',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						},
						{
							model: 'company',
							uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
							name: 'Royal Court Theatre',
							creditedMembers: [
								{
									model: 'person',
									uuid: SAM_PRITCHARD_PERSON_UUID,
									name: 'Sam Pritchard'
								},
								{
									model: 'person',
									uuid: VICKY_FEATHERSTONE_PERSON_UUID,
									name: 'Vicky Featherstone'
								},
								{
									model: 'person',
									uuid: LUCY_DAVIES_PERSON_UUID,
									name: 'Lucy Davies'
								}
							]
						},
						{
							model: 'company',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							creditedMembers: [
								{
									model: 'person',
									uuid: ROGER_CHAPMAN_PERSON_UUID,
									name: 'Roger Chapman'
								},
								{
									model: 'person',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								},
								{
									model: 'person',
									uuid: NIA_JANIS_PERSON_UUID,
									name: 'Nia Janis'
								}
							]
						},
						{
							model: 'company',
							uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
							name: 'Old Vic Productions',
							creditedMembers: []
						},
						{
							model: 'person',
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
					model: 'producerCredit',
					name: 'co-producing services by',
					entities: [
						{
							model: 'person',
							uuid: ERIC_ABRAHAM_PERSON_UUID,
							name: 'Eric Abraham'
						},
						{
							model: 'company',
							uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
							name: 'Royal Court Theatre',
							creditedMembers: [
								{
									model: 'person',
									uuid: SAM_PRITCHARD_PERSON_UUID,
									name: 'Sam Pritchard'
								},
								{
									model: 'person',
									uuid: VICKY_FEATHERSTONE_PERSON_UUID,
									name: 'Vicky Featherstone'
								},
								{
									model: 'person',
									uuid: LUCY_DAVIES_PERSON_UUID,
									name: 'Lucy Davies'
								}
							]
						},
						{
							model: 'company',
							uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
							name: 'Playful Productions',
							creditedMembers: [
								{
									model: 'person',
									uuid: NICK_SALMON_PERSON_UUID,
									name: 'Nick Salmon'
								},
								{
									model: 'person',
									uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
									name: 'Matthew Byam Shaw'
								},
								{
									model: 'person',
									uuid: NIA_JANIS_PERSON_UUID,
									name: 'Nia Janis'
								}
							]
						},
						{
							model: 'company',
							uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
							name: 'Old Vic Productions',
							creditedMembers: []
						},
						{
							model: 'person',
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
					model: 'production',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing by',
							entities: [
								{
									model: 'person',
									uuid: null,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing by',
							entities: [
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'person',
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
					model: 'production',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing services by',
							entities: [
								{
									model: 'person',
									uuid: null,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing services by',
							entities: [
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'venue',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'produced by',
							entities: [
								{
									model: 'person',
									uuid: null,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in association with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in partnership with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in a co-production with',
							entities: [
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'person',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'person',
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
					model: 'production',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing by',
							entities: [
								{
									model: 'person',
									uuid: null,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing by',
							entities: [
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'person',
									uuid: null,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'person',
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
					model: 'production',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing services by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing services by',
							entities: [
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: null,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: LIGHTS_OUT_THE_SITE_PRODUCTION_UUID,
					name: 'Lights Out',
					startDate: '2017-05-17',
					endDate: '2017-05-19',
					venue: {
						model: 'venue',
						uuid: THE_SITE_VENUE_UUID,
						name: 'The Site',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: null,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'venue',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'produced by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in association with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in partnership with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in a co-production with',
							entities: [
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'person',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'person',
									uuid: null,
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
					model: 'production',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing by',
							entities: [
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: null,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'person',
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
					model: 'production',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing services by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing services by',
							entities: [
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: null,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'person',
											uuid: null,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: LIGHTS_OUT_THE_SITE_PRODUCTION_UUID,
					name: 'Lights Out',
					startDate: '2017-05-17',
					endDate: '2017-05-19',
					venue: {
						model: 'venue',
						uuid: THE_SITE_VENUE_UUID,
						name: 'The Site',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										},
										{
											model: 'person',
											uuid: null,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'venue',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'produced by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in association with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in partnership with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in a co-production with',
							entities: [
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'person',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: null,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'person',
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
					model: 'production',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing services by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing services by',
							entities: [
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: null,
											name: 'Roger Chapman'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
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
					model: 'production',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing by',
							entities: [
								{
									model: 'company',
									uuid: null,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing by',
							entities: [
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'person',
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
					model: 'production',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing services by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing services by',
							entities: [
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'company',
									uuid: null,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'venue',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'produced by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in association with',
							entities: [
								{
									model: 'company',
									uuid: null,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in partnership with',
							entities: [
								{
									model: 'company',
									uuid: null,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in a co-production with',
							entities: [
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'person',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'person',
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
					model: 'production',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing by',
							entities: [
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: null,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'person',
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
					model: 'production',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing services by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing services by',
							entities: [
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: null,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: LIGHTS_OUT_THE_SITE_PRODUCTION_UUID,
					name: 'Lights Out',
					startDate: '2017-05-17',
					endDate: '2017-05-19',
					venue: {
						model: 'venue',
						uuid: THE_SITE_VENUE_UUID,
						name: 'The Site',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: null,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'venue',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'produced by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in association with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in partnership with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in a co-production with',
							entities: [
								{
									model: 'company',
									uuid: null,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'person',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'company',
									uuid: PLAYFUL_PRODUCTIONS_COMPANY_UUID,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'person',
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
					model: 'production',
					uuid: WHITE_PEARL_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
					name: 'White Pearl',
					startDate: '2019-05-10',
					endDate: '2019-06-15',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing by',
							entities: [
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: HAMISH_PIRIE_PERSON_UUID,
											name: 'Hamish Pirie'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: null,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: HARRIET_ASTBURY_PERSON_UUID,
											name: 'Harriet Astbury'
										},
										{
											model: 'person',
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
					model: 'production',
					uuid: PAH_LA_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Pah-La',
					startDate: '2019-04-03',
					endDate: '2019-04-27',
					venue: {
						model: 'venue',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'producing services by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'associate producing services by',
							entities: [
								{
									model: 'company',
									uuid: null,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										}
									]
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'partnership producing services by',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: null,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: ROGER_CHAPMAN_PERSON_UUID,
											name: 'Roger Chapman'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: LIGHTS_OUT_THE_SITE_PRODUCTION_UUID,
					name: 'Lights Out',
					startDate: '2017-05-17',
					endDate: '2017-05-19',
					venue: {
						model: 'venue',
						uuid: THE_SITE_VENUE_UUID,
						name: 'The Site',
						surVenue: {
							model: 'venue',
							uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
							name: 'Royal Court Theatre'
						}
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'co-producing services by',
							entities: [
								{
									model: 'person',
									uuid: ERIC_ABRAHAM_PERSON_UUID,
									name: 'Eric Abraham'
								},
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: SAM_PRITCHARD_PERSON_UUID,
											name: 'Sam Pritchard'
										},
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										}
									]
								},
								{
									model: 'company',
									uuid: null,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										},
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										}
									]
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HANGMEN_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hangmen',
					startDate: '2015-12-01',
					endDate: '2016-03-05',
					venue: {
						model: 'venue',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					producerCredits: [
						{
							model: 'producerCredit',
							name: 'produced by',
							entities: [
								{
									model: 'person',
									uuid: ROBERT_FOX_PERSON_UUID,
									name: 'Robert Fox'
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in association with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in partnership with',
							entities: [
								{
									model: 'company',
									uuid: SONIA_FRIEDMAN_PRODUCTIONS_COMPANY_UUID,
									name: 'Sonia Friedman Productions',
									creditedMembers: []
								}
							]
						},
						{
							model: 'producerCredit',
							name: 'in a co-production with',
							entities: [
								{
									model: 'company',
									uuid: ROYAL_COURT_THEATRE_COMPANY_UUID,
									name: 'Royal Court Theatre',
									creditedMembers: [
										{
											model: 'person',
											uuid: VICKY_FEATHERSTONE_PERSON_UUID,
											name: 'Vicky Featherstone'
										},
										{
											model: 'person',
											uuid: LUCY_DAVIES_PERSON_UUID,
											name: 'Lucy Davies'
										},
										{
											model: 'person',
											uuid: OLA_INCE_PERSON_UUID,
											name: 'Ola Ince'
										}
									]
								},
								{
									model: 'person',
									uuid: PAUL_ELLIOTT_PERSON_UUID,
									name: 'Paul Elliott'
								},
								{
									model: 'company',
									uuid: OLD_VIC_PRODUCTIONS_COMPANY_UUID,
									name: 'Old Vic Productions',
									creditedMembers: []
								},
								{
									model: 'company',
									uuid: null,
									name: 'Playful Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: MATTHEW_BYAM_SHAW_PERSON_UUID,
											name: 'Matthew Byam Shaw'
										},
										{
											model: 'person',
											uuid: NIA_JANIS_PERSON_UUID,
											name: 'Nia Janis'
										},
										{
											model: 'person',
											uuid: NICK_SALMON_PERSON_UUID,
											name: 'Nick Salmon'
										}
									]
								},
								{
									model: 'person',
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
