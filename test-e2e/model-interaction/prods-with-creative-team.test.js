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
const LYTTELTON_THEATRE_VENUE_UUID = 'LYTTELTON_THEATRE_VENUE_UUID';
const COTTESLOE_THEATRE_VENUE_UUID = 'COTTESLOE_THEATRE_VENUE_UUID';
const JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID = 'JULIUS_CAESAR_PRODUCTION_UUID';
const BARBICAN_THEATRE_VENUE_UUID = 'BARBICAN_THEATRE_VENUE_UUID';
const DEBORAH_WARNER_PERSON_UUID = 'DEBORAH_WARNER_PERSON_UUID';
const AUTOGRAPH_COMPANY_UUID = 'AUTOGRAPH_COMPANY_UUID';
const MESMER_COMPANY_UUID = 'MESMER_COMPANY_UUID';
const DICK_STRAKER_PERSON_UUID = 'DICK_STRAKER_PERSON_UUID';
const IAN_WILLIAM_GALLOWAY_PERSON_UUID = 'IAN_WILLIAM_GALLOWAY_PERSON_UUID';
const JOHN_O_CONNELL_PERSON_UUID = 'JOHN_OCONNELL_PERSON_UUID';
const AKHILA_KRISHNAN_PERSON_UUID = 'AKHILA_KRISHNAN_PERSON_UUID';
const CINELUMA_COMPANY_UUID = 'CINELUMA_COMPANY_UUID';
const FIFTY_NINE_PRODUCTIONS_COMPANY_UUID = '59_PRODUCTIONS_COMPANY_UUID';
const LEO_WARNER_PERSON_UUID = 'LEO_WARNER_PERSON_UUID';
const MARK_GRIMMER_PERSON_UUID = 'MARK_GRIMMER_PERSON_UUID';
const LYSANDER_ASHTON_PERSON_UUID = 'LYSANDER_ASHTON_PERSON_UUID';
const NINA_DUNN_PERSON_UUID = 'NINA_DUNN_PERSON_UUID';
const MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID = 'MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID';
const DANIEL_DENTON_PERSON_UUID = 'DANIEL_DENTON_PERSON_UUID';
const ANNA_JAMESON_PERSON_UUID = 'ANNA_JAMESON_PERSON_UUID';
const HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID = 'HAPPY_DAYS_PRODUCTION_UUID';
const BARBORA_ŠENOLTOVÁ_PERSON_UUID = 'BARBORA_SENOLTOVA_PERSON_UUID';
const RICHARD_SLANEY_PERSON_UUID = 'RICHARD_SLANEY_PERSON_UUID';
const RICHARD_II_COTTESLOE_PRODUCTION_UUID = 'RICHARD_II_PRODUCTION_UUID';

let juliusCaesarBarbicanProduction;
let motherCourageAndHerChildrenOlivierProduction;
let happyDaysLytteltonProduction;
let richardIICottesloeProduction;
let deborahWarnerPerson;
let ninaDunnPerson;
let leoWarnerPerson;
let annaJamesonPerson;
let autographCompany;
let mesmerCompany;
let fiftyNineProductionsCompany;

const sandbox = createSandbox();

describe('Productions with creative team', () => {

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
					},
					{
						name: 'Lyttelton Theatre'
					},
					{
						name: 'Cottesloe Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Julius Caesar',
				startDate: '2005-04-14',
				pressDate: '2005-04-20',
				endDate: '2005-05-14',
				venue: {
					name: 'Barbican Theatre'
				},
				creativeCredits: [
					{
						name: 'Director',
						entities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					{
						name: 'Designer',
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph'
							}
						]
					},
					{
						name: 'Sound Designer',
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph'
							}
						]
					},
					{
						name: 'Video Designers',
						entities: [
							{
								model: 'COMPANY',
								name: 'Mesmer',
								members: [
									{
										name: 'Dick Straker'
									},
									{
										name: 'Ian William Galloway'
									},
									{
										name: 'John O\'Connell'
									}
								]
							},
							{
								name: 'Akhila Krishnan'
							},
							{
								model: 'COMPANY',
								name: 'Cineluma'
							},
							{
								model: 'COMPANY',
								name: '59 Productions',
								members: [
									{
										name: 'Leo Warner'
									},
									{
										name: 'Mark Grimmer'
									},
									{
										name: 'Lysander Ashton'
									}
								]
							},
							{
								name: 'Nina Dunn'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mother Courage and Her Children',
				startDate: '2009-09-16',
				pressDate: '2009-09-25',
				endDate: '2009-12-08',
				venue: {
					name: 'Olivier Theatre'
				},
				creativeCredits: [
					{
						name: 'Directed by',
						entities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					{
						name: 'Design by',
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								members: [
									{
										name: 'Leo Warner'
									}
								]
							}
						]
					},
					{
						name: 'Sound Design by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph'
							}
						]
					},
					{
						name: 'Video Design by',
						entities: [
							{
								name: 'Nina Dunn'
							},
							{
								model: 'COMPANY',
								name: 'Mesmer',
								members: [
									{
										name: 'Daniel Denton'
									},
									{
										name: 'Dick Straker'
									},
									{
										name: 'Ian William Galloway'
									}
								]
							},
							{
								model: 'COMPANY',
								name: '59 Productions',
								members: [
									{
										name: 'Anna Jameson'
									},
									{
										name: 'Leo Warner'
									},
									{
										name: 'Mark Grimmer'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Cineluma'
							},
							{
								name: 'Akhila Krishnan'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Happy Days',
				startDate: '2007-01-18',
				pressDate: '2007-01-25',
				endDate: '2007-03-01',
				venue: {
					name: 'Lyttelton Theatre'
				},
				creativeCredits: [
					{
						name: 'Direction',
						entities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					{
						name: 'Design',
						entities: [
							{
								name: 'Nina Dunn'
							}
						]
					},
					{
						name: 'Sound Design',
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph'
							}
						]
					},
					{
						name: 'Video Design',
						entities: [
							{
								model: 'COMPANY',
								name: 'Cineluma'
							},
							{
								name: 'Akhila Krishnan'
							},
							{
								model: 'COMPANY',
								name: 'Mesmer',
								members: [
									{
										name: 'Dick Straker'
									},
									{
										name: 'Barbora Šenoltová'
									},
									{
										name: 'Ian William Galloway'
									}
								]
							},
							{
								name: 'Nina Dunn'
							},
							{
								model: 'COMPANY',
								name: '59 Productions',
								members: [
									{
										name: 'Leo Warner'
									},
									{
										name: 'Richard Slaney'
									},
									{
										name: 'Mark Grimmer'
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
				name: 'Richard II',
				startDate: '1995-05-26',
				pressDate: '1995-06-02',
				endDate: '1996-02-17',
				venue: {
					name: 'Cottesloe Theatre'
				},
				creativeCredits: [
					{
						name: 'Video Design by',
						entities: [
							{
								name: 'Nina Dunn'
							},
							{
								model: 'COMPANY',
								name: 'Mesmer',
								members: [
									{
										name: 'Daniel Denton'
									},
									{
										name: 'Dick Straker'
									},
									{
										name: 'Ian William Galloway'
									}
								]
							},
							{
								model: 'COMPANY',
								name: '59 Productions',
								members: [
									{
										name: 'Lysander Ashton'
									},
									{
										name: 'Leo Warner'
									},
									{
										name: 'Mark Grimmer'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Cineluma'
							},
							{
								name: 'Akhila Krishnan'
							}
						]
					}
				]
			});

		juliusCaesarBarbicanProduction = await chai.request(app)
			.get(`/productions/${JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID}`);

		motherCourageAndHerChildrenOlivierProduction = await chai.request(app)
			.get(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID}`);

		happyDaysLytteltonProduction = await chai.request(app)
			.get(`/productions/${HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID}`);

		richardIICottesloeProduction = await chai.request(app)
			.get(`/productions/${RICHARD_II_COTTESLOE_PRODUCTION_UUID}`);

		deborahWarnerPerson = await chai.request(app)
			.get(`/people/${DEBORAH_WARNER_PERSON_UUID}`);

		ninaDunnPerson = await chai.request(app)
			.get(`/people/${NINA_DUNN_PERSON_UUID}`);

		leoWarnerPerson = await chai.request(app)
			.get(`/people/${LEO_WARNER_PERSON_UUID}`);

		annaJamesonPerson = await chai.request(app)
			.get(`/people/${ANNA_JAMESON_PERSON_UUID}`);

		autographCompany = await chai.request(app)
			.get(`/companies/${AUTOGRAPH_COMPANY_UUID}`);

		mesmerCompany = await chai.request(app)
			.get(`/companies/${MESMER_COMPANY_UUID}`);

		fiftyNineProductionsCompany = await chai.request(app)
			.get(`/companies/${FIFTY_NINE_PRODUCTIONS_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Julius Caesar at Barbican Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'CREATIVE_CREDIT',
					name: 'Director',
					entities: [
						{
							model: 'PERSON',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Designer',
					entities: [
						{
							model: 'COMPANY',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							members: []
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Sound Designer',
					entities: [
						{
							model: 'COMPANY',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							members: []
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Video Designers',
					entities: [
						{
							model: 'COMPANY',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							members: [
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								},
								{
									model: 'PERSON',
									uuid: JOHN_O_CONNELL_PERSON_UUID,
									name: 'John O\'Connell'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: AKHILA_KRISHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						},
						{
							model: 'COMPANY',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							members: []
						},
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
								},
								{
									model: 'PERSON',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						}
					]
				}
			];

			const { creativeCredits } = juliusCaesarBarbicanProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Mother Courage and Her Children at Olivier Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'CREATIVE_CREDIT',
					name: 'Directed by',
					entities: [
						{
							model: 'PERSON',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Design by',
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
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Sound Design by',
					entities: [
						{
							model: 'COMPANY',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							members: []
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Video Design by',
					entities: [
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
						{
							model: 'COMPANY',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							members: [
								{
									model: 'PERSON',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
							name: '59 Productions',
							members: [
								{
									model: 'PERSON',
									uuid: ANNA_JAMESON_PERSON_UUID,
									name: 'Anna Jameson'
								},
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
						},
						{
							model: 'COMPANY',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							members: []
						},
						{
							model: 'PERSON',
							uuid: AKHILA_KRISHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						}
					]
				}
			];

			const { creativeCredits } = motherCourageAndHerChildrenOlivierProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Happy Days at Lyttelton Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'CREATIVE_CREDIT',
					name: 'Direction',
					entities: [
						{
							model: 'PERSON',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Design',
					entities: [
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Sound Design',
					entities: [
						{
							model: 'COMPANY',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							members: []
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Video Design',
					entities: [
						{
							model: 'COMPANY',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							members: []
						},
						{
							model: 'PERSON',
							uuid: AKHILA_KRISHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						},
						{
							model: 'COMPANY',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							members: [
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
									name: 'Barbora Šenoltová'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
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
									uuid: RICHARD_SLANEY_PERSON_UUID,
									name: 'Richard Slaney'
								},
								{
									model: 'PERSON',
									uuid: MARK_GRIMMER_PERSON_UUID,
									name: 'Mark Grimmer'
								}
							]
						}
					]
				}
			];

			const { creativeCredits } = happyDaysLytteltonProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Richard II at Cottesloe Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'CREATIVE_CREDIT',
					name: 'Video Design by',
					entities: [
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
						{
							model: 'COMPANY',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							members: [
								{
									model: 'PERSON',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
							name: '59 Productions',
							members: [
								{
									model: 'PERSON',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								},
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
						},
						{
							model: 'COMPANY',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							members: []
						},
						{
							model: 'PERSON',
							uuid: AKHILA_KRISHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						}
					]
				}
			];

			const { creativeCredits } = richardIICottesloeProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Deborah Warner (person)', () => {

		it('includes productions for which they have a creative team credit', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Directed by',
							employerCompany: null,
							coEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Direction',
							employerCompany: null,
							coEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Director',
							employerCompany: null,
							coEntities: []
						}
					]
				}
			];

			const { creativeProductions } = deborahWarnerPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Nina Dunn (person)', () => {

		it('includes productions for which they have a creative team credit, included co-credited entities', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ANNA_JAMESON_PERSON_UUID,
											name: 'Anna Jameson'
										},
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
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Design',
							employerCompany: null,
							coEntities: []
						},
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
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
											uuid: RICHARD_SLANEY_PERSON_UUID,
											name: 'Richard Slaney'
										},
										{
											model: 'PERSON',
											uuid: MARK_GRIMMER_PERSON_UUID,
											name: 'Mark Grimmer'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'PERSON',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
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
										},
										{
											model: 'PERSON',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					venue: {
						model: 'VENUE',
						uuid: COTTESLOE_THEATRE_VENUE_UUID,
						name: 'Cottesloe Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									members: [
										{
											model: 'PERSON',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										},
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
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = ninaDunnPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Leo Warner (person)', () => {

		it('includes productions for which they have a creative team credit, included co-credited entities', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Design by',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: []
							},
							coEntities: []
						},
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
									{
										model: 'PERSON',
										uuid: ANNA_JAMESON_PERSON_UUID,
										name: 'Anna Jameson'
									},
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
									{
										model: 'PERSON',
										uuid: RICHARD_SLANEY_PERSON_UUID,
										name: 'Richard Slaney'
									},
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									},
									{
										model: 'PERSON',
										uuid: LYSANDER_ASHTON_PERSON_UUID,
										name: 'Lysander Ashton'
									}
								]
							},
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'PERSON',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					venue: {
						model: 'VENUE',
						uuid: COTTESLOE_THEATRE_VENUE_UUID,
						name: 'Cottesloe Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
									{
										model: 'PERSON',
										uuid: LYSANDER_ASHTON_PERSON_UUID,
										name: 'Lysander Ashton'
									},
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = leoWarnerPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Anna Jameson (person)', () => {

		it('includes productions for which they have a creative team credit, included co-credited entities', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
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
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = annaJamesonPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Autograph (company)', () => {

		it('includes productions for which they have a creative team credit', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Sound Design by',
							members: [],
							coEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Sound Design',
							members: [],
							coEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Designer',
							members: [],
							coEntities: []
						},
						{
							model: 'CREATIVE_CREDIT',
							name: 'Sound Designer',
							members: [],
							coEntities: []
						}
					]
				}
			];

			const { creativeProductions } = autographCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Mesmer (company)', () => {

		it('includes productions for which they have a creative team credit', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							members: [
								{
									model: 'PERSON',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ANNA_JAMESON_PERSON_UUID,
											name: 'Anna Jameson'
										},
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
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design',
							members: [
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
									name: 'Barbora Šenoltová'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
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
											uuid: RICHARD_SLANEY_PERSON_UUID,
											name: 'Richard Slaney'
										},
										{
											model: 'PERSON',
											uuid: MARK_GRIMMER_PERSON_UUID,
											name: 'Mark Grimmer'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Designers',
							members: [
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								},
								{
									model: 'PERSON',
									uuid: JOHN_O_CONNELL_PERSON_UUID,
									name: 'John O\'Connell'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
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
										},
										{
											model: 'PERSON',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					venue: {
						model: 'VENUE',
						uuid: COTTESLOE_THEATRE_VENUE_UUID,
						name: 'Cottesloe Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							members: [
								{
									model: 'PERSON',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									members: [
										{
											model: 'PERSON',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										},
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
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = mesmerCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('59 Productions (company)', () => {

		it('includes productions for which they have a creative team credit, included co-credited entities', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Design by',
							members: [
								{
									model: 'PERSON',
									uuid: LEO_WARNER_PERSON_UUID,
									name: 'Leo Warner'
								}
							],
							coEntities: []
						},
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							members: [
								{
									model: 'PERSON',
									uuid: ANNA_JAMESON_PERSON_UUID,
									name: 'Anna Jameson'
								},
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
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design',
							members: [
								{
									model: 'PERSON',
									uuid: LEO_WARNER_PERSON_UUID,
									name: 'Leo Warner'
								},
								{
									model: 'PERSON',
									uuid: RICHARD_SLANEY_PERSON_UUID,
									name: 'Richard Slaney'
								},
								{
									model: 'PERSON',
									uuid: MARK_GRIMMER_PERSON_UUID,
									name: 'Mark Grimmer'
								}
							],
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Designers',
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
								},
								{
									model: 'PERSON',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								}
							],
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'PERSON',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					venue: {
						model: 'VENUE',
						uuid: COTTESLOE_THEATRE_VENUE_UUID,
						name: 'Cottesloe Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							members: [
								{
									model: 'PERSON',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								},
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
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KRISHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = fiftyNineProductionsCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

});
