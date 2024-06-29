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
const DORFMAN_THEATRE_VENUE_UUID = 'DORFMAN_THEATRE_VENUE_UUID';
const GARPLY_LYTTELTON_PRODUCTION_UUID = 'GARPLY_PRODUCTION_UUID';
const GARPLY_WYNDHAMS_PRODUCTION_UUID = 'GARPLY_2_PRODUCTION_UUID';
const WYNDHAMS_THEATRE_VENUE_UUID = 'WYNDHAMS_THEATRE_VENUE_UUID';
const PLUGH_PLAYHOUSE_PRODUCTION_UUID = 'PLUGH_PRODUCTION_UUID';
const PLAYHOUSE_THEATRE_VENUE_UUID = 'PLAYHOUSE_THEATRE_VENUE_UUID';
const FRED_OLD_VIC_PRODUCTION_UUID = 'FRED_PRODUCTION_UUID';
const OLD_VIC_THEATRE_VENUE_UUID = 'OLD_VIC_THEATRE_VENUE_UUID';
const WALDO_DORFMAN_PRODUCTION_UUID = 'WALDO_PRODUCTION_UUID';
const WALDO_NOËL_COWARD_PRODUCTION_UUID = 'WALDO_2_PRODUCTION_UUID';
const NOËL_COWARD_THEATRE_VENUE_UUID = 'NOEL_COWARD_THEATRE_VENUE_UUID';
const PIYO_HAROLD_PINTER_PRODUCTION_UUID = 'PIYO_PRODUCTION_UUID';
const HAROLD_PINTER_THEATRE_VENUE_UUID = 'HAROLD_PINTER_THEATRE_VENUE_UUID';
const XYZZY_DORFMAN_PRODUCTION_UUID = 'XYZZY_PRODUCTION_UUID';
const XYZZY_PLAYHOUSE_PRODUCTION_UUID = 'XYZZY_2_PRODUCTION_UUID';
const WIBBLE_OLD_VIC_PRODUCTION_UUID = 'WIBBLE_PRODUCTION_UUID';
const WIBBLE_WYNDHAMS_PRODUCTION_UUID = 'WIBBLE_2_PRODUCTION_UUID';
const HOGE_ALMEIDA_PRODUCTION_UUID = 'HOGE_PRODUCTION_UUID';
const ALMEIDA_THEATRE_VENUE_UUID = 'ALMEIDA_THEATRE_VENUE_UUID';
const THUD_DUKE_OF_YORKS_PRODUCTION_UUID = 'THUD_PRODUCTION_UUID';
const DUKE_OF_YORKS_THEATRE_VENUE_UUID = 'DUKE_OF_YORKS_THEATRE_VENUE_UUID';
const TOTO_NOËL_COWARD_PRODUCTION_UUID = 'TOTO_PRODUCTION_UUID';
const FUGA_OLIVIER_PRODUCTION_UUID = 'FUGA_PRODUCTION_UUID';
const TUTU_PLAYHOUSE_PRODUCTION_UUID = 'TUTU_PRODUCTION_UUID';
const GRAULT_ALMEIDA_PRODUCTION_UUID = 'GRAULT_PRODUCTION_UUID';
const GARPLY_MATERIAL_UUID = 'GARPLY_MATERIAL_UUID';
const PLUGH_MATERIAL_UUID = 'PLUGH_MATERIAL_UUID';
const FRED_MATERIAL_UUID = 'FRED_MATERIAL_UUID';
const WALDO_MATERIAL_UUID = 'WALDO_MATERIAL_UUID';
const PIYO_MATERIAL_UUID = 'PIYO_MATERIAL_UUID';
const XYZZY_MATERIAL_UUID = 'XYZZY_MATERIAL_UUID';
const WIBBLE_MATERIAL_UUID = 'WIBBLE_MATERIAL_UUID';
const HOGE_MATERIAL_UUID = 'HOGE_MATERIAL_UUID';
const THUD_MATERIAL_UUID = 'THUD_MATERIAL_UUID';
const TOTO_MATERIAL_UUID = 'TOTO_MATERIAL_UUID';
const FUGA_MATERIAL_UUID = 'FUGA_MATERIAL_UUID';
const TUTU_MATERIAL_UUID = 'TUTU_MATERIAL_UUID';
const GRAULT_MATERIAL_UUID = 'GRAULT_MATERIAL_UUID';
const LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID = '2020_2_AWARD_CEREMONY_UUID';
const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'LAURENCE_OLIVIER_AWARDS_AWARD_UUID';
const JOHN_DOE_PERSON_UUID = 'JOHN_DOE_PERSON_UUID';
const CURTAIN_UP_LTD_COMPANY_UUID = 'CURTAIN_UP_LTD_COMPANY_UUID';
const JANE_ROE_PERSON_UUID = 'JANE_ROE_PERSON_UUID';
const STAGECRAFT_LTD_COMPANY_UUID = 'STAGECRAFT_LTD_COMPANY_UUID';
const FERDINAND_FOO_PERSON_UUID = 'FERDINAND_FOO_PERSON_UUID';
const BEATRICE_BAR_PERSON_UUID = 'BEATRICE_BAR_PERSON_UUID';
const BRANDON_BAZ_PERSON_UUID = 'BRANDON_BAZ_PERSON_UUID';
const THEATRICALS_LTD_COMPANY_UUID = 'THEATRICALS_LTD_COMPANY_UUID';
const QUINCY_QUX_PERSON_UUID = 'QUINCY_QUX_PERSON_UUID';
const CLARA_QUUX_PERSON_UUID = 'CLARA_QUUX_PERSON_UUID';
const CHRISTIAN_QUUZ_PERSON_UUID = 'CHRISTIAN_QUUZ_PERSON_UUID';
const CONOR_CORGE_PERSON_UUID = 'CONOR_CORGE_PERSON_UUID';
const BACKSTAGE_LTD_COMPANY_UUID = 'BACKSTAGE_LTD_COMPANY_UUID';
const LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID = '2018_2_AWARD_CEREMONY_UUID';
const EVENING_STANDARD_THEATRE_AWARDS_2018_AWARD_CEREMONY_UUID = '2018_4_AWARD_CEREMONY_UUID';
const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID';
const EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID = '2019_2_AWARD_CEREMONY_UUID';
const EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID = '2017_2_AWARD_CEREMONY_UUID';
const CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID = '2019_4_AWARD_CEREMONY_UUID';
const CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID = 'CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID';

let laurenceOlivierAwards2020AwardCeremony;
let eveningStandardTheatreAwards2017AwardCeremony;
let laurenceOlivierAwardsAward;
let eveningStandardTheatreAwardsAward;
let johnDoePerson;
let curtainUpLtdCompany;
let conorCorgePerson;
let stagecraftLtdCompany;
let quincyQuxPerson;
let garplyLytteltonProduction;
let xyzzyPlayhouseProduction;
let garplyMaterial;
let xyzzyMaterial;

const sandbox = createSandbox();

describe('Award ceremonies', () => {

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
						name: 'Dorfman Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Garply',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Lyttelton Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Garply',
				startDate: '2019-07-01',
				endDate: '2019-07-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Plugh',
				startDate: '2019-08-01',
				endDate: '2019-08-31',
				venue: {
					name: 'Playhouse Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fred',
				startDate: '2019-09-01',
				endDate: '2019-09-30',
				venue: {
					name: 'Old Vic Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Waldo',
				startDate: '2019-10-01',
				endDate: '2019-10-31',
				venue: {
					name: 'Dorfman Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Waldo',
				startDate: '2019-11-01',
				endDate: '2019-11-30',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Piyo',
				startDate: '2017-05-01',
				endDate: '2017-05-31',
				venue: {
					name: 'Harold Pinter Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Xyzzy',
				startDate: '2017-06-01',
				endDate: '2017-06-30',
				venue: {
					name: 'Dorfman Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Xyzzy',
				startDate: '2017-07-01',
				endDate: '2017-07-31',
				venue: {
					name: 'Playhouse Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Wibble',
				startDate: '2017-08-01',
				endDate: '2017-08-31',
				venue: {
					name: 'Old Vic Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Wibble',
				startDate: '2017-09-01',
				endDate: '2017-09-30',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hoge',
				startDate: '2017-10-01',
				endDate: '2017-10-31',
				venue: {
					name: 'Almeida Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Thud',
				startDate: '2017-11-01',
				endDate: '2017-11-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Toto',
				startDate: '2018-03-01',
				endDate: '2018-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fuga',
				startDate: '2018-04-01',
				endDate: '2018-04-30',
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Tutu',
				startDate: '2018-05-01',
				endDate: '2018-05-31',
				venue: {
					name: 'Playhouse Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Grault',
				startDate: '2019-12-01',
				endDate: '2019-12-31',
				venue: {
					name: 'Almeida Theatre'
				}
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Garply',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Plugh',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Fred',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Waldo',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Piyo',
				format: 'play',
				year: '2017'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Xyzzy',
				format: 'play',
				year: '2017'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Wibble',
				format: 'play',
				year: '2017'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hoge',
				format: 'play',
				year: '2017'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Thud',
				format: 'play',
				year: '2017'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Toto',
				format: 'play',
				year: '2018'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Fuga',
				format: 'play',
				year: '2018'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Tutu',
				format: 'play',
				year: '2018'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Grault',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2020',
				award: {
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								isWinner: true,
								entities: [
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Garply'
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									},
									{
										name: 'Jane Roe'
									},
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Plugh'
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Brandon Baz'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Clara Quux'
											},
											{
												name: 'Christian Quuz'
											}
										]
									},
									{
										name: 'Conor Corge'
									}
								],
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Garply'
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: FRED_OLD_VIC_PRODUCTION_UUID
									},
									{
										uuid: WALDO_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Fred'
									},
									{
										name: 'Waldo'
									}
								]
							}
						]
					},
					{
						name: 'Best Random Role',
						nominations: [
							{
								entities: [
									{
										name: 'Jane Roe'
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'John Doe'
									},
									{
										name: 'Jane Roe'
									},
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Clara Quux'
											},
											{
												name: 'Christian Quuz'
											},
											{
												name: 'Quincy Qux'
											}
										]
									},
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Brandon Baz'
											},
											{
												name: 'Ferdinand Foo'
											}
										]
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									}
								]
							}
						]
					},
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								productions: [
									{
										uuid: FRED_OLD_VIC_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							}
						]
					},
					{
						name: 'Most Remarkable Play',
						nominations: [
							{
								materials: [
									{
										name: 'Fred'
									}
								]
							},
							{
								materials: [
									{
										name: 'Garply'
									},
									{
										name: 'Waldo'
									}
								]
							},
							{
								isWinner: true,
								materials: [
									{
										name: 'Plugh'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									}
								],
								productions: [
									{
										uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Piyo'
									}
								]
							},
							{
								entities: [
									{
										name: 'Jane Roe'
									},
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									},
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: XYZZY_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Xyzzy'
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Brandon Baz'
											},
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Beatrice Bar'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Christian Quuz'
											},
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Clara Quux'
											}
										]
									}
								],
								productions: [
									{
										uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID
									},
									{
										uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Wibble'
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: HOGE_ALMEIDA_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Hoge'
									}
								]
							}
						]
					},
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								productions: [
									{
										uuid: THUD_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID
									},
									{
										uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: XYZZY_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							}
						]
					},
					{
						name: 'Most Remarkable Play',
						nominations: [
							{
								isWinner: true,
								materials: [
									{
										name: 'Hoge'
									}
								]
							},
							{
								materials: [
									{
										name: 'Thud'
									},
									{
										name: 'Xyzzy'
									}
								]
							},
							{
								materials: [
									{
										name: 'Wibble'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								customType: 'Longlisted',
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									},
									{
										name: 'John Doe'
									},
									{
										name: 'Jane Roe'
									}
								],
								productions: [
									{
										uuid: TOTO_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Toto'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									}
								],
								productions: [
									{
										uuid: FUGA_OLIVIER_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Fuga'
									}
								]
							},
							{
								customType: 'Shortlisted',
								entities: [
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Brandon Baz'
											},
											{
												name: 'Beatrice Bar'
											}
										]
									},
									{
										name: 'Conor Corge'
									}
								],
								productions: [
									{
										uuid: TUTU_PLAYHOUSE_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Tutu'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2019',
				award: {
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								isWinner: true,
								customType: 'First Place',
								entities: [
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Grault'
									}
								]
							},
							{
								customType: 'Shortlisted',
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Christian Quuz'
											},
											{
												name: 'Clara Quux'
											}
										]
									}
								],
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Garply'
									}
								]
							}
						]
					},
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								isWinner: true,
								customType: 'First Place',
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								customType: 'Longlisted',
								productions: [
									{
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
									}
								]
							},
							{
								customType: 'Shortlisted',
								productions: [
									{
										uuid: WALDO_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID
									}
								]
							}
						]
					},
					{
						name: 'Most Remarkable Play',
						nominations: [
							{
								customType: 'Shortlisted',
								materials: [
									{
										name: 'Garply'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								materials: [
									{
										name: 'Grault'
									}
								]
							},
							{
								customType: 'Longlisted',
								materials: [
									{
										name: 'Waldo'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2017',
				award: {
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						name: 'Best Random Role',
						nominations: [
							{
								customType: 'Longlisted',
								entities: [
									{
										name: 'Jane Roe'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								entities: [
									{
										name: 'John Doe'
									},
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									},
									{
										name: 'Jane Roe'
									}
								]
							},
							{
								customType: 'Shortlisted',
								entities: [
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Clara Quux'
											},
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Christian Quuz'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Brandon Baz'
											}
										]
									},
									{
										name: 'Conor Corge'
									}
								]
							},
							{
								customType: 'Longlisted',
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								]
							}
						]
					},
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								customType: 'Shortlisted',
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Wibble'
									}
								]
							},
							{
								customType: 'Longlisted',
								entities: [
									{
										name: 'Jane Roe'
									},
									{
										name: 'John Doe'
									},
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: XYZZY_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID
									},
									{
										uuid: HOGE_ALMEIDA_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Xyzzy'
									},
									{
										name: 'Hoge'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Christian Quuz'
											},
											{
												name: 'Clara Quux'
											},
											{
												name: 'Quincy Qux'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Brandon Baz'
											},
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Ferdinand Foo'
											}
										]
									}
								],
								productions: [
									{
										uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Wibble'
									}
								]
							},
							{
								customType: 'Shortlisted',
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									}
								],
								productions: [
									{
										uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Piyo'
									}
								]
							}
						]
					},
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								customType: 'Shortlisted',
								productions: [
									{
										uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								productions: [
									{
										uuid: THUD_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								]
							},
							{
								customType: 'Longlisted',
								productions: [
									{
										uuid: XYZZY_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							}
						]
					},
					{
						name: 'Most Remarkable Play',
						nominations: [
							{
								customType: 'Shortlisted',
								materials: [
									{
										name: 'Thud'
									}
								]
							},
							{
								customType: 'Longlisted',
								materials: [
									{
										name: 'Wibble'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								materials: [
									{
										name: 'Xyzzy'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2019',
				award: {
					name: 'Critics\' Circle Theatre Awards'
				},
				categories: [
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								customType: 'Special Commendation',
								entities: [
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Grault'
									}
								]
							},
							{
								customType: 'Finalist',
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									},
									{
										name: 'Jane Roe'
									},
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID
									},
									{
										uuid: FRED_OLD_VIC_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Plugh'
									},
									{
										name: 'Fred'
									}
								]
							},
							{
								customType: 'Finalist',
								entities: [
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Brandon Baz'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Clara Quux'
											},
											{
												name: 'Christian Quuz'
											}
										]
									},
									{
										name: 'Conor Corge'
									}
								],
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Garply'
									}
								]
							},
							{
								isWinner: true,
								customType: 'Prize Recipient',
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: WALDO_DORFMAN_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Waldo'
									}
								]
							}
						]
					},
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								isWinner: true,
								customType: 'Prize Recipient',
								productions: [
									{
										uuid: FRED_OLD_VIC_PRODUCTION_UUID
									}
								]
							},
							{
								customType: 'Finalist',
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								customType: 'Special Commendation',
								productions: [
									{
										uuid: WALDO_DORFMAN_PRODUCTION_UUID
									}
								]
							}
						]
					},
					{
						name: 'Most Remarkable Play',
						nominations: [
							{
								customType: 'Special Commendation',
								materials: [
									{
										name: 'Fred'
									}
								]
							},
							{
								isWinner: true,
								customType: 'Prize Recipient',
								materials: [
									{
										name: 'Garply'
									},
									{
										name: 'Plugh'
									}
								]
							},
							{
								customType: 'Finalist',
								materials: [
									{
										name: 'Waldo'
									}
								]
							}
						]
					}
				]
			});

		laurenceOlivierAwards2020AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID}`);

		eveningStandardTheatreAwards2017AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID}`);

		laurenceOlivierAwardsAward = await chai.request(app)
			.get(`/awards/${LAURENCE_OLIVIER_AWARDS_AWARD_UUID}`);

		eveningStandardTheatreAwardsAward = await chai.request(app)
			.get(`/awards/${EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID}`);

		johnDoePerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_PERSON_UUID}`);

		curtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${CURTAIN_UP_LTD_COMPANY_UUID}`);

		conorCorgePerson = await chai.request(app)
			.get(`/people/${CONOR_CORGE_PERSON_UUID}`);

		stagecraftLtdCompany = await chai.request(app)
			.get(`/companies/${STAGECRAFT_LTD_COMPANY_UUID}`);

		quincyQuxPerson = await chai.request(app)
			.get(`/people/${QUINCY_QUX_PERSON_UUID}`);

		garplyLytteltonProduction = await chai.request(app)
			.get(`/productions/${GARPLY_LYTTELTON_PRODUCTION_UUID}`);

		xyzzyPlayhouseProduction = await chai.request(app)
			.get(`/productions/${XYZZY_PLAYHOUSE_PRODUCTION_UUID}`);

		garplyMaterial = await chai.request(app)
			.get(`/materials/${GARPLY_MATERIAL_UUID}`);

		xyzzyMaterial = await chai.request(app)
			.get(`/materials/${XYZZY_MATERIAL_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Laurence Olivier Awards 2020 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Miscellaneous Role',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'Winner',
							entities: [
								{
									model: 'PERSON',
									uuid: JOHN_DOE_PERSON_UUID,
									name: 'John Doe'
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
									name: 'Garply',
									startDate: '2019-06-01',
									endDate: '2019-06-30',
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
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
									name: 'Garply',
									startDate: '2019-07-01',
									endDate: '2019-07-31',
									venue: {
										model: 'VENUE',
										uuid: WYNDHAMS_THEATRE_VENUE_UUID,
										name: 'Wyndham\'s Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: GARPLY_MATERIAL_UUID,
									name: 'Garply',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [
								{
									model: 'COMPANY',
									uuid: CURTAIN_UP_LTD_COMPANY_UUID,
									name: 'Curtain Up Ltd',
									members: []
								},
								{
									model: 'PERSON',
									uuid: JANE_ROE_PERSON_UUID,
									name: 'Jane Roe'
								},
								{
									model: 'PERSON',
									uuid: JOHN_DOE_PERSON_UUID,
									name: 'John Doe'
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
									name: 'Plugh',
									startDate: '2019-08-01',
									endDate: '2019-08-31',
									venue: {
										model: 'VENUE',
										uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
										name: 'Playhouse Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: PLUGH_MATERIAL_UUID,
									name: 'Plugh',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										},
										{
											model: 'PERSON',
											uuid: BEATRICE_BAR_PERSON_UUID,
											name: 'Beatrice Bar'
										},
										{
											model: 'PERSON',
											uuid: BRANDON_BAZ_PERSON_UUID,
											name: 'Brandon Baz'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICALS_LTD_COMPANY_UUID,
									name: 'Theatricals Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: QUINCY_QUX_PERSON_UUID,
											name: 'Quincy Qux'
										},
										{
											model: 'PERSON',
											uuid: CLARA_QUUX_PERSON_UUID,
											name: 'Clara Quux'
										},
										{
											model: 'PERSON',
											uuid: CHRISTIAN_QUUZ_PERSON_UUID,
											name: 'Christian Quuz'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
									name: 'Garply',
									startDate: '2019-06-01',
									endDate: '2019-06-30',
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
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
									name: 'Garply',
									startDate: '2019-07-01',
									endDate: '2019-07-31',
									venue: {
										model: 'VENUE',
										uuid: WYNDHAMS_THEATRE_VENUE_UUID,
										name: 'Wyndham\'s Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: GARPLY_MATERIAL_UUID,
									name: 'Garply',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [
								{
									model: 'COMPANY',
									uuid: BACKSTAGE_LTD_COMPANY_UUID,
									name: 'Backstage Ltd',
									members: []
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: FRED_OLD_VIC_PRODUCTION_UUID,
									name: 'Fred',
									startDate: '2019-09-01',
									endDate: '2019-09-30',
									venue: {
										model: 'VENUE',
										uuid: OLD_VIC_THEATRE_VENUE_UUID,
										name: 'Old Vic Theatre',
										surVenue: null
									},
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: WALDO_DORFMAN_PRODUCTION_UUID,
									name: 'Waldo',
									startDate: '2019-10-01',
									endDate: '2019-10-31',
									venue: {
										model: 'VENUE',
										uuid: DORFMAN_THEATRE_VENUE_UUID,
										name: 'Dorfman Theatre',
										surVenue: {
											model: 'VENUE',
											uuid: NATIONAL_THEATRE_VENUE_UUID,
											name: 'National Theatre'
										}
									},
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Waldo',
									startDate: '2019-11-01',
									endDate: '2019-11-30',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: FRED_MATERIAL_UUID,
									name: 'Fred',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: WALDO_MATERIAL_UUID,
									name: 'Waldo',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Random Role',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [
								{
									model: 'PERSON',
									uuid: JANE_ROE_PERSON_UUID,
									name: 'Jane Roe'
								}
							],
							productions: [],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'Winner',
							entities: [
								{
									model: 'PERSON',
									uuid: JOHN_DOE_PERSON_UUID,
									name: 'John Doe'
								},
								{
									model: 'PERSON',
									uuid: JANE_ROE_PERSON_UUID,
									name: 'Jane Roe'
								},
								{
									model: 'COMPANY',
									uuid: BACKSTAGE_LTD_COMPANY_UUID,
									name: 'Backstage Ltd',
									members: []
								}
							],
							productions: [],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [
								{
									model: 'COMPANY',
									uuid: THEATRICALS_LTD_COMPANY_UUID,
									name: 'Theatricals Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CLARA_QUUX_PERSON_UUID,
											name: 'Clara Quux'
										},
										{
											model: 'PERSON',
											uuid: CHRISTIAN_QUUZ_PERSON_UUID,
											name: 'Christian Quuz'
										},
										{
											model: 'PERSON',
											uuid: QUINCY_QUX_PERSON_UUID,
											name: 'Quincy Qux'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: BEATRICE_BAR_PERSON_UUID,
											name: 'Beatrice Bar'
										},
										{
											model: 'PERSON',
											uuid: BRANDON_BAZ_PERSON_UUID,
											name: 'Brandon Baz'
										},
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										}
									]
								}
							],
							productions: [],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [
								{
									model: 'COMPANY',
									uuid: CURTAIN_UP_LTD_COMPANY_UUID,
									name: 'Curtain Up Ltd',
									members: []
								}
							],
							productions: [],
							materials: []
						}
					]
				},
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Noteworthy Production',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: FRED_OLD_VIC_PRODUCTION_UUID,
									name: 'Fred',
									startDate: '2019-09-01',
									endDate: '2019-09-30',
									venue: {
										model: 'VENUE',
										uuid: OLD_VIC_THEATRE_VENUE_UUID,
										name: 'Old Vic Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'Winner',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
									name: 'Garply',
									startDate: '2019-06-01',
									endDate: '2019-06-30',
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
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
									name: 'Garply',
									startDate: '2019-07-01',
									endDate: '2019-07-31',
									venue: {
										model: 'VENUE',
										uuid: WYNDHAMS_THEATRE_VENUE_UUID,
										name: 'Wyndham\'s Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
									name: 'Plugh',
									startDate: '2019-08-01',
									endDate: '2019-08-31',
									venue: {
										model: 'VENUE',
										uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
										name: 'Playhouse Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: []
						}
					]
				},
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Most Remarkable Play',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [],
							materials: [
								{
									model: 'MATERIAL',
									uuid: FRED_MATERIAL_UUID,
									name: 'Fred',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [],
							materials: [
								{
									model: 'MATERIAL',
									uuid: GARPLY_MATERIAL_UUID,
									name: 'Garply',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: WALDO_MATERIAL_UUID,
									name: 'Waldo',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'Winner',
							entities: [],
							productions: [],
							materials: [
								{
									model: 'MATERIAL',
									uuid: PLUGH_MATERIAL_UUID,
									name: 'Plugh',
									format: 'play',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						}
					]
				}
			];

			const { categories } = laurenceOlivierAwards2020AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Evening Standard Theatre Awards 2017 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Random Role',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Longlisted',
							entities: [
								{
									model: 'PERSON',
									uuid: JANE_ROE_PERSON_UUID,
									name: 'Jane Roe'
								}
							],
							productions: [],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'First Place',
							entities: [
								{
									model: 'PERSON',
									uuid: JOHN_DOE_PERSON_UUID,
									name: 'John Doe'
								},
								{
									model: 'COMPANY',
									uuid: CURTAIN_UP_LTD_COMPANY_UUID,
									name: 'Curtain Up Ltd',
									members: []
								},
								{
									model: 'PERSON',
									uuid: JANE_ROE_PERSON_UUID,
									name: 'Jane Roe'
								}
							],
							productions: [],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Shortlisted',
							entities: [
								{
									model: 'COMPANY',
									uuid: THEATRICALS_LTD_COMPANY_UUID,
									name: 'Theatricals Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CLARA_QUUX_PERSON_UUID,
											name: 'Clara Quux'
										},
										{
											model: 'PERSON',
											uuid: QUINCY_QUX_PERSON_UUID,
											name: 'Quincy Qux'
										},
										{
											model: 'PERSON',
											uuid: CHRISTIAN_QUUZ_PERSON_UUID,
											name: 'Christian Quuz'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: BEATRICE_BAR_PERSON_UUID,
											name: 'Beatrice Bar'
										},
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										},
										{
											model: 'PERSON',
											uuid: BRANDON_BAZ_PERSON_UUID,
											name: 'Brandon Baz'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							],
							productions: [],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Longlisted',
							entities: [
								{
									model: 'COMPANY',
									uuid: BACKSTAGE_LTD_COMPANY_UUID,
									name: 'Backstage Ltd',
									members: []
								}
							],
							productions: [],
							materials: []
						}
					]
				},
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Miscellaneous Role',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Shortlisted',
							entities: [
								{
									model: 'COMPANY',
									uuid: BACKSTAGE_LTD_COMPANY_UUID,
									name: 'Backstage Ltd',
									members: []
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2017-08-01',
									endDate: '2017-08-31',
									venue: {
										model: 'VENUE',
										uuid: OLD_VIC_THEATRE_VENUE_UUID,
										name: 'Old Vic Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: WIBBLE_MATERIAL_UUID,
									name: 'Wibble',
									format: 'play',
									year: 2017,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Longlisted',
							entities: [
								{
									model: 'PERSON',
									uuid: JANE_ROE_PERSON_UUID,
									name: 'Jane Roe'
								},
								{
									model: 'PERSON',
									uuid: JOHN_DOE_PERSON_UUID,
									name: 'John Doe'
								},
								{
									model: 'COMPANY',
									uuid: BACKSTAGE_LTD_COMPANY_UUID,
									name: 'Backstage Ltd',
									members: []
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
									name: 'Xyzzy',
									startDate: '2017-06-01',
									endDate: '2017-06-30',
									venue: {
										model: 'VENUE',
										uuid: DORFMAN_THEATRE_VENUE_UUID,
										name: 'Dorfman Theatre',
										surVenue: {
											model: 'VENUE',
											uuid: NATIONAL_THEATRE_VENUE_UUID,
											name: 'National Theatre'
										}
									},
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
									name: 'Xyzzy',
									startDate: '2017-07-01',
									endDate: '2017-07-31',
									venue: {
										model: 'VENUE',
										uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
										name: 'Playhouse Theatre',
										surVenue: null
									},
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: HOGE_ALMEIDA_PRODUCTION_UUID,
									name: 'Hoge',
									startDate: '2017-10-01',
									endDate: '2017-10-31',
									venue: {
										model: 'VENUE',
										uuid: ALMEIDA_THEATRE_VENUE_UUID,
										name: 'Almeida Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: XYZZY_MATERIAL_UUID,
									name: 'Xyzzy',
									format: 'play',
									year: 2017,
									surMaterial: null,
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: HOGE_MATERIAL_UUID,
									name: 'Hoge',
									format: 'play',
									year: 2017,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'First Place',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: THEATRICALS_LTD_COMPANY_UUID,
									name: 'Theatricals Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHRISTIAN_QUUZ_PERSON_UUID,
											name: 'Christian Quuz'
										},
										{
											model: 'PERSON',
											uuid: CLARA_QUUX_PERSON_UUID,
											name: 'Clara Quux'
										},
										{
											model: 'PERSON',
											uuid: QUINCY_QUX_PERSON_UUID,
											name: 'Quincy Qux'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: BRANDON_BAZ_PERSON_UUID,
											name: 'Brandon Baz'
										},
										{
											model: 'PERSON',
											uuid: BEATRICE_BAR_PERSON_UUID,
											name: 'Beatrice Bar'
										},
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										}
									]
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2017-08-01',
									endDate: '2017-08-31',
									venue: {
										model: 'VENUE',
										uuid: OLD_VIC_THEATRE_VENUE_UUID,
										name: 'Old Vic Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: WIBBLE_MATERIAL_UUID,
									name: 'Wibble',
									format: 'play',
									year: 2017,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Shortlisted',
							entities: [
								{
									model: 'COMPANY',
									uuid: CURTAIN_UP_LTD_COMPANY_UUID,
									name: 'Curtain Up Ltd',
									members: []
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID,
									name: 'Piyo',
									startDate: '2017-05-01',
									endDate: '2017-05-31',
									venue: {
										model: 'VENUE',
										uuid: HAROLD_PINTER_THEATRE_VENUE_UUID,
										name: 'Harold Pinter Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: PIYO_MATERIAL_UUID,
									name: 'Piyo',
									format: 'play',
									year: 2017,
									surMaterial: null,
									writingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Noteworthy Production',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Shortlisted',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID,
									name: 'Piyo',
									startDate: '2017-05-01',
									endDate: '2017-05-31',
									venue: {
										model: 'VENUE',
										uuid: HAROLD_PINTER_THEATRE_VENUE_UUID,
										name: 'Harold Pinter Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'First Place',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: THUD_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Thud',
									startDate: '2017-11-01',
									endDate: '2017-11-30',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: []
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Longlisted',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
									name: 'Xyzzy',
									startDate: '2017-06-01',
									endDate: '2017-06-30',
									venue: {
										model: 'VENUE',
										uuid: DORFMAN_THEATRE_VENUE_UUID,
										name: 'Dorfman Theatre',
										surVenue: {
											model: 'VENUE',
											uuid: NATIONAL_THEATRE_VENUE_UUID,
											name: 'National Theatre'
										}
									},
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
									name: 'Xyzzy',
									startDate: '2017-07-01',
									endDate: '2017-07-31',
									venue: {
										model: 'VENUE',
										uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
										name: 'Playhouse Theatre',
										surVenue: null
									},
									surProduction: null
								}
							],
							materials: []
						}
					]
				},
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Most Remarkable Play',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Shortlisted',
							entities: [],
							productions: [],
							materials: [
								{
									model: 'MATERIAL',
									uuid: THUD_MATERIAL_UUID,
									name: 'Thud',
									format: 'play',
									year: 2017,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Longlisted',
							entities: [],
							productions: [],
							materials: [
								{
									model: 'MATERIAL',
									uuid: WIBBLE_MATERIAL_UUID,
									name: 'Wibble',
									format: 'play',
									year: 2017,
									surMaterial: null,
									writingCredits: []
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'First Place',
							entities: [],
							productions: [],
							materials: [
								{
									model: 'MATERIAL',
									uuid: XYZZY_MATERIAL_UUID,
									name: 'Xyzzy',
									format: 'play',
									year: 2017,
									surMaterial: null,
									writingCredits: []
								}
							]
						}
					]
				}
			];

			const { categories } = eveningStandardTheatreAwards2017AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Laurence Olivier Awards (award)', () => {

		it('includes its ceremonies', () => {

			const expectedCeremonies = [
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
					name: '2020'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
					name: '2018'
				}
			];

			const { ceremonies } = laurenceOlivierAwardsAward.body;

			expect(ceremonies).to.deep.equal(expectedCeremonies);

		});

	});

	describe('Evening Standard Theatre Awards (award)', () => {

		it('includes its ceremonies', () => {

			const expectedCeremonies = [
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
					name: '2019'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_2018_AWARD_CEREMONY_UUID,
					name: '2018'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID,
					name: '2017'
				}
			];

			const { ceremonies } = eveningStandardTheatreAwardsAward.body;

			expect(ceremonies).to.deep.equal(expectedCeremonies);

		});

	});

	describe('John Doe (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Special Commendation',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
													name: 'Grault',
													startDate: '2019-12-01',
													endDate: '2019-12-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GRAULT_MATERIAL_UUID,
													name: 'Grault',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Finalist',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: FRED_OLD_VIC_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2019-09-01',
													endDate: '2019-09-30',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: FRED_MATERIAL_UUID,
													name: 'Fred',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
													name: 'Grault',
													startDate: '2019-12-01',
													endDate: '2019-12-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GRAULT_MATERIAL_UUID,
													name: 'Grault',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TOTO_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2018-03-01',
													endDate: '2018-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: TOTO_MATERIAL_UUID,
													name: 'Toto',
													format: 'play',
													year: 2018,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: [],
											materials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											employerCompany: null,
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-07-01',
													endDate: '2017-07-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_ALMEIDA_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2017-10-01',
													endDate: '2017-10-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2017,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: null,
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												}
											],
											productions: [],
											materials: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-07-01',
													endDate: '2017-07-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = johnDoePerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Curtain Up (company)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Finalist',
											members: [],
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: FRED_OLD_VIC_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2019-09-01',
													endDate: '2019-09-30',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: FRED_MATERIAL_UUID,
													name: 'Fred',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: FUGA_OLIVIER_PRODUCTION_UUID,
													name: 'Fuga',
													startDate: '2018-04-01',
													endDate: '2018-04-30',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: FUGA_MATERIAL_UUID,
													name: 'Fuga',
													format: 'play',
													year: 2018,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											members: [],
											coEntities: [
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: [],
											materials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2017-05-01',
													endDate: '2017-05-31',
													venue: {
														model: 'VENUE',
														uuid: HAROLD_PINTER_THEATRE_VENUE_UUID,
														name: 'Harold Pinter Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [],
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [],
											coEntities: [],
											productions: [],
											materials: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2017-05-01',
													endDate: '2017-05-31',
													venue: {
														model: 'VENUE',
														uuid: HAROLD_PINTER_THEATRE_VENUE_UUID,
														name: 'Harold Pinter Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [],
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-07-01',
													endDate: '2017-07-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = curtainUpLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Conor Corge (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Finalist',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TUTU_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Tutu',
													startDate: '2018-05-01',
													endDate: '2018-05-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: TUTU_MATERIAL_UUID,
													name: 'Tutu',
													format: 'play',
													year: 2018,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												}
											],
											productions: [],
											materials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [],
											materials: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-09-01',
													endDate: '2017-09-30',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = conorCorgePerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Stagecraft Ltd (company)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Finalist',
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												}
											],
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TUTU_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Tutu',
													startDate: '2018-05-01',
													endDate: '2018-05-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: TUTU_MATERIAL_UUID,
													name: 'Tutu',
													format: 'play',
													year: 2018,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											members: [
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												}
											],
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [],
											materials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											members: [
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												}
											],
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											],
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [],
											materials: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											members: [
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-09-01',
													endDate: '2017-09-30',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = stagecraftLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Quincy Qux (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Finalist',
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													},
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													}
												]
											},
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													},
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													}
												]
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													},
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													}
												]
											},
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [],
											materials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													},
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													}
												]
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													},
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													}
												]
											},
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													},
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													}
												]
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [],
											materials: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													},
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													}
												]
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-09-01',
													endDate: '2017-09-30',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = quincyQuxPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Garply at Lyttelton Theatre (production)', () => {

		it('includes its award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Finalist',
											recipientProductions: [],
											entities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											coProductions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Finalist',
											recipientProductions: [],
											entities: [],
											coProductions: [],
											materials: []
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											recipientProductions: [],
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											coProductions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											recipientProductions: [],
											entities: [],
											coProductions: [],
											materials: []
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProductions: [],
											entities: [
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProductions: [],
											entities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GARPLY_MATERIAL_UUID,
													name: 'Garply',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProductions: [],
											entities: [],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: []
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = garplyLytteltonProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Xyzzy at Playhouse Theatre (production)', () => {

		it('includes its award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											recipientProductions: [],
											entities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												},
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_ALMEIDA_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2017-10-01',
													endDate: '2017-10-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2017,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											recipientProductions: [],
											entities: [],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: []
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProductions: [],
											entities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProductions: [],
											entities: [],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: []
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = xyzzyPlayhouseProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Garply (material)', () => {

		it('includes its award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Finalist',
											recipientMaterials: [],
											entities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												}
											],
											coMaterials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Prize Recipient',
											recipientMaterials: [],
											entities: [],
											productions: [],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											recipientMaterials: [],
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												}
											],
											coMaterials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											recipientMaterials: [],
											entities: [],
											productions: [],
											coMaterials: []
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterials: [],
											entities: [
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											coMaterials: []
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterials: [],
											entities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											coMaterials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterials: [],
											entities: [],
											productions: [],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: WALDO_MATERIAL_UUID,
													name: 'Waldo',
													format: 'play',
													year: 2019,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = garplyMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Xyzzy (material)', () => {

		it('includes its award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS2017AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											recipientMaterials: [],
											entities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												},
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-07-01',
													endDate: '2017-07-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_ALMEIDA_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2017-10-01',
													endDate: '2017-10-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											recipientMaterials: [],
											entities: [],
											productions: [],
											coMaterials: []
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterials: [],
											entities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-07-01',
													endDate: '2017-07-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											coMaterials: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterials: [],
											entities: [],
											productions: [],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: THUD_MATERIAL_UUID,
													name: 'Thud',
													format: 'play',
													year: 2017,
													surMaterial: null
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = xyzzyMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

});
