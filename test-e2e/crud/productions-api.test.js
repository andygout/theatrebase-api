import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const sandbox = createSandbox();

describe('CRUD (Create, Read, Update, Delete): Productions API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new production', async () => {

			const response = await chai.request(app)
				.get('/productions/new');

			const expectedResponseBody = {
				model: 'PRODUCTION',
				name: '',
				subtitle: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: '',
					differentiator: '',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').returns(PRODUCTION_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(0);

			const response = await chai.request(app)
				.post('/productions')
				.send({
					name: 'As You Like It'
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It',
				subtitle: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: '',
					differentiator: '',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('gets data required to edit specific production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}/edit`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It',
				subtitle: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: '',
					differentiator: '',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'The Tempest'
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				subtitle: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: '',
					differentiator: '',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('shows production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				subtitle: null,
				startDate: null,
				pressDate: null,
				endDate: null,
				material: null,
				venue: null,
				season: null,
				festival: null,
				surProduction: null,
				subProductions: [],
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: [],
				reviews: [],
				awards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				name: 'The Tempest',
				subtitle: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: '',
					differentiator: '',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [],
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: [],
				reviews: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID = 'HAMLET_SUB_PRODUCTION_#1_PRODUCTION_UUID';
		const HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID = 'HAMLET_SUB_PRODUCTION_#2_PRODUCTION_UUID';
		const HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID = 'HAMLET_SUB_PRODUCTION_#3_PRODUCTION_UUID';
		const RICHARD_III_SUB_PRODUCTION_1_PRODUCTION_UUID = 'RICHARD_III_SUB_PRODUCTION_#1_PRODUCTION_UUID';
		const RICHARD_III_SUB_PRODUCTION_2_PRODUCTION_UUID = 'RICHARD_III_SUB_PRODUCTION_#2_PRODUCTION_UUID';
		const RICHARD_III_SUB_PRODUCTION_3_PRODUCTION_UUID = 'RICHARD_III_SUB_PRODUCTION_#3_PRODUCTION_UUID';
		const PRODUCTION_UUID = 'HAMLET_PRODUCTION_UUID';
		const THE_TRAGEDY_OF_HAMLET_MATERIAL_UUID = 'THE_TRAGEDY_OF_HAMLET_1_MATERIAL_UUID';
		const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_1_VENUE_UUID';
		const SHAKESPEAREAN_TRAGEDY_SEASON_UUID = 'SHAKESPEAREAN_TRAGEDY_SEASON_1_SEASON_UUID';
		const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'THE_COMPLETE_WORKS_1_FESTIVAL_UUID';
		const LISA_BURGER_PERSON_UUID = 'LISA_BURGER_1_PERSON_UUID';
		const FUEL_THEATRE_COMPANY_UUID = 'FUEL_THEATRE_1_COMPANY_UUID';
		const SIMON_GODWIN_PERSON_UUID = 'SIMON_GODWIN_1_PERSON_UUID';
		const TOM_MORRIS_PERSON_UUID = 'TOM_MORRIS_1_PERSON_UUID';
		const NATIONAL_THEATRE_COMPANY_UUID = 'NATIONAL_THEATRE_COMPANY_1_COMPANY_UUID';
		const NICHOLAS_HYTNER_PERSON_UUID = 'NICHOLAS_HYTNER_1_PERSON_UUID';
		const NICK_STARR_PERSON_UUID = 'NICK_STARR_1_PERSON_UUID';
		const LONDON_THEATRE_COMPANY_UUID = 'LONDON_THEATRE_COMPANY_1_COMPANY_UUID';
		const RORY_KINNEAR_PERSON_UUID = 'RORY_KINNEAR_1_PERSON_UUID';
		const JAMES_LAURENSON_PERSON_UUID = 'JAMES_LAURENSON_1_PERSON_UUID';
		const MICHAEL_SHELDON_PERSON_UUID = 'MICHAEL_SHELDON_1_PERSON_UUID';
		const LEO_STAAR_PERSON_UUID = 'LEO_STAAR_1_PERSON_UUID';
		const HANDSPRING_PUPPET_COMPANY_UUID = 'HANDSPRING_PUPPET_COMPANY_1_COMPANY_UUID';
		const BEN_RINGHAM_PERSON_UUID = 'BEN_RINGHAM_1_PERSON_UUID';
		const MAX_RINGHAM_PERSON_UUID = 'MAX_RINGHAM_1_PERSON_UUID';
		const FIFTY_NINE_PRODUCTIONS_COMPANY_UUID = '59_PRODUCTIONS_1_COMPANY_UUID';
		const LEO_WARNER_PERSON_UUID = 'LEO_WARNER_1_PERSON_UUID';
		const MARK_GRIMMER_PERSON_UUID = 'MARK_GRIMMER_1_PERSON_UUID';
		const IGOR_PERSON_UUID = 'IGOR_1_PERSON_UUID';
		const CREW_DEPUTIES_LTD_COMPANY_UUID = 'CREW_DEPUTIES_LTD_1_COMPANY_UUID';
		const SARA_GUNTER_PERSON_UUID = 'SARA_GUNTER_1_PERSON_UUID';
		const JULIA_WICKHAM_PERSON_UUID = 'JULIA_WICKHAM_1_PERSON_UUID';
		const CREW_ASSISTANTS_LTD_COMPANY_UUID = 'CREW_ASSISTANTS_LTD_1_COMPANY_UUID';
		const MOLLY_EINCHCOMB_PERSON_UUID = 'MOLLY_EINCHCOMB_1_PERSON_UUID';
		const MATTHEW_HELLYER_PERSON_UUID = 'MATTHEW_HELLYER_1_PERSON_UUID';
		const FINANCIAL_TIMES_COMPANY_UUID = 'FINANCIAL_TIMES_1_COMPANY_UUID';
		const IAN_SHUTTLEWORTH_PERSON_UUID = 'IAN_SHUTTLEWORTH_1_PERSON_UUID';
		const THE_GUARDIAN_COMPANY_UUID = 'THE_GUARDIAN_1_COMPANY_UUID';
		const MICHAEL_BILLINGTON_PERSON_UUID = 'MICHAEL_BILLINGTON_1_PERSON_UUID';
		const THE_TELEGRAPH_COMPANY_UUID = 'THE_TELEGRAPH_1_COMPANY_UUID';
		const CHARLES_SPENCER_PERSON_UUID = 'CHARLES_SPENCER_1_PERSON_UUID';
		const THE_TRAGEDY_OF_KING_RICHARD_III_MATERIAL_UUID = 'THE_TRAGEDY_OF_KING_RICHARD_III_1_MATERIAL_UUID';
		const ALMEIDA_THEATRE_VENUE_UUID = 'ALMEIDA_THEATRE_1_VENUE_UUID';
		const SHAKESPEAREAN_HISTORY_SEASON_UUID = 'SHAKESPEAREAN_HISTORY_SEASON_1_SEASON_UUID';
		const GLOBE_TO_GLOBE_FESTIVAL_UUID = 'GLOBE_TO_GLOBE_1_FESTIVAL_UUID';
		const DENISE_WOOD_PERSON_UUID = 'DENISE_WOOD_1_PERSON_UUID';
		const TIATA_FAHODZI_COMPANY_UUID = 'TIATA_FAHODZI_1_COMPANY_UUID';
		const REBECCA_FRECKNALL_PERSON_UUID = 'REBECCA_FRECKNALL_1_PERSON_UUID';
		const SIMEON_BLAKE_HALL_PERSON_UUID = 'SIMEON_BLAKE_HALL_1_PERSON_UUID';
		const ALMEIDA_THEATRE_COMPANY_UUID = 'ALMEIDA_THEATRE_COMPANY_1_COMPANY_UUID';
		const RUPERT_GOOLD_PERSON_UUID = 'RUPERT_GOOLD_1_PERSON_UUID';
		const ROBERT_ICKE_PERSON_UUID = 'ROBERT_ICKE_1_PERSON_UUID';
		const HEADLONG_THEATRE_COMPANY_UUID = 'HEADLONG_THEATRE_1_COMPANY_UUID';
		const RALPH_FIENNES_PERSON_UUID = 'RALPH_FIENNES_1_PERSON_UUID';
		const TOM_CANTON_PERSON_UUID = 'TOM_CANTON_1_PERSON_UUID';
		const MARK_HADFIELD_PERSON_UUID = 'MARK_HADFIELD_1_PERSON_UUID';
		const JOSH_COLLINS_PERSON_UUID = 'JOSH_COLLINS_1_PERSON_UUID';
		const RC_ANNIE_COMPANY_UUID = 'RC_ANNIE_1_COMPANY_UUID';
		const HILDEGARD_BECHTLER_PERSON_UUID = 'HILDEGARD_BECHTLER_1_PERSON_UUID';
		const CHLOE_LAMFORD_PERSON_UUID = 'CHLOE_LAMFORD_1_PERSON_UUID';
		const AUTOGRAPH_COMPANY_UUID = 'AUTOGRAPH_1_COMPANY_UUID';
		const ANDREW_BRUCE_PERSON_UUID = 'ANDREW_BRUCE_1_PERSON_UUID';
		const NICK_LIDSTER_PERSON_UUID = 'NICK_LIDSTER_1_PERSON_UUID';
		const ANNA_ANDERSON_PERSON_UUID = 'ANNA_ANDERSON_1_PERSON_UUID';
		const DEPUTY_STAGE_MANAGERS_LTD_COMPANY_UUID = 'DEPUTY_STAGE_MANAGERS_LTD_1_COMPANY_UUID';
		const CHERYL_FIRTH_PERSON_UUID = 'CHERYL_FIRTH_1_PERSON_UUID';
		const TOM_LEGGAT_PERSON_UUID = 'TOM_LEGGAT_1_PERSON_UUID';
		const DESIGN_ASSISTANTS_LTD_COMPANY_UUID = 'DESIGN_ASSISTANTS_LTD_1_COMPANY_UUID';
		const COLIN_FALCONER_PERSON_UUID = 'COLIN_FALCONER_1_PERSON_UUID';
		const ALEX_LOWDE_PERSON_UUID = 'ALEX_LOWDE_1_PERSON_UUID';
		const SARAH_HEMMING_PERSON_UUID = 'SARAH_HEMMING_1_PERSON_UUID';
		const DOMINIC_CAVENDISH_PERSON_UUID = 'DOMINIC_CAVENDISH_1_PERSON_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

			await purgeDatabase();

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet sub-production #1'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet sub-production #2'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet sub-production #3'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Richard III sub-production #1'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Richard III sub-production #2'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Richard III sub-production #3'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('creates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(6);

			const response = await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					subtitle: 'Prince of Denmark',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					material: {
						name: 'The Tragedy of Hamlet',
						differentiator: '1'
					},
					venue: {
						name: 'National Theatre',
						differentiator: '1'
					},
					season: {
						name: 'Shakespearean Tragedy Season',
						differentiator: '1'
					},
					festival: {
						name: 'The Complete Works',
						differentiator: '1'
					},
					subProductions: [
						{
							uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID
						},
						{
							uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID
						},
						{
							uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID
						}
					],
					producerCredits: [
						{
							name: 'executive produced by',
							entities: [
								{
									name: 'Lisa Burger',
									differentiator: '1'
								}
							]
						},
						{
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									name: 'Fuel Theatre',
									differentiator: '1'
								}
							]
						},
						{
							name: 'associate produced by',
							entities: [
								{
									name: 'Simon Godwin',
									differentiator: '1'
								},
								{
									name: 'Tom Morris',
									differentiator: '1'
								}
							]
						},
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'National Theatre Company',
									differentiator: '1',
									members: [
										{
											name: 'Nicholas Hytner',
											differentiator: '1'
										},
										{
											name: 'Nick Starr',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'co-produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'London Theatre Company',
									differentiator: '1',
									members: [
										{
											name: 'Nicholas Hytner',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							name: 'Rory Kinnear',
							differentiator: '1',
							roles: [
								{
									name: 'Hamlet',
									characterName: 'Hamlet, Prince of Denmark',
									characterDifferentiator: '1',
									qualifier: 'foo'
								}
							]
						},
						{
							name: 'James Laurenson',
							differentiator: '1',
							roles: [
								{
									name: 'Ghost',
									characterName: 'Ghost of King Hamlet',
									characterDifferentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'First Player',
									characterName: 'Player King',
									characterDifferentiator: '1',
									qualifier: 'baz'
								}
							]
						},
						{
							name: 'Michael Sheldon',
							differentiator: '1',
							roles: [
								{
									name: 'Third Player',
									characterName: 'Lucianus',
									characterDifferentiator: '1',
									qualifier: 'qux'
								},
								{
									name: 'Ambassador of the English',
									characterName: 'English Ambassador',
									characterDifferentiator: '1',
									qualifier: 'quux',
									isAlternate: true
								}
							]
						},
						{
							name: 'Leo Staar',
							differentiator: '1',
							roles: []
						}
					],
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Nicholas Hytner',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Designers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Handspring Puppet Company',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Sound Designers',
							entities: [
								{
									name: 'Ben Ringham',
									differentiator: '1'
								},
								{
									name: 'Max Ringham',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Lighting Designers',
							entities: [
								{
									model: 'COMPANY',
									name: '59 Productions',
									differentiator: '1',
									members: [
										{
											name: 'Leo Warner',
											differentiator: '1'
										},
										{
											name: 'Mark Grimmer',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Video Designers',
							entities: [
								{
									model: 'COMPANY',
									name: '59 Productions',
									differentiator: '1',
									members: [
										{
											name: 'Leo Warner',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Igor',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Deputies Ltd',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									name: 'Sara Gunter',
									differentiator: '1'
								},
								{
									name: 'Julia Wickham',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										},
										{
											name: 'Matthew Hellyer',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Sound Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					reviews: [
						{
							url: 'https://www.ft.com/content/1f8d723c-d2fa-11df-9ae9-00144feabdc0',
							date: '2010-10-09',
							publication: {
								name: 'Financial Times',
								differentiator: '1'
							},
							critic: {
								name: 'Ian Shuttleworth',
								differentiator: '1'
							}
						},
						{
							url: 'https://www.theguardian.com/culture/2010/oct/08/hamlet-review-rory-kinnear',
							date: '2010-10-10',
							publication: {
								name: 'The Guardian',
								differentiator: '1'
							},
							critic: {
								name: 'Michael Billington',
								differentiator: '1'
							}
						},
						{
							url: 'https://www.telegraph.co.uk/culture/theatre/theatre-reviews/8050155/Hamlet-National-Theatre-review.html',
							date: '2010-10-08',
							publication: {
								name: 'The Telegraph',
								differentiator: '1'
							},
							critic: {
								name: 'Charles Spencer',
								differentiator: '1'
							}
						}
					]
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				subtitle: 'Prince of Denmark',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: 'The Tragedy of Hamlet',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: 'Shakespearean Tragedy Season',
					differentiator: '1',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: 'The Complete Works',
					differentiator: '1',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Lisa Burger',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Fuel Theatre',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Simon Godwin',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Tom Morris',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'National Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Nick Starr',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'London Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: 'Rory Kinnear',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark',
								characterDifferentiator: '1',
								qualifier: 'foo',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'James Laurenson',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '1',
								qualifier: 'bar',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'First Player',
								characterName: 'Player King',
								characterDifferentiator: '1',
								qualifier: 'baz',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Michael Sheldon',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Third Player',
								characterName: 'Lucianus',
								characterDifferentiator: '1',
								qualifier: 'qux',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Ambassador of the English',
								characterName: 'English Ambassador',
								characterDifferentiator: '1',
								qualifier: 'quux',
								isAlternate: true,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Leo Staar',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Nicholas Hytner',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Handspring Puppet Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Ben Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Max Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Lighting Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Mark Grimmer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Igor',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Sara Gunter',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Julia Wickham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Matthew Hellyer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: 'https://www.ft.com/content/1f8d723c-d2fa-11df-9ae9-00144feabdc0',
						date: '2010-10-09',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'Financial Times',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Ian Shuttleworth',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2010/oct/08/hamlet-review-rory-kinnear',
						date: '2010-10-10',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'The Guardian',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Michael Billington',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.telegraph.co.uk/culture/theatre/theatre-reviews/8050155/Hamlet-National-Theatre-review.html',
						date: '2010-10-08',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'The Telegraph',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Charles Spencer',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(7);

		});

		it('shows production (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				subtitle: 'Prince of Denmark',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				material: {
					model: 'MATERIAL',
					uuid: THE_TRAGEDY_OF_HAMLET_MATERIAL_UUID,
					name: 'The Tragedy of Hamlet',
					format: null,
					year: null,
					surMaterial: null,
					writingCredits: []
				},
				venue: {
					model: 'VENUE',
					uuid: NATIONAL_THEATRE_VENUE_UUID,
					name: 'National Theatre',
					surVenue: null
				},
				season: {
					model: 'SEASON',
					uuid: SHAKESPEAREAN_TRAGEDY_SEASON_UUID,
					name: 'Shakespearean Tragedy Season'
				},
				festival: {
					model: 'FESTIVAL',
					uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
					name: 'The Complete Works',
					festivalSeries: null
				},
				surProduction: null,
				subProductions: [
					{
						model: 'PRODUCTION',
						uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID,
						name: 'Hamlet sub-production #1',
						subtitle: null,
						startDate: null,
						pressDate: null,
						endDate: null,
						material: null,
						venue: null,
						season: null,
						festival: null,
						subProductions: [],
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: [],
						reviews: []
					},
					{
						model: 'PRODUCTION',
						uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID,
						name: 'Hamlet sub-production #2',
						subtitle: null,
						startDate: null,
						pressDate: null,
						endDate: null,
						material: null,
						venue: null,
						season: null,
						festival: null,
						subProductions: [],
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: [],
						reviews: []
					},
					{
						model: 'PRODUCTION',
						uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID,
						name: 'Hamlet sub-production #3',
						subtitle: null,
						startDate: null,
						pressDate: null,
						endDate: null,
						material: null,
						venue: null,
						season: null,
						festival: null,
						subProductions: [],
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: [],
						reviews: []
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: LISA_BURGER_PERSON_UUID,
								name: 'Lisa Burger'
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						entities: [
							{
								model: 'COMPANY',
								uuid: FUEL_THEATRE_COMPANY_UUID,
								name: 'Fuel Theatre',
								members: []
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: SIMON_GODWIN_PERSON_UUID,
								name: 'Simon Godwin'
							},
							{
								model: 'PERSON',
								uuid: TOM_MORRIS_PERSON_UUID,
								name: 'Tom Morris'
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						entities: [
							{
								model: 'COMPANY',
								uuid: NATIONAL_THEATRE_COMPANY_UUID,
								name: 'National Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: NICHOLAS_HYTNER_PERSON_UUID,
										name: 'Nicholas Hytner'
									},
									{
										model: 'PERSON',
										uuid: NICK_STARR_PERSON_UUID,
										name: 'Nick Starr'
									}
								]
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						entities: [
							{
								model: 'COMPANY',
								uuid: LONDON_THEATRE_COMPANY_UUID,
								name: 'London Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: NICHOLAS_HYTNER_PERSON_UUID,
										name: 'Nicholas Hytner'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						uuid: RORY_KINNEAR_PERSON_UUID,
						name: 'Rory Kinnear',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Hamlet',
								qualifier: 'foo',
								isAlternate: false
							}
						]
					},
					{
						model: 'PERSON',
						uuid: JAMES_LAURENSON_PERSON_UUID,
						name: 'James Laurenson',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Ghost',
								qualifier: 'bar',
								isAlternate: false
							},
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'First Player',
								qualifier: 'baz',
								isAlternate: false
							}
						]
					},
					{
						model: 'PERSON',
						uuid: MICHAEL_SHELDON_PERSON_UUID,
						name: 'Michael Sheldon',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Third Player',
								qualifier: 'qux',
								isAlternate: false
							},
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Ambassador of the English',
								qualifier: 'quux',
								isAlternate: true
							}
						]
					},
					{
						model: 'PERSON',
						uuid: LEO_STAAR_PERSON_UUID,
						name: 'Leo Staar',
						roles: [
							{
								name: 'Performer'
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						entities: [
							{
								model: 'PERSON',
								uuid: NICHOLAS_HYTNER_PERSON_UUID,
								name: 'Nicholas Hytner'
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: HANDSPRING_PUPPET_COMPANY_UUID,
								name: 'Handspring Puppet Company',
								members: []
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						entities: [
							{
								model: 'PERSON',
								uuid: BEN_RINGHAM_PERSON_UUID,
								name: 'Ben Ringham'
							},
							{
								model: 'PERSON',
								uuid: MAX_RINGHAM_PERSON_UUID,
								name: 'Max Ringham'
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Lighting Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								members: [
									{
										model: 'PERSON',
										uuid: LEO_WARNER_PERSON_UUID,
										name: 'Leo Warner'
									},
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								members: [
									{
										model: 'PERSON',
										uuid: LEO_WARNER_PERSON_UUID,
										name: 'Leo Warner'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						entities: [
							{
								model: 'PERSON',
								uuid: IGOR_PERSON_UUID,
								name: 'Igor'
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						entities: [
							{
								model: 'COMPANY',
								uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
								name: 'Crew Deputies Ltd',
								members: []
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						entities: [
							{
								model: 'PERSON',
								uuid: SARA_GUNTER_PERSON_UUID,
								name: 'Sara Gunter'
							},
							{
								model: 'PERSON',
								uuid: JULIA_WICKHAM_PERSON_UUID,
								name: 'Julia Wickham'
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						entities: [
							{
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: MOLLY_EINCHCOMB_PERSON_UUID,
										name: 'Molly Einchcomb'
									},
									{
										model: 'PERSON',
										uuid: MATTHEW_HELLYER_PERSON_UUID,
										name: 'Matthew Hellyer'
									}
								]
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						entities: [
							{
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: MOLLY_EINCHCOMB_PERSON_UUID,
										name: 'Molly Einchcomb'
									}
								]
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: 'https://www.telegraph.co.uk/culture/theatre/theatre-reviews/8050155/Hamlet-National-Theatre-review.html',
						date: '2010-10-08',
						publication: {
							model: 'COMPANY',
							uuid: THE_TELEGRAPH_COMPANY_UUID,
							name: 'The Telegraph'
						},
						critic: {
							model: 'PERSON',
							uuid: CHARLES_SPENCER_PERSON_UUID,
							name: 'Charles Spencer'
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.ft.com/content/1f8d723c-d2fa-11df-9ae9-00144feabdc0',
						date: '2010-10-09',
						publication: {
							model: 'COMPANY',
							uuid: FINANCIAL_TIMES_COMPANY_UUID,
							name: 'Financial Times'
						},
						critic: {
							model: 'PERSON',
							uuid: IAN_SHUTTLEWORTH_PERSON_UUID,
							name: 'Ian Shuttleworth'
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2010/oct/08/hamlet-review-rory-kinnear',
						date: '2010-10-10',
						publication: {
							model: 'COMPANY',
							uuid: THE_GUARDIAN_COMPANY_UUID,
							name: 'The Guardian'
						},
						critic: {
							model: 'PERSON',
							uuid: MICHAEL_BILLINGTON_PERSON_UUID,
							name: 'Michael Billington'
						}
					}
				],
				awards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}/edit`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				subtitle: 'Prince of Denmark',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: 'The Tragedy of Hamlet',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: 'Shakespearean Tragedy Season',
					differentiator: '1',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: 'The Complete Works',
					differentiator: '1',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Lisa Burger',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Fuel Theatre',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Simon Godwin',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Tom Morris',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'National Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Nick Starr',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'London Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: 'Rory Kinnear',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark',
								characterDifferentiator: '1',
								qualifier: 'foo',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'James Laurenson',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '1',
								qualifier: 'bar',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'First Player',
								characterName: 'Player King',
								characterDifferentiator: '1',
								qualifier: 'baz',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Michael Sheldon',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Third Player',
								characterName: 'Lucianus',
								characterDifferentiator: '1',
								qualifier: 'qux',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Ambassador of the English',
								characterName: 'English Ambassador',
								characterDifferentiator: '1',
								qualifier: 'quux',
								isAlternate: true,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Leo Staar',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Nicholas Hytner',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Handspring Puppet Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Ben Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Max Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Lighting Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Mark Grimmer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Igor',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Sara Gunter',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Julia Wickham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Matthew Hellyer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: 'https://www.ft.com/content/1f8d723c-d2fa-11df-9ae9-00144feabdc0',
						date: '2010-10-09',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'Financial Times',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Ian Shuttleworth',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2010/oct/08/hamlet-review-rory-kinnear',
						date: '2010-10-10',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'The Guardian',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Michael Billington',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.telegraph.co.uk/culture/theatre/theatre-reviews/8050155/Hamlet-National-Theatre-review.html',
						date: '2010-10-08',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'The Telegraph',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Charles Spencer',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production (with existing data)', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(7);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					subtitle: 'Prince of Denmark',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					material: {
						name: 'The Tragedy of Hamlet',
						differentiator: '1'
					},
					venue: {
						name: 'National Theatre',
						differentiator: '1'
					},
					season: {
						name: 'Shakespearean Tragedy Season',
						differentiator: '1'
					},
					festival: {
						name: 'The Complete Works',
						differentiator: '1'
					},
					subProductions: [
						{
							uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID
						},
						{
							uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID
						},
						{
							uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID
						}
					],
					producerCredits: [
						{
							name: 'executive produced by',
							entities: [
								{
									name: 'Lisa Burger',
									differentiator: '1'
								}
							]
						},
						{
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									name: 'Fuel Theatre',
									differentiator: '1'
								}
							]
						},
						{
							name: 'associate produced by',
							entities: [
								{
									name: 'Simon Godwin',
									differentiator: '1'
								},
								{
									name: 'Tom Morris',
									differentiator: '1'
								}
							]
						},
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'National Theatre Company',
									differentiator: '1',
									members: [
										{
											name: 'Nicholas Hytner',
											differentiator: '1'
										},
										{
											name: 'Nick Starr',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'co-produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'London Theatre Company',
									differentiator: '1',
									members: [
										{
											name: 'Nicholas Hytner',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							name: 'Rory Kinnear',
							differentiator: '1',
							roles: [
								{
									name: 'Hamlet',
									characterName: 'Hamlet, Prince of Denmark',
									characterDifferentiator: '1',
									qualifier: 'foo'
								}
							]
						},
						{
							name: 'James Laurenson',
							differentiator: '1',
							roles: [
								{
									name: 'Ghost',
									characterName: 'Ghost of King Hamlet',
									characterDifferentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'First Player',
									characterName: 'Player King',
									characterDifferentiator: '1',
									qualifier: 'baz'
								}
							]
						},
						{
							name: 'Michael Sheldon',
							differentiator: '1',
							roles: [
								{
									name: 'Third Player',
									characterName: 'Lucianus',
									characterDifferentiator: '1',
									qualifier: 'qux'
								},
								{
									name: 'Ambassador of the English',
									characterName: 'English Ambassador',
									characterDifferentiator: '1',
									qualifier: 'quux',
									isAlternate: true
								}
							]
						},
						{
							name: 'Leo Staar',
							differentiator: '1',
							roles: []
						}
					],
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Nicholas Hytner',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Designers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Handspring Puppet Company',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Sound Designers',
							entities: [
								{
									name: 'Ben Ringham',
									differentiator: '1'
								},
								{
									name: 'Max Ringham',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Lighting Designers',
							entities: [
								{
									model: 'COMPANY',
									name: '59 Productions',
									differentiator: '1',
									members: [
										{
											name: 'Leo Warner',
											differentiator: '1'
										},
										{
											name: 'Mark Grimmer',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Video Designers',
							entities: [
								{
									model: 'COMPANY',
									name: '59 Productions',
									differentiator: '1',
									members: [
										{
											name: 'Leo Warner',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Igor',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Deputies Ltd',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									name: 'Sara Gunter',
									differentiator: '1'
								},
								{
									name: 'Julia Wickham',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										},
										{
											name: 'Matthew Hellyer',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Sound Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					reviews: [
						{
							url: 'https://www.ft.com/content/1f8d723c-d2fa-11df-9ae9-00144feabdc0',
							date: '2010-10-09',
							publication: {
								name: 'Financial Times',
								differentiator: '1'
							},
							critic: {
								name: 'Ian Shuttleworth',
								differentiator: '1'
							}
						},
						{
							url: 'https://www.theguardian.com/culture/2010/oct/08/hamlet-review-rory-kinnear',
							date: '2010-10-10',
							publication: {
								name: 'The Guardian',
								differentiator: '1'
							},
							critic: {
								name: 'Michael Billington',
								differentiator: '1'
							}
						},
						{
							url: 'https://www.telegraph.co.uk/culture/theatre/theatre-reviews/8050155/Hamlet-National-Theatre-review.html',
							date: '2010-10-08',
							publication: {
								name: 'The Telegraph',
								differentiator: '1'
							},
							critic: {
								name: 'Charles Spencer',
								differentiator: '1'
							}
						}
					]
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				subtitle: 'Prince of Denmark',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: 'The Tragedy of Hamlet',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: 'Shakespearean Tragedy Season',
					differentiator: '1',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: 'The Complete Works',
					differentiator: '1',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Lisa Burger',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Fuel Theatre',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Simon Godwin',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Tom Morris',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'National Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Nick Starr',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'London Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: 'Rory Kinnear',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark',
								characterDifferentiator: '1',
								qualifier: 'foo',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'James Laurenson',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '1',
								qualifier: 'bar',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'First Player',
								characterName: 'Player King',
								characterDifferentiator: '1',
								qualifier: 'baz',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Michael Sheldon',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Third Player',
								characterName: 'Lucianus',
								characterDifferentiator: '1',
								qualifier: 'qux',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Ambassador of the English',
								characterName: 'English Ambassador',
								characterDifferentiator: '1',
								qualifier: 'quux',
								isAlternate: true,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Leo Staar',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Nicholas Hytner',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Handspring Puppet Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Ben Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Max Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Lighting Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Mark Grimmer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Igor',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Sara Gunter',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Julia Wickham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Matthew Hellyer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: 'https://www.ft.com/content/1f8d723c-d2fa-11df-9ae9-00144feabdc0',
						date: '2010-10-09',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'Financial Times',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Ian Shuttleworth',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2010/oct/08/hamlet-review-rory-kinnear',
						date: '2010-10-10',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'The Guardian',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Michael Billington',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.telegraph.co.uk/culture/theatre/theatre-reviews/8050155/Hamlet-National-Theatre-review.html',
						date: '2010-10-08',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'The Telegraph',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Charles Spencer',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(7);

		});

		it('updates production (with new data)', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(7);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'Richard III',
					subtitle: 'The Last King of the Plantagenets',
					startDate: '2016-06-07',
					pressDate: '2016-06-16',
					endDate: '2016-08-06',
					material: {
						name: 'The Tragedy of King Richard III',
						differentiator: '1'
					},
					venue: {
						name: 'Almeida Theatre',
						differentiator: '1'
					},
					season: {
						name: 'Shakespearean History Season',
						differentiator: '1'
					},
					festival: {
						name: 'Globe to Globe',
						differentiator: '1'
					},
					subProductions: [
						{
							uuid: RICHARD_III_SUB_PRODUCTION_1_PRODUCTION_UUID
						},
						{
							uuid: RICHARD_III_SUB_PRODUCTION_2_PRODUCTION_UUID
						},
						{
							uuid: RICHARD_III_SUB_PRODUCTION_3_PRODUCTION_UUID
						}
					],
					producerCredits: [
						{
							name: 'executive produced by',
							entities: [
								{
									name: 'Denise Wood',
									differentiator: '1'
								}
							]
						},
						{
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									name: 'Tiata Fahodzi',
									differentiator: '1'
								}
							]
						},
						{
							name: 'associate produced by',
							entities: [
								{
									name: 'Rebecca Frecknall',
									differentiator: '1'
								},
								{
									name: 'Simeon Blake-Hall',
									differentiator: '1'
								}
							]
						},
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Almeida Theatre Company',
									differentiator: '1',
									members: [
										{
											name: 'Rupert Goold',
											differentiator: '1'
										},
										{
											name: 'Robert Icke',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'co-produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Headlong Theatre',
									differentiator: '1',
									members: [
										{
											name: 'Rupert Goold',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							name: 'Ralph Fiennes',
							differentiator: '1',
							roles: [
								{
									name: 'Richard, Duke of Gloucester',
									characterName: 'King Richard III',
									characterDifferentiator: '1',
									qualifier: 'foo'
								}
							]
						},
						{
							name: 'Tom Canton',
							differentiator: '1',
							roles: [
								{
									name: 'Brakenbury',
									characterName: 'Sir Robert Brakenbury',
									characterDifferentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'Richmond',
									characterName: 'Henry, Earl of Richmond',
									characterDifferentiator: '1',
									qualifier: 'baz'
								}
							]
						},
						{
							name: 'Mark Hadfield',
							differentiator: '1',
							roles: [
								{
									name: 'Ratcliffe',
									characterName: 'Sir Richard Ratcliffe',
									characterDifferentiator: '1',
									qualifier: 'qux'
								},
								{
									name: 'Lord Mayor',
									characterName: 'Lord Mayor of London',
									characterDifferentiator: '1',
									qualifier: 'quux',
									isAlternate: true
								}
							]
						},
						{
							name: 'Josh Collins',
							differentiator: '1'
						}
					],
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Rupert Goold',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Fight Directors',
							entities: [
								{
									model: 'COMPANY',
									name: 'RC-Annie',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Designers',
							entities: [
								{
									name: 'Hildegard Bechtler',
									differentiator: '1'
								},
								{
									name: 'Chloe Lamford',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Sound Designers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									differentiator: '1',
									members: [
										{
											name: 'Andrew Bruce',
											differentiator: '1'
										},
										{
											name: 'Nick Lidster',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Video Designers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									differentiator: '1',
									members: [
										{
											name: 'Andrew Bruce',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Anna Anderson',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Deputy Stage Managers Ltd',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									name: 'Cheryl Firth',
									differentiator: '1'
								},
								{
									name: 'Tom Leggat',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Design Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Colin Falconer',
											differentiator: '1'
										},
										{
											name: 'Alex Lowde',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Sound Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Design Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Colin Falconer',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					reviews: [
						{
							url: 'https://www.ft.com/content/d5cdf386-347a-11e6-bda0-04585c31b153',
							date: '2016-06-18',
							publication: {
								name: 'Financial Times',
								differentiator: '1'
							},
							critic: {
								name: 'Sarah Hemming',
								differentiator: '1'
							}
						},
						{
							url: 'https://www.theguardian.com/stage/2016/jun/16/richard-iii-review-ralph-fiennes-almeida-theatre',
							date: '2016-06-19',
							publication: {
								name: 'The Guardian',
								differentiator: '1'
							},
							critic: {
								name: 'Michael Billington',
								differentiator: '1'
							}
						},
						{
							url: 'https://www.telegraph.co.uk/theatre/what-to-see/richard-iii-almeida-review-getting-up-close-and-personal-with-ra',
							date: '2016-06-17',
							publication: {
								name: 'The Telegraph',
								differentiator: '1'
							},
							critic: {
								name: 'Dominic Cavendish',
								differentiator: '1'
							}
						}
					]
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				subtitle: 'The Last King of the Plantagenets',
				startDate: '2016-06-07',
				pressDate: '2016-06-16',
				endDate: '2016-08-06',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: 'The Tragedy of King Richard III',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: 'Almeida Theatre',
					differentiator: '1',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: 'Shakespearean History Season',
					differentiator: '1',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: 'Globe to Globe',
					differentiator: '1',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: RICHARD_III_SUB_PRODUCTION_1_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: RICHARD_III_SUB_PRODUCTION_2_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: RICHARD_III_SUB_PRODUCTION_3_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Denise Wood',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Tiata Fahodzi',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Rebecca Frecknall',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Simeon Blake-Hall',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Almeida Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Robert Icke',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Headlong Theatre',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: 'Ralph Fiennes',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Richard, Duke of Gloucester',
								characterName: 'King Richard III',
								characterDifferentiator: '1',
								qualifier: 'foo',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Tom Canton',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Brakenbury',
								characterName: 'Sir Robert Brakenbury',
								characterDifferentiator: '1',
								qualifier: 'bar',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Richmond',
								characterName: 'Henry, Earl of Richmond',
								characterDifferentiator: '1',
								qualifier: 'baz',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Mark Hadfield',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Ratcliffe',
								characterName: 'Sir Richard Ratcliffe',
								characterDifferentiator: '1',
								qualifier: 'qux',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Lord Mayor',
								characterName: 'Lord Mayor of London',
								characterDifferentiator: '1',
								qualifier: 'quux',
								isAlternate: true,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Josh Collins',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Rupert Goold',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Fight Directors',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'RC-Annie',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Hildegard Bechtler',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Chloe Lamford',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Andrew Bruce',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Nick Lidster',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Andrew Bruce',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Anna Anderson',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Deputy Stage Managers Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Cheryl Firth',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Tom Leggat',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Design Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Colin Falconer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Alex Lowde',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Design Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Colin Falconer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: 'https://www.ft.com/content/d5cdf386-347a-11e6-bda0-04585c31b153',
						date: '2016-06-18',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'Financial Times',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Sarah Hemming',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.theguardian.com/stage/2016/jun/16/richard-iii-review-ralph-fiennes-almeida-theatre',
						date: '2016-06-19',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'The Guardian',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Michael Billington',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: 'https://www.telegraph.co.uk/theatre/what-to-see/richard-iii-almeida-review-getting-up-close-and-personal-with-ra',
						date: '2016-06-17',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: 'The Telegraph',
							differentiator: '1',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: 'Dominic Cavendish',
							differentiator: '1',
							errors: {}
						}
					},
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(7);

		});

		it('shows production (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				subtitle: 'The Last King of the Plantagenets',
				startDate: '2016-06-07',
				pressDate: '2016-06-16',
				endDate: '2016-08-06',
				material: {
					model: 'MATERIAL',
					uuid: THE_TRAGEDY_OF_KING_RICHARD_III_MATERIAL_UUID,
					name: 'The Tragedy of King Richard III',
					format: null,
					year: null,
					surMaterial: null,
					writingCredits: []
				},
				venue: {
					model: 'VENUE',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: 'Almeida Theatre',
					surVenue: null
				},
				season: {
					model: 'SEASON',
					uuid: SHAKESPEAREAN_HISTORY_SEASON_UUID,
					name: 'Shakespearean History Season'
				},
				festival: {
					model: 'FESTIVAL',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: 'Globe to Globe',
					festivalSeries: null
				},
				surProduction: null,
				subProductions: [
					{
						model: 'PRODUCTION',
						uuid: RICHARD_III_SUB_PRODUCTION_1_PRODUCTION_UUID,
						name: 'Richard III sub-production #1',
						subtitle: null,
						startDate: null,
						pressDate: null,
						endDate: null,
						material: null,
						venue: null,
						season: null,
						festival: null,
						subProductions: [],
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: [],
						reviews: []
					},
					{
						model: 'PRODUCTION',
						uuid: RICHARD_III_SUB_PRODUCTION_2_PRODUCTION_UUID,
						name: 'Richard III sub-production #2',
						subtitle: null,
						startDate: null,
						pressDate: null,
						endDate: null,
						material: null,
						venue: null,
						season: null,
						festival: null,
						subProductions: [],
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: [],
						reviews: []
					},
					{
						model: 'PRODUCTION',
						uuid: RICHARD_III_SUB_PRODUCTION_3_PRODUCTION_UUID,
						name: 'Richard III sub-production #3',
						subtitle: null,
						startDate: null,
						pressDate: null,
						endDate: null,
						material: null,
						venue: null,
						season: null,
						festival: null,
						subProductions: [],
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: [],
						reviews: []
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: DENISE_WOOD_PERSON_UUID,
								name: 'Denise Wood'
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						entities: [
							{
								model: 'COMPANY',
								uuid: TIATA_FAHODZI_COMPANY_UUID,
								name: 'Tiata Fahodzi',
								members: []
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: REBECCA_FRECKNALL_PERSON_UUID,
								name: 'Rebecca Frecknall'
							},
							{
								model: 'PERSON',
								uuid: SIMEON_BLAKE_HALL_PERSON_UUID,
								name: 'Simeon Blake-Hall'
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						entities: [
							{
								model: 'COMPANY',
								uuid: ALMEIDA_THEATRE_COMPANY_UUID,
								name: 'Almeida Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: RUPERT_GOOLD_PERSON_UUID,
										name: 'Rupert Goold'
									},
									{
										model: 'PERSON',
										uuid: ROBERT_ICKE_PERSON_UUID,
										name: 'Robert Icke'
									}
								]
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						entities: [
							{
								model: 'COMPANY',
								uuid: HEADLONG_THEATRE_COMPANY_UUID,
								name: 'Headlong Theatre',
								members: [
									{
										model: 'PERSON',
										uuid: RUPERT_GOOLD_PERSON_UUID,
										name: 'Rupert Goold'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						uuid: RALPH_FIENNES_PERSON_UUID,
						name: 'Ralph Fiennes',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Richard, Duke of Gloucester',
								qualifier: 'foo',
								isAlternate: false
							}
						]
					},
					{
						model: 'PERSON',
						uuid: TOM_CANTON_PERSON_UUID,
						name: 'Tom Canton',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Brakenbury',
								qualifier: 'bar',
								isAlternate: false
							},
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Richmond',
								qualifier: 'baz',
								isAlternate: false
							}
						]
					},
					{
						model: 'PERSON',
						uuid: MARK_HADFIELD_PERSON_UUID,
						name: 'Mark Hadfield',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Ratcliffe',
								qualifier: 'qux',
								isAlternate: false
							},
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Lord Mayor',
								qualifier: 'quux',
								isAlternate: true
							}
						]
					},
					{
						model: 'PERSON',
						uuid: JOSH_COLLINS_PERSON_UUID,
						name: 'Josh Collins',
						roles: [
							{
								name: 'Performer'
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						entities: [
							{
								model: 'PERSON',
								uuid: RUPERT_GOOLD_PERSON_UUID,
								name: 'Rupert Goold'
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Fight Directors',
						entities: [
							{
								model: 'COMPANY',
								uuid: RC_ANNIE_COMPANY_UUID,
								name: 'RC-Annie',
								members: []
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						entities: [
							{
								model: 'PERSON',
								uuid: HILDEGARD_BECHTLER_PERSON_UUID,
								name: 'Hildegard Bechtler'
							},
							{
								model: 'PERSON',
								uuid: CHLOE_LAMFORD_PERSON_UUID,
								name: 'Chloe Lamford'
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: AUTOGRAPH_COMPANY_UUID,
								name: 'Autograph',
								members: [
									{
										model: 'PERSON',
										uuid: ANDREW_BRUCE_PERSON_UUID,
										name: 'Andrew Bruce'
									},
									{
										model: 'PERSON',
										uuid: NICK_LIDSTER_PERSON_UUID,
										name: 'Nick Lidster'
									}
								]
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: AUTOGRAPH_COMPANY_UUID,
								name: 'Autograph',
								members: [
									{
										model: 'PERSON',
										uuid: ANDREW_BRUCE_PERSON_UUID,
										name: 'Andrew Bruce'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						entities: [
							{
								model: 'PERSON',
								uuid: ANNA_ANDERSON_PERSON_UUID,
								name: 'Anna Anderson'
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						entities: [
							{
								model: 'COMPANY',
								uuid: DEPUTY_STAGE_MANAGERS_LTD_COMPANY_UUID,
								name: 'Deputy Stage Managers Ltd',
								members: []
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						entities: [
							{
								model: 'PERSON',
								uuid: CHERYL_FIRTH_PERSON_UUID,
								name: 'Cheryl Firth'
							},
							{
								model: 'PERSON',
								uuid: TOM_LEGGAT_PERSON_UUID,
								name: 'Tom Leggat'
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						entities: [
							{
								model: 'COMPANY',
								uuid: DESIGN_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Design Assistants Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: COLIN_FALCONER_PERSON_UUID,
										name: 'Colin Falconer'
									},
									{
										model: 'PERSON',
										uuid: ALEX_LOWDE_PERSON_UUID,
										name: 'Alex Lowde'
									}
								]
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						entities: [
							{
								model: 'COMPANY',
								uuid: DESIGN_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Design Assistants Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: COLIN_FALCONER_PERSON_UUID,
										name: 'Colin Falconer'
									}
								]
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: 'https://www.telegraph.co.uk/theatre/what-to-see/richard-iii-almeida-review-getting-up-close-and-personal-with-ra',
						date: '2016-06-17',
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
						url: 'https://www.ft.com/content/d5cdf386-347a-11e6-bda0-04585c31b153',
						date: '2016-06-18',
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
						url: 'https://www.theguardian.com/stage/2016/jun/16/richard-iii-review-ralph-fiennes-almeida-theatre',
						date: '2016-06-19',
						publication: {
							model: 'COMPANY',
							uuid: THE_GUARDIAN_COMPANY_UUID,
							name: 'The Guardian'
						},
						critic: {
							model: 'PERSON',
							uuid: MICHAEL_BILLINGTON_PERSON_UUID,
							name: 'Michael Billington'
						}
					}
				],
				awards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(7);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'Richard III'
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				subtitle: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: '',
					differentiator: '',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: '',
						date: '',
						errors: {},
						publication: {
							model: 'COMPANY',
							name: '',
							differentiator: '',
							errors: {}
						},
						critic: {
							model: 'PERSON',
							name: '',
							differentiator: '',
							errors: {}
						}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(7);

		});

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(7);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				name: 'Richard III',
				subtitle: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				season: {
					model: 'SEASON',
					name: '',
					differentiator: '',
					errors: {}
				},
				festival: {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [],
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: [],
				reviews: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(6);

		});

	});

	describe('GET list endpoint', () => {

		const MACBETH_GIELGUD_PRODUCTION_UUID = 'MACBETH_PRODUCTION_UUID';
		const GIELGUD_THEATRE_VENUE_UUID = 'GIELGUD_THEATRE_VENUE_UUID';
		const HAMLET_NATIONAL_PRODUCTION_UUID = 'HAMLET_PRODUCTION_UUID';
		const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';
		const MACBETH_ALMEIDA_PRODUCTION_UUID = 'MACBETH_2_PRODUCTION_UUID';
		const ALMEIDA_THEATRE_VENUE_UUID = 'ALMEIDA_THEATRE_VENUE_UUID';
		const HAMLET_WYNDHAMS_PRODUCTION_UUID = 'HAMLET_2_PRODUCTION_UUID';
		const WYNDHAMS_THEATRE_VENUE_UUID = 'WYNDHAMS_THEATRE_VENUE_UUID';
		const HAMLET_ALMEIDA_PRODUCTION_UUID = 'HAMLET_3_PRODUCTION_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

			await purgeDatabase();

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Macbeth',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					venue: {
						name: 'Gielgud Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					venue: {
						name: 'National Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Macbeth',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					venue: {
						name: 'Almeida Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2009-05-29',
					pressDate: '2009-06-03',
					endDate: '2009-08-22',
					venue: {
						name: 'Wyndham\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2017-06-09',
					pressDate: '2017-06-15',
					endDate: '2017-09-02',
					venue: {
						name: 'Almeida Theatre'
					}
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all productions ordered by start date then name then venue name', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'PRODUCTION',
					uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2017-06-09',
					endDate: '2017-09-02',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: HAMLET_NATIONAL_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: MACBETH_ALMEIDA_PRODUCTION_UUID,
					name: 'Macbeth',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: MACBETH_GIELGUD_PRODUCTION_UUID,
					name: 'Macbeth',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: HAMLET_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2009-05-29',
					endDate: '2009-08-22',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
