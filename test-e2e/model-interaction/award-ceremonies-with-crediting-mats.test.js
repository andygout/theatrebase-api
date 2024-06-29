import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const PIYO_MATERIAL_UUID = 'PIYO_MATERIAL_UUID';
const FERDINAND_FOO_PERSON_UUID = 'FERDINAND_FOO_PERSON_UUID';
const CLARA_QUUX_PERSON_UUID = 'CLARA_QUUX_PERSON_UUID';
const SONGBIRDS_LTD_COMPANY_UUID = 'SONGBIRDS_LTD_COMPANY_UUID';
const WALDO_MATERIAL_UUID = 'WALDO_MATERIAL_UUID';
const JANE_ROE_PERSON_UUID = 'JANE_ROE_PERSON_UUID';
const FICTIONEERS_LTD_COMPANY_UUID = 'FICTIONEERS_LTD_COMPANY_UUID';
const WIBBLE_MATERIAL_UUID = 'WIBBLE_MATERIAL_UUID';
const QUINCY_QUX_PERSON_UUID = 'QUINCY_QUX_PERSON_UUID';
const THEATRICALS_LTD_COMPANY_UUID = 'THEATRICALS_LTD_COMPANY_UUID';
const XYZZY_MATERIAL_UUID = 'XYZZY_MATERIAL_UUID';
const CONOR_CORGE_PERSON_UUID = 'CONOR_CORGE_PERSON_UUID';
const SCRIBES_LTD_COMPANY_UUID = 'SCRIBES_LTD_COMPANY_UUID';
const BRANDON_BAZ_PERSON_UUID = 'BRANDON_BAZ_PERSON_UUID';
const CREATORS_LTD_COMPANY_UUID = 'CREATORS_LTD_COMPANY_UUID';
const FRED_MATERIAL_UUID = 'FRED_MATERIAL_UUID';
const JOHN_DOE_PERSON_UUID = 'JOHN_DOE_PERSON_UUID';
const PLAYWRIGHTS_LTD_COMPANY_UUID = 'PLAYWRIGHTS_LTD_COMPANY_UUID';
const PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = 'PLUGH_1_MATERIAL_UUID';
const FRANCIS_FLOB_PERSON_UUID = 'FRANCIS_FLOB_PERSON_UUID';
const CURTAIN_UP_LTD_COMPANY_UUID = 'CURTAIN_UP_LTD_COMPANY_UUID';
const PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = 'PLUGH_2_MATERIAL_UUID';
const BEATRICE_BAR_PERSON_UUID = 'BEATRICE_BAR_PERSON_UUID';
const STAGECRAFT_LTD_COMPANY_UUID = 'STAGECRAFT_LTD_COMPANY_UUID';
const HOGE_MATERIAL_UUID = 'HOGE_MATERIAL_UUID';
const CINERIGHTS_LTD_COMPANY_UUID = 'CINERIGHTS_LTD_COMPANY_UUID';
const TALYSE_TATA_PERSON_UUID = 'TALYSE_TATA_PERSON_UUID';
const THUD_MATERIAL_UUID = 'THUD_MATERIAL_UUID';
const TOTO_MATERIAL_UUID = 'TOTO_MATERIAL_UUID';
const GRAULT_MATERIAL_UUID = 'GRAULT_MATERIAL_UUID';
const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';
const OLIVIER_THEATRE_VENUE_UUID = 'OLIVIER_THEATRE_VENUE_UUID';
const LYTTELTON_THEATRE_VENUE_UUID = 'LYTTELTON_THEATRE_VENUE_UUID';
const COTTESLOE_THEATRE_VENUE_UUID = 'COTTESLOE_THEATRE_VENUE_UUID';
const ROYAL_COURT_THEATRE_VENUE_UUID = 'ROYAL_COURT_THEATRE_VENUE_UUID';
const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = 'JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID';
const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = 'JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID';
const PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = 'PIYO_PRODUCTION_UUID';
const PIYO_WYNDHAMS_PRODUCTION_UUID = 'PIYO_2_PRODUCTION_UUID';
const WYNDHAMS_THEATRE_VENUE_UUID = 'WYNDHAMS_THEATRE_VENUE_UUID';
const WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = 'WIBBLE_PRODUCTION_UUID';
const WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = 'WIBBLE_2_PRODUCTION_UUID';
const DUKE_OF_YORKS_THEATRE_VENUE_UUID = 'DUKE_OF_YORKS_THEATRE_VENUE_UUID';
const XYZZY_OLIVIER_PRODUCTION_UUID = 'XYZZY_PRODUCTION_UUID';
const XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID = 'XYZZY_2_PRODUCTION_UUID';
const FRED_LYTTELTON_PRODUCTION_UUID = 'FRED_PRODUCTION_UUID';
const FRED_NOËL_COWARD_PRODUCTION_UUID = 'FRED_2_PRODUCTION_UUID';
const NOËL_COWARD_THEATRE_VENUE_UUID = 'NOEL_COWARD_THEATRE_VENUE_UUID';
const GARPLY_ALMEIDA_PRODUCTION_UUID = 'GARPLY_PRODUCTION_UUID';
const PLUGH_LYTTELTON_PRODUCTION_UUID = 'PLUGH_PRODUCTION_UUID';
const PLUGH_WYNDHAMS_PRODUCTION_UUID = 'PLUGH_2_PRODUCTION_UUID';
const HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = 'HOGE_PRODUCTION_UUID';
const HOGE_NOËL_COWARD_PRODUCTION_UUID = 'HOGE_2_PRODUCTION_UUID';
const THUD_PLAYHOUSE_PRODUCTION_UUID = 'THUD_PRODUCTION_UUID';
const PLAYHOUSE_THEATRE_VENUE_UUID = 'PLAYHOUSE_THEATRE_VENUE_UUID';
const TUTU_OLD_VIC_PRODUCTION_UUID = 'TUTU_PRODUCTION_UUID';
const TOTO_COTTESLOE_PRODUCTION_UUID = 'TOTO_PRODUCTION_UUID';
const TOTO_GIELGUD_PRODUCTION_UUID = 'TOTO_2_PRODUCTION_UUID';
const GIELGUD_THEATRE_VENUE_UUID = 'GIELGUD_THEATRE_VENUE_UUID';
const FUGA_ALMEIDA_PRODUCTION_UUID = 'FUGA_PRODUCTION_UUID';
const GRAULT_GIELGUD_PRODUCTION_UUID = 'GRAULT_PRODUCTION_UUID';
const WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID = '2009_2_AWARD_CEREMONY_UUID';
const WORDSMITH_AWARD_UUID = 'WORDSMITH_AWARD_AWARD_UUID';
const WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID = '2010_2_AWARD_CEREMONY_UUID';
const WORDSMITH_AWARD_2008_AWARD_CEREMONY_UUID = '2008_2_AWARD_CEREMONY_UUID';
const PLAYWRITING_PRIZE_2008_AWARD_CEREMONY_UUID = '2008_4_AWARD_CEREMONY_UUID';
const PLAYWRITING_PRIZE_AWARD_UUID = 'PLAYWRITING_PRIZE_AWARD_UUID';
const PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID = '2009_4_AWARD_CEREMONY_UUID';
const PLAYWRITING_PRIZE2007AWARD_CEREMONY_UUID = '2007_2_AWARD_CEREMONY_UUID';

let wordsmithAward2009AwardCeremony;
let playwritingPrize2009AwardCeremony;
let johnDoePerson;
let playwrightsLtdCompany;
let claraQuuxPerson;
let songbirdsLtdCompany;
let beatriceBarPerson;
let theatricalsLtdCompany;
let waldoMaterial;
let janeRoePerson;
let fictioneersLtdCompany;
let brandonBazPerson;
let creatorsLtdCompany;
let plughOriginalVersionMaterial;
let francisFlobPerson;
let curtainUpLtdCompany;
let talyseTataPerson;
let cinerightsLtdCompany;

const sandbox = createSandbox();

describe('Award ceremonies with crediting materials', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Piyo',
				format: 'musical',
				year: '2008',
				writingCredits: [
					{
						name: 'book by',
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								name: 'Clara Quux'
							}
						]
					},
					{
						name: 'music by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Songbirds Ltd'
							},
							{
								name: 'Ferdinand Foo'
							}
						]
					},
					{
						name: 'lyrics by',
						entities: [
							{
								name: 'Clara Quux'
							},
							{
								model: 'COMPANY',
								name: 'Songbirds Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Waldo',
				format: 'novel',
				year: '1974',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe'
							},
							{
								model: 'COMPANY',
								name: 'Fictioneers Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Wibble',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux'
							},
							{
								model: 'COMPANY',
								name: 'Theatricals Ltd'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Waldo'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Xyzzy',
				format: 'play',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Conor Corge'
							},
							{
								model: 'COMPANY',
								name: 'Scribes Ltd'
							}
						]
					},
					{
						name: 'based on the works of',
						creditType: 'NON_SPECIFIC_SOURCE_MATERIAL',
						entities: [
							{
								name: 'Brandon Baz'
							},
							{
								model: 'COMPANY',
								name: 'Creators Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Fred',
				format: 'play',
				year: '2010',
				writingCredits: [
					{
						entities: [
							{
								name: 'John Doe'
							},
							{
								model: 'COMPANY',
								name: 'Playwrights Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Garply',
				format: 'play',
				year: '2010',
				writingCredits: [
					{
						entities: [
							{
								name: 'Conor Corge'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Plugh',
				differentiator: '1',
				format: 'play',
				year: '1899',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Curtain Up Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Plugh',
				differentiator: '2',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Plugh',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Curtain Up Ltd'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar'
							},
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hoge',
				format: 'play',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Beatrice Bar'
							},
							{
								model: 'COMPANY',
								name: 'Theatricals Ltd'
							}
						]
					},
					{
						name: 'by arrangement with',
						creditType: 'RIGHTS_GRANTOR',
						entities: [
							{
								model: 'COMPANY',
								name: 'Cinerights Ltd'
							},
							{
								name: 'Talyse Tata'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Thud',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Clara Quux'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Tutu',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Christian Quuz'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Toto',
				format: 'play',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Brandon Baz'
							},
							{
								model: 'COMPANY',
								name: 'Playwrights Ltd'
							}
						]
					},
					{
						name: 'additional material by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Inkists Ltd'
							},
							{
								name: 'John Doe'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Fuga',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Conor Corge'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Grault',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Beatrice Bar'
							}
						]
					}
				]
			});

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
			.post('/venues')
			.send({
				name: 'Royal Court Theatre',
				subVenues: [
					{
						name: 'Jerwood Theatre Downstairs'
					},
					{
						name: 'Jerwood Theatre Upstairs'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Piyo',
				startDate: '2008-09-01',
				endDate: '2008-09-30',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Piyo',
				startDate: '2008-10-01',
				endDate: '2008-10-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Wibble',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Xyzzy',
				startDate: '2008-11-01',
				endDate: '2008-11-30',
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Xyzzy',
				startDate: '2008-12-01',
				endDate: '2008-12-31',
				venue: {
					name: 'Duke of York\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fred',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fred',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Garply',
				startDate: '2010-04-01',
				endDate: '2010-04-30',
				venue: {
					name: 'Almeida Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Plugh',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Lyttelton Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Plugh',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hoge',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Thud',
				startDate: '2007-03-01',
				endDate: '2007-03-31',
				venue: {
					name: 'Playhouse Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Tutu',
				startDate: '2007-04-01',
				endDate: '2007-04-30',
				venue: {
					name: 'Old Vic Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Toto',
				startDate: '2008-07-01',
				endDate: '2008-07-31',
				venue: {
					name: 'Cottesloe Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Toto',
				startDate: '2008-08-01',
				endDate: '2008-08-31',
				venue: {
					name: 'Gielgud Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fuga',
				startDate: '2007-05-01',
				endDate: '2007-05-31',
				venue: {
					name: 'Almeida Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Grault',
				startDate: '2007-06-01',
				endDate: '2007-06-30',
				venue: {
					name: 'Gielgud Theatre'
				}
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2009',
				award: {
					name: 'Wordsmith Award'
				},
				categories: [
					{
						name: 'Best Miscellaneous Play',
						nominations: [
							{
								customType: 'Shortlisted',
								productions: [
									{
										uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: PIYO_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Piyo'
									}
								]
							},
							{
								customType: 'Longlisted',
								productions: [
									{
										uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Wibble'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								productions: [
									{
										uuid: XYZZY_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
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
				name: '2010',
				award: {
					name: 'Wordsmith Award'
				},
				categories: [
					{
						name: 'Best Miscellaneous Play',
						nominations: [
							{
								customType: 'Longlisted',
								productions: [
									{
										uuid: FRED_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: FRED_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Fred'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								productions: [
									{
										uuid: GARPLY_ALMEIDA_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Garply'
									}
								]
							},
							{
								customType: 'Shortlisted',
								productions: [
									{
										uuid: PLUGH_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Plugh',
										differentiator: '2'
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
				name: '2008',
				award: {
					name: 'Wordsmith Award'
				},
				categories: [
					{
						name: 'Best Miscellaneous Play',
						nominations: [
							{
								isWinner: true,
								customType: 'First Place',
								productions: [
									{
										uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Hoge'
									}
								]
							},
							{
								customType: 'Shortlisted',
								productions: [
									{
										uuid: THUD_PLAYHOUSE_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Thud'
									}
								]
							},
							{
								customType: 'Longlisted',
								productions: [
									{
										uuid: TUTU_OLD_VIC_PRODUCTION_UUID
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
				name: '2008',
				award: {
					name: 'Playwriting Prize'
				},
				categories: [
					{
						name: 'Best Random Play',
						nominations: [
							{
								productions: [
									{
										uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Piyo'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: TOTO_COTTESLOE_PRODUCTION_UUID
									},
									{
										uuid: TOTO_GIELGUD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Toto'
									}
								]
							},
							{
								productions: [
									{
										uuid: XYZZY_OLIVIER_PRODUCTION_UUID
									}
								],
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
				name: '2009',
				award: {
					name: 'Playwriting Prize'
				},
				categories: [
					{
						name: 'Best Random Play',
						nominations: [
							{
								productions: [
									{
										uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Hoge'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: PLUGH_LYTTELTON_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Plugh',
										differentiator: '2'
									}
								]
							},
							{
								productions: [
									{
										uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
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
				name: '2007',
				award: {
					name: 'Playwriting Prize'
				},
				categories: [
					{
						name: 'Best Random Play',
						nominations: [
							{
								productions: [
									{
										uuid: FUGA_ALMEIDA_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Fuga'
									}
								]
							},
							{
								productions: [
									{
										uuid: GRAULT_GIELGUD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Grault'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: THUD_PLAYHOUSE_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Thud'
									}
								]
							}
						]
					}
				]
			});

		wordsmithAward2009AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID}`);

		playwritingPrize2009AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID}`);

		johnDoePerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_PERSON_UUID}`);

		playwrightsLtdCompany = await chai.request(app)
			.get(`/companies/${PLAYWRIGHTS_LTD_COMPANY_UUID}`);

		claraQuuxPerson = await chai.request(app)
			.get(`/people/${CLARA_QUUX_PERSON_UUID}`);

		songbirdsLtdCompany = await chai.request(app)
			.get(`/companies/${SONGBIRDS_LTD_COMPANY_UUID}`);

		beatriceBarPerson = await chai.request(app)
			.get(`/people/${BEATRICE_BAR_PERSON_UUID}`);

		theatricalsLtdCompany = await chai.request(app)
			.get(`/companies/${THEATRICALS_LTD_COMPANY_UUID}`);

		waldoMaterial = await chai.request(app)
			.get(`/materials/${WALDO_MATERIAL_UUID}`);

		janeRoePerson = await chai.request(app)
			.get(`/people/${JANE_ROE_PERSON_UUID}`);

		fictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${FICTIONEERS_LTD_COMPANY_UUID}`);

		brandonBazPerson = await chai.request(app)
			.get(`/people/${BRANDON_BAZ_PERSON_UUID}`);

		creatorsLtdCompany = await chai.request(app)
			.get(`/companies/${CREATORS_LTD_COMPANY_UUID}`);

		plughOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

		francisFlobPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_PERSON_UUID}`);

		curtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${CURTAIN_UP_LTD_COMPANY_UUID}`);

		talyseTataPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_PERSON_UUID}`);

		cinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${CINERIGHTS_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Wordsmith Award 2009 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Miscellaneous Play',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Shortlisted',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
									name: 'Piyo',
									startDate: '2008-09-01',
									endDate: '2008-09-30',
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
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: PIYO_WYNDHAMS_PRODUCTION_UUID,
									name: 'Piyo',
									startDate: '2008-10-01',
									endDate: '2008-10-31',
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
									uuid: PIYO_MATERIAL_UUID,
									name: 'Piyo',
									format: 'musical',
									year: 2008,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'book by',
											entities: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: CLARA_QUUX_PERSON_UUID,
													name: 'Clara Quux'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'music by',
											entities: [
												{
													model: 'COMPANY',
													uuid: SONGBIRDS_LTD_COMPANY_UUID,
													name: 'Songbirds Ltd'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'lyrics by',
											entities: [
												{
													model: 'PERSON',
													uuid: CLARA_QUUX_PERSON_UUID,
													name: 'Clara Quux'
												},
												{
													model: 'COMPANY',
													uuid: SONGBIRDS_LTD_COMPANY_UUID,
													name: 'Songbirds Ltd'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Longlisted',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2009-05-01',
									endDate: '2009-05-31',
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
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2009-06-01',
									endDate: '2009-06-30',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
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
									year: 2009,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: QUINCY_QUX_PERSON_UUID,
													name: 'Quincy Qux'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'based on',
											entities: [
												{
													model: 'MATERIAL',
													uuid: WALDO_MATERIAL_UUID,
													name: 'Waldo',
													format: 'novel',
													year: 1974,
													surMaterial: null,
													writingCredits: [
														{
															name: 'by',
															model: 'WRITING_CREDIT',
															entities: [
																{
																	model: 'PERSON',
																	uuid: JANE_ROE_PERSON_UUID,
																	name: 'Jane Roe'
																},
																{
																	model: 'COMPANY',
																	uuid: FICTIONEERS_LTD_COMPANY_UUID,
																	name: 'Fictioneers Ltd'
																}
															]
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
							model: 'NOMINATION',
							isWinner: true,
							type: 'First Place',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
									name: 'Xyzzy',
									startDate: '2008-11-01',
									endDate: '2008-11-30',
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
								},
								{
									model: 'PRODUCTION',
									uuid: XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Xyzzy',
									startDate: '2008-12-01',
									endDate: '2008-12-31',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
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
									year: 2008,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: SCRIBES_LTD_COMPANY_UUID,
													name: 'Scribes Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'based on the works of',
											entities: [
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'COMPANY',
													uuid: CREATORS_LTD_COMPANY_UUID,
													name: 'Creators Ltd'
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

			const { categories } = wordsmithAward2009AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Playwriting Prize 2009 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Random Play',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
									name: 'Hoge',
									startDate: '2008-05-01',
									endDate: '2008-05-31',
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
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Hoge',
									startDate: '2008-06-01',
									endDate: '2008-06-30',
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
									uuid: HOGE_MATERIAL_UUID,
									name: 'Hoge',
									format: 'play',
									year: 2008,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'by arrangement with',
											entities: [
												{
													model: 'COMPANY',
													uuid: CINERIGHTS_LTD_COMPANY_UUID,
													name: 'Cinerights Ltd'
												},
												{
													model: 'PERSON',
													uuid: TALYSE_TATA_PERSON_UUID,
													name: 'Talyse Tata'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'Winner',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
									name: 'Plugh',
									startDate: '2009-07-01',
									endDate: '2009-07-31',
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
									uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
									name: 'Plugh',
									format: 'play',
									year: 2009,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: FRANCIS_FLOB_PERSON_UUID,
													name: 'Francis Flob'
												},
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'version by',
											entities: [
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2009-05-01',
									endDate: '2009-05-31',
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
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2009-06-01',
									endDate: '2009-06-30',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
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
									year: 2009,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: QUINCY_QUX_PERSON_UUID,
													name: 'Quincy Qux'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'based on',
											entities: [
												{
													model: 'MATERIAL',
													uuid: WALDO_MATERIAL_UUID,
													name: 'Waldo',
													format: 'novel',
													year: 1974,
													surMaterial: null,
													writingCredits: [
														{
															model: 'WRITING_CREDIT',
															name: 'by',
															entities: [
																{
																	model: 'PERSON',
																	uuid: JANE_ROE_PERSON_UUID,
																	name: 'Jane Roe'
																},
																{
																	model: 'COMPANY',
																	uuid: FICTIONEERS_LTD_COMPANY_UUID,
																	name: 'Fictioneers Ltd'
																}
															]
														}
													]
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

			const { categories } = playwritingPrize2009AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('John Doe (person): single credit per nomination; single nomination per category', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
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
													uuid: TOTO_COTTESLOE_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-07-01',
													endDate: '2008-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: TOTO_GIELGUD_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-08-01',
													endDate: '2008-08-31',
													venue: {
														model: 'VENUE',
														uuid: GIELGUD_THEATRE_VENUE_UUID,
														name: 'Gielgud Theatre',
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
													year: 2008,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2010-02-01',
													endDate: '2010-02-28',
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
													uuid: FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
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
													year: 2010,
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

	describe('Playwrights Ltd (company): single credit per nomination; single nomination per category', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TOTO_COTTESLOE_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-07-01',
													endDate: '2008-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: TOTO_GIELGUD_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-08-01',
													endDate: '2008-08-31',
													venue: {
														model: 'VENUE',
														uuid: GIELGUD_THEATRE_VENUE_UUID,
														name: 'Gielgud Theatre',
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
													year: 2008,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2010-02-01',
													endDate: '2010-02-28',
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
													uuid: FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
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
													year: 2010,
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

			const { awards } = playwrightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Clara Quux (person): multiple credits in same nomination', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-09-01',
													endDate: '2008-09-30',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'musical',
													year: 2008,
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
							uuid: PLAYWRITING_PRIZE2007AWARD_CEREMONY_UUID,
							name: '2007',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
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
													uuid: THUD_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Thud',
													startDate: '2007-03-01',
													endDate: '2007-03-31',
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
													uuid: THUD_MATERIAL_UUID,
													name: 'Thud',
													format: 'play',
													year: 2007,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-09-01',
													endDate: '2008-09-30',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: PIYO_WYNDHAMS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-10-01',
													endDate: '2008-10-31',
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
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'musical',
													year: 2008,
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
							uuid: WORDSMITH_AWARD_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: THUD_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Thud',
													startDate: '2007-03-01',
													endDate: '2007-03-31',
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
													uuid: THUD_MATERIAL_UUID,
													name: 'Thud',
													format: 'play',
													year: 2007,
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

			const { awards } = claraQuuxPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Songbirds Ltd (company): multiple credits in same nomination', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
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
													uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-09-01',
													endDate: '2008-09-30',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'musical',
													year: 2008,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
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
													uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-09-01',
													endDate: '2008-09-30',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: PIYO_WYNDHAMS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-10-01',
													endDate: '2008-10-31',
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
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'musical',
													year: 2008,
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

			const { awards } = songbirdsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Beatrice Bar (person): multiple nominations in same category', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
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
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008,
													surMaterial: null
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009,
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
							uuid: PLAYWRITING_PRIZE2007AWARD_CEREMONY_UUID,
							name: '2007',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GRAULT_GIELGUD_PRODUCTION_UUID,
													name: 'Grault',
													startDate: '2007-06-01',
													endDate: '2007-06-30',
													venue: {
														model: 'VENUE',
														uuid: GIELGUD_THEATRE_VENUE_UUID,
														name: 'Gielgud Theatre',
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
													year: 2007,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
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
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009,
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
							uuid: WORDSMITH_AWARD_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
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
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008,
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

			const { awards } = beatriceBarPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Theatricals Ltd (company): multiple nominations in same category', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
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
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
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
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008,
													surMaterial: null
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
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
													year: 2009,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
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
													year: 2009,
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
							uuid: WORDSMITH_AWARD_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
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
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
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
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008,
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

			const { awards } = theatricalsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Plugh (play, 1899) (material): subsequent versions have nominations', () => {

		it('includes awards of its subsequent versions', () => {

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
											materials: [],
											recipientSubsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSubsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009,
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

			const { subsequentVersionMaterialAwards } = plughOriginalVersionMaterial.body;

			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Francis Flob (person): subsequent versions of their work have nominations', () => {

		it('includes awards of subsequent versions of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
											materials: [],
											recipientSubsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSubsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009,
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

			const { awards, subsequentVersionMaterialAwards } = francisFlobPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Curtain Up Ltd (company): subsequent versions of their work have nominations', () => {

		it('includes awards of subsequent versions of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
											materials: [],
											recipientSubsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Shortlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSubsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009,
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

			const { awards, subsequentVersionMaterialAwards } = curtainUpLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Waldo (novel, 1974) (material): materials that used it as source material have nominations', () => {

		it('includes awards of materials that used it as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009,
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

			const { sourcingMaterialAwards } = waldoMaterial.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Jane Roe (person): materials that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009,
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

			const { sourcingMaterialAwards } = janeRoePerson.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Fictioneers Ltd (company): materials that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Longlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009,
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

			const { sourcingMaterialAwards } = fictioneersLtdCompany.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Brandon Baz (person): materials that used their (non-specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (non-specific) work as source material', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
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
													uuid: TOTO_COTTESLOE_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-07-01',
													endDate: '2008-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: TOTO_GIELGUD_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-08-01',
													endDate: '2008-08-31',
													venue: {
														model: 'VENUE',
														uuid: GIELGUD_THEATRE_VENUE_UUID,
														name: 'Gielgud Theatre',
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
													year: 2008,
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

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-11-01',
													endDate: '2008-11-30',
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
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2008,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-11-01',
													endDate: '2008-11-30',
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
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-12-01',
													endDate: '2008-12-31',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2008,
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

			const { awards, sourcingMaterialAwards } = brandonBazPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Creators Ltd (company): materials that used their (non-specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (non-specific) work as source material', () => {

			const expectedAwards = [];

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-11-01',
													endDate: '2008-11-30',
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
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2008,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-11-01',
													endDate: '2008-11-30',
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
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-12-01',
													endDate: '2008-12-31',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientSourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2008,
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

			const { awards, sourcingMaterialAwards } = creatorsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Talyse Tata (person): materials to which they have granted rights have nominations', () => {

		it('includes awards of materials to which they have granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientRightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
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
													surProduction: null
												}
											],
											materials: [],
											recipientRightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008,
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

			const { awards, rightsGrantorMaterialAwards } = talyseTataPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Cinerights Ltd (company): materials to which they granted rights have nominations', () => {

		it('includes awards of materials to which they granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											recipientRightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008,
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_2008_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'First Place',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
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
													surProduction: null
												}
											],
											materials: [],
											recipientRightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008,
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

			const { awards, rightsGrantorMaterialAwards } = cinerightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

});
