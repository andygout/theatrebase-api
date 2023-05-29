import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Award ceremonies with crediting sub-sub-materials', () => {

	chai.use(chaiHttp);

	const SUB_FRED_MATERIAL_UUID = '4';
	const JOHN_DOE_PERSON_UUID = '6';
	const PLAYWRIGHTS_LTD_COMPANY_UUID = '7';
	const MID_FRED_MATERIAL_UUID = '14';
	const SUR_FRED_MATERIAL_UUID = '25';
	const SUB_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = '34';
	const FRANCIS_FLOB_PERSON_UUID = '36';
	const CURTAIN_UP_LTD_COMPANY_UUID = '37';
	const MID_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = '44';
	const SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = '55';
	const SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '66';
	const BEATRICE_BAR_PERSON_UUID = '70';
	const STAGECRAFT_LTD_COMPANY_UUID = '71';
	const MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '80';
	const SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '95';
	const SUB_WALDO_MATERIAL_UUID = '106';
	const JANE_ROE_PERSON_UUID = '108';
	const FICTIONEERS_LTD_COMPANY_UUID = '109';
	const MID_WALDO_MATERIAL_UUID = '116';
	const SUR_WALDO_MATERIAL_UUID = '127';
	const SUB_WIBBLE_MATERIAL_UUID = '137';
	const QUINCY_QUX_PERSON_UUID = '139';
	const THEATRICALS_LTD_COMPANY_UUID = '140';
	const MID_WIBBLE_MATERIAL_UUID = '149';
	const SUR_WIBBLE_MATERIAL_UUID = '162';
	const SUB_HOGE_MATERIAL_UUID = '174';
	const CINERIGHTS_LTD_COMPANY_UUID = '178';
	const TALYSE_TATA_PERSON_UUID = '179';
	const MID_HOGE_MATERIAL_UUID = '188';
	const SUR_HOGE_MATERIAL_UUID = '203';
	const NATIONAL_THEATRE_VENUE_UUID = '213';
	const OLIVIER_THEATRE_VENUE_UUID = '214';
	const LYTTELTON_THEATRE_VENUE_UUID = '215';
	const ROYAL_COURT_THEATRE_VENUE_UUID = '219';
	const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = '220';
	const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '221';
	const SUB_FRED_LYTTELTON_PRODUCTION_UUID = '222';
	const MID_FRED_LYTTELTON_PRODUCTION_UUID = '225';
	const SUR_FRED_LYTTELTON_PRODUCTION_UUID = '228';
	const SUB_FRED_NOËL_COWARD_PRODUCTION_UUID = '231';
	const NOËL_COWARD_THEATRE_VENUE_UUID = '233';
	const MID_FRED_NOËL_COWARD_PRODUCTION_UUID = '234';
	const SUR_FRED_NOËL_COWARD_PRODUCTION_UUID = '237';
	const SUB_PLUGH_OLIVIER_PRODUCTION_UUID = '240';
	const MID_PLUGH_OLIVIER_PRODUCTION_UUID = '243';
	const SUR_PLUGH_OLIVIER_PRODUCTION_UUID = '246';
	const SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID = '249';
	const WYNDHAMS_THEATRE_VENUE_UUID = '251';
	const MID_PLUGH_WYNDHAMS_PRODUCTION_UUID = '252';
	const SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID = '255';
	const SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '258';
	const MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '261';
	const SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '264';
	const SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = '267';
	const DUKE_OF_YORKS_THEATRE_VENUE_UUID = '269';
	const MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = '270';
	const SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = '273';
	const SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '276';
	const MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '279';
	const SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '282';
	const SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID = '285';
	const MID_HOGE_NOËL_COWARD_PRODUCTION_UUID = '288';
	const SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID = '291';
	const WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = '300';
	const WORDSMITH_AWARD_UUID = '301';
	const PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID = '312';
	const PLAYWRITING_PRIZE_AWARD_UUID = '313';
	const DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID = '324';
	const DRAMATISTS_MEDAL_AWARD_UUID = '325';

	let wordsmithAward2010AwardCeremony;
	let playwritingPrize2009AwardCeremony;
	let dramatistsMedal2008AwardCeremony;
	let johnDoePerson;
	let playwrightsLtdCompany;
	let subPlughOriginalVersionMaterial;
	let midPlughOriginalVersionMaterial;
	let surPlughOriginalVersionMaterial;
	let francisFlobPerson;
	let curtainUpLtdCompany;
	let subWaldoMaterial;
	let midWaldoMaterial;
	let surWaldoMaterial;
	let janeRoePerson;
	let fictioneersLtdCompany;
	let talyseTataPerson;
	let cinerightsLtdCompany;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Fred',
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
				name: 'Mid-Fred',
				format: 'sub-collection of plays',
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
				],
				subMaterials: [
					{
						name: 'Sub-Fred'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Fred',
				format: 'collection of plays',
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
				],
				subMaterials: [
					{
						name: 'Mid-Fred'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh',
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
				name: 'Mid-Plugh',
				differentiator: '1',
				format: 'sub-collection of plays',
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
				],
				subMaterials: [
					{
						name: 'Sub-Plugh',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Plugh',
				differentiator: '1',
				format: 'collection of plays',
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
				],
				subMaterials: [
					{
						name: 'Mid-Plugh',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh',
				differentiator: '2',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Sub-Plugh',
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
				name: 'Mid-Plugh',
				differentiator: '2',
				format: 'sub-collection of plays',
				year: '2009',
				originalVersionMaterial: {
					name: 'Mid-Plugh',
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
				],
				subMaterials: [
					{
						name: 'Sub-Plugh',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Plugh',
				differentiator: '2',
				format: 'collection of plays',
				year: '2009',
				originalVersionMaterial: {
					name: 'Sur-Plugh',
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
				],
				subMaterials: [
					{
						name: 'Mid-Plugh',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Waldo',
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
				name: 'Mid-Waldo',
				format: 'sub-trilogy of novels',
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
				],
				subMaterials: [
					{
						name: 'Sub-Waldo'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Waldo',
				format: 'trilogy of trilogies of novels',
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
				],
				subMaterials: [
					{
						name: 'Mid-Waldo'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble',
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
								name: 'Sub-Waldo'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Wibble',
				format: 'sub-trilogy of plays',
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
								name: 'Mid-Waldo'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Wibble'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Wibble',
				format: 'trilogy of trilogies of plays',
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
								name: 'Sur-Waldo'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Mid-Wibble'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Hoge',
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
				name: 'Mid-Hoge',
				format: 'sub-collection of plays',
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
				],
				subMaterials: [
					{
						name: 'Sub-Hoge'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Hoge',
				format: 'collection of plays',
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
				],
				subMaterials: [
					{
						name: 'Mid-Hoge'
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
				name: 'Sub-Fred',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Fred',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				},
				subProductions: [
					{
						uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Fred',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				},
				subProductions: [
					{
						uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Fred',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Fred',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Fred',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Plugh',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Plugh',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Olivier Theatre'
				},
				subProductions: [
					{
						uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Plugh',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Olivier Theatre'
				},
				subProductions: [
					{
						uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Plugh',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Plugh',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				},
				subProductions: [
					{
						uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Plugh',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				},
				subProductions: [
					{
						uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				},
				subProductions: [
					{
						uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Hoge',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Hoge',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				},
				subProductions: [
					{
						uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Hoge',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				},
				subProductions: [
					{
						uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID
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
								productions: [
									{
										uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Fred'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Plugh',
										differentiator: '2'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Wibble'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Hoge'
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
										uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Fred'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Plugh',
										differentiator: '2'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Wibble'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Hoge'
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
					name: 'Dramatists Medal'
				},
				categories: [
					{
						name: 'Most Remarkable Play',
						nominations: [
							{
								productions: [
									{
										uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Fred'
									}
								]
							},
							{
								productions: [
									{
										uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Plugh',
										differentiator: '2'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Wibble'
									}
								]
							},
							{
								productions: [
									{
										uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Hoge'
									}
								]
							}
						]
					}
				]
			});

		wordsmithAward2010AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`);

		playwritingPrize2009AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID}`);

		dramatistsMedal2008AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID}`);

		johnDoePerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_PERSON_UUID}`);

		playwrightsLtdCompany = await chai.request(app)
			.get(`/companies/${PLAYWRIGHTS_LTD_COMPANY_UUID}`);

		subPlughOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${SUB_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

		midPlughOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${MID_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

		surPlughOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

		francisFlobPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_PERSON_UUID}`);

		curtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${CURTAIN_UP_LTD_COMPANY_UUID}`);

		subWaldoMaterial = await chai.request(app)
			.get(`/materials/${SUB_WALDO_MATERIAL_UUID}`);

		midWaldoMaterial = await chai.request(app)
			.get(`/materials/${MID_WALDO_MATERIAL_UUID}`);

		surWaldoMaterial = await chai.request(app)
			.get(`/materials/${SUR_WALDO_MATERIAL_UUID}`);

		janeRoePerson = await chai.request(app)
			.get(`/people/${JANE_ROE_PERSON_UUID}`);

		fictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${FICTIONEERS_LTD_COMPANY_UUID}`);

		talyseTataPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_PERSON_UUID}`);

		cinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${CINERIGHTS_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Wordsmith Award 2010 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Miscellaneous Play',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
									name: 'Sub-Fred',
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
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
										name: 'Mid-Fred',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
											name: 'Sur-Fred'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Sub-Fred',
									startDate: '2010-03-01',
									endDate: '2010-03-31',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Mid-Fred',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
											name: 'Sur-Fred'
										}
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUB_FRED_MATERIAL_UUID,
									name: 'Sub-Fred',
									format: 'play',
									year: 2010,
									surMaterial: {
										model: 'MATERIAL',
										uuid: MID_FRED_MATERIAL_UUID,
										name: 'Mid-Fred',
										surMaterial: {
											model: 'MATERIAL',
											uuid: SUR_FRED_MATERIAL_UUID,
											name: 'Sur-Fred'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												},
												{
													model: 'COMPANY',
													uuid: PLAYWRIGHTS_LTD_COMPANY_UUID,
													name: 'Playwrights Ltd'
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
									uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
									name: 'Sub-Plugh',
									startDate: '2009-07-01',
									endDate: '2009-07-31',
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
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
										name: 'Mid-Plugh',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
											name: 'Sur-Plugh'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
									name: 'Sub-Plugh',
									startDate: '2009-08-01',
									endDate: '2009-08-31',
									venue: {
										model: 'VENUE',
										uuid: WYNDHAMS_THEATRE_VENUE_UUID,
										name: 'Wyndham\'s Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
										name: 'Mid-Plugh',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
											name: 'Sur-Plugh'
										}
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
									name: 'Sub-Plugh',
									format: 'play',
									year: 2009,
									surMaterial: {
										model: 'MATERIAL',
										uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
										name: 'Mid-Plugh',
										surMaterial: {
											model: 'MATERIAL',
											uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
											name: 'Sur-Plugh'
										}
									},
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
									uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Sub-Wibble',
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
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
										name: 'Mid-Wibble',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
											name: 'Sur-Wibble'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Sub-Wibble',
									startDate: '2009-06-01',
									endDate: '2009-06-30',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
										name: 'Mid-Wibble',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
											name: 'Sur-Wibble'
										}
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUB_WIBBLE_MATERIAL_UUID,
									name: 'Sub-Wibble',
									format: 'play',
									year: 2009,
									surMaterial: {
										model: 'MATERIAL',
										uuid: MID_WIBBLE_MATERIAL_UUID,
										name: 'Mid-Wibble',
										surMaterial: {
											model: 'MATERIAL',
											uuid: SUR_WIBBLE_MATERIAL_UUID,
											name: 'Sur-Wibble'
										}
									},
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
													uuid: SUB_WALDO_MATERIAL_UUID,
													name: 'Sub-Waldo',
													format: 'novel',
													year: 1974,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WALDO_MATERIAL_UUID,
														name: 'Mid-Waldo',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WALDO_MATERIAL_UUID,
															name: 'Sur-Waldo'
														}
													},
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
							type: 'Winner',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
									name: 'Sub-Hoge',
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
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
										name: 'Mid-Hoge',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
											name: 'Sur-Hoge'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Sub-Hoge',
									startDate: '2008-06-01',
									endDate: '2008-06-30',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Mid-Hoge',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
											name: 'Sur-Hoge'
										}
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUB_HOGE_MATERIAL_UUID,
									name: 'Sub-Hoge',
									format: 'play',
									year: 2008,
									surMaterial: {
										model: 'MATERIAL',
										uuid: MID_HOGE_MATERIAL_UUID,
										name: 'Mid-Hoge',
										surMaterial: {
											model: 'MATERIAL',
											uuid: SUR_HOGE_MATERIAL_UUID,
											name: 'Sur-Hoge'
										}
									},
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
						}
					]
				}
			];

			const { categories } = wordsmithAward2010AwardCeremony.body;

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
									uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
									name: 'Sur-Fred',
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
									uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Sur-Fred',
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
									uuid: SUR_FRED_MATERIAL_UUID,
									name: 'Sur-Fred',
									format: 'collection of plays',
									year: 2010,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												},
												{
													model: 'COMPANY',
													uuid: PLAYWRIGHTS_LTD_COMPANY_UUID,
													name: 'Playwrights Ltd'
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
									uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
									name: 'Sur-Plugh',
									startDate: '2009-07-01',
									endDate: '2009-07-31',
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
									uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
									name: 'Sur-Plugh',
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
									uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
									name: 'Sur-Plugh',
									format: 'collection of plays',
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
									uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Sur-Wibble',
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
									uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Sur-Wibble',
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
									uuid: SUR_WIBBLE_MATERIAL_UUID,
									name: 'Sur-Wibble',
									format: 'trilogy of trilogies of plays',
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
													uuid: SUR_WALDO_MATERIAL_UUID,
													name: 'Sur-Waldo',
													format: 'trilogy of trilogies of novels',
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
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
									name: 'Sur-Hoge',
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
									uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Sur-Hoge',
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
									uuid: SUR_HOGE_MATERIAL_UUID,
									name: 'Sur-Hoge',
									format: 'collection of plays',
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
						}
					]
				}
			];

			const { categories } = playwritingPrize2009AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Dramatists Medal 2008 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Most Remarkable Play',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
									name: 'Mid-Fred',
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
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
										name: 'Sur-Fred',
										surProduction: null
									}
								},
								{
									model: 'PRODUCTION',
									uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Mid-Fred',
									startDate: '2010-03-01',
									endDate: '2010-03-31',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Sur-Fred',
										surProduction: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: MID_FRED_MATERIAL_UUID,
									name: 'Mid-Fred',
									format: 'sub-collection of plays',
									year: 2010,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_FRED_MATERIAL_UUID,
										name: 'Sur-Fred',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												},
												{
													model: 'COMPANY',
													uuid: PLAYWRIGHTS_LTD_COMPANY_UUID,
													name: 'Playwrights Ltd'
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
									uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
									name: 'Mid-Plugh',
									startDate: '2009-07-01',
									endDate: '2009-07-31',
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
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
										name: 'Sur-Plugh',
										surProduction: null
									}
								},
								{
									model: 'PRODUCTION',
									uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
									name: 'Mid-Plugh',
									startDate: '2009-08-01',
									endDate: '2009-08-31',
									venue: {
										model: 'VENUE',
										uuid: WYNDHAMS_THEATRE_VENUE_UUID,
										name: 'Wyndham\'s Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
										name: 'Sur-Plugh',
										surProduction: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
									name: 'Mid-Plugh',
									format: 'sub-collection of plays',
									year: 2009,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
										name: 'Sur-Plugh',
										surMaterial: null
									},
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
							isWinner: true,
							type: 'Winner',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Mid-Wibble',
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
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
										name: 'Sur-Wibble',
										surProduction: null
									}
								},
								{
									model: 'PRODUCTION',
									uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Mid-Wibble',
									startDate: '2009-06-01',
									endDate: '2009-06-30',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
										name: 'Sur-Wibble',
										surProduction: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: MID_WIBBLE_MATERIAL_UUID,
									name: 'Mid-Wibble',
									format: 'sub-trilogy of plays',
									year: 2009,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_WIBBLE_MATERIAL_UUID,
										name: 'Sur-Wibble',
										surMaterial: null
									},
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
													uuid: MID_WALDO_MATERIAL_UUID,
													name: 'Mid-Waldo',
													format: 'sub-trilogy of novels',
													year: 1974,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WALDO_MATERIAL_UUID,
														name: 'Sur-Waldo',
														surMaterial: null
													},
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
							isWinner: false,
							type: 'Nomination',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
									name: 'Mid-Hoge',
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
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
										name: 'Sur-Hoge',
										surProduction: null
									}
								},
								{
									model: 'PRODUCTION',
									uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Mid-Hoge',
									startDate: '2008-06-01',
									endDate: '2008-06-30',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Sur-Hoge',
										surProduction: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: MID_HOGE_MATERIAL_UUID,
									name: 'Mid-Hoge',
									format: 'sub-collection of plays',
									year: 2008,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_HOGE_MATERIAL_UUID,
										name: 'Sur-Hoge',
										surMaterial: null
									},
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
						}
					]
				}
			];

			const { categories } = dramatistsMedal2008AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('John Doe (person): credit for directly nominated material', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
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
													uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_FRED_MATERIAL_UUID,
													name: 'Mid-Fred',
													format: 'sub-collection of plays',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_FRED_MATERIAL_UUID,
														name: 'Sur-Fred',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sur-Fred',
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
													uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Fred',
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
													uuid: SUR_FRED_MATERIAL_UUID,
													name: 'Sur-Fred',
													format: 'collection of plays',
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
				},
				{
					model: 'AWARD',
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
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
													uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_MATERIAL_UUID,
													name: 'Sub-Fred',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_FRED_MATERIAL_UUID,
														name: 'Mid-Fred',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_FRED_MATERIAL_UUID,
															name: 'Sur-Fred'
														}
													}
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

	describe('Playwrights Ltd (company): credit for directly nominated material', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
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
													uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_FRED_MATERIAL_UUID,
													name: 'Mid-Fred',
													format: 'sub-collection of plays',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_FRED_MATERIAL_UUID,
														name: 'Sur-Fred',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sur-Fred',
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
													uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Fred',
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
													uuid: SUR_FRED_MATERIAL_UUID,
													name: 'Sur-Fred',
													format: 'collection of plays',
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
				},
				{
					model: 'AWARD',
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
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
													uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_MATERIAL_UUID,
													name: 'Sub-Fred',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_FRED_MATERIAL_UUID,
														name: 'Mid-Fred',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_FRED_MATERIAL_UUID,
															name: 'Sur-Fred'
														}
													}
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

	describe('Sub-Plugh (play, 1899) (material): subsequent versions have nominations', () => {

		it('includes awards of its subsequent versions (and their respective sur-material and sur-sur-material) and its sur-material\'s and sur-sur-material\'s subsequent versions', () => {

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
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
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
														}
													}
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

			const { subsequentVersionMaterialAwards } = subPlughOriginalVersionMaterial.body;

			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Mid-Plugh (sub-collection of plays, 1899) (material): subsequent versions have nominations', () => {

		it('includes awards of its subsequent versions (and their respective sur-material and sub-materials) and its sur-material\'s and sub-materials\' subsequent versions', () => {

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
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
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
														}
													}
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

			const { subsequentVersionMaterialAwards } = midPlughOriginalVersionMaterial.body;

			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Sur-Plugh (collection of plays, 1899) (material): subsequent versions have nominations', () => {

		it('includes awards of its subsequent versions (and their respective sub-materials and sub-sub-materials) and its sub-materials\' and sub-sub-materials\' subsequent versions', () => {

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
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
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
														}
													}
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

			const { subsequentVersionMaterialAwards } = surPlughOriginalVersionMaterial.body;

			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Francis Flob (person): subsequent versions of their work have nominations', () => {

		it('includes awards of subsequent versions of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
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
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
														}
													}
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
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
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
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
														}
													}
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

	describe('Sub-Waldo (novel, 1974) (material): materials that used it as source material have nominations', () => {

		it('includes awards of materials (and their respective sur-material and sur-sur-material) that used it or its sur-material or sur-sur-material as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { sourcingMaterialAwards } = subWaldoMaterial.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Mid-Waldo (sub-trilogy of novels, 1974) (material): materials that used it as source material have nominations', () => {

		it('includes awards of materials (and their respective sur-material and sub-materials) that used it or its sur-material or sub-materials as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { sourcingMaterialAwards } = midWaldoMaterial.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Sur-Waldo (trilogy of trilogies of novels, 1974) (material): materials that used it as source material have nominations', () => {

		it('includes awards of materials (and their respective sub-materials and sub-sub-materials) that used it or its sub-materials or sub-sub-materials as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { sourcingMaterialAwards } = surWaldoMaterial.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Jane Roe (person): materials that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

	describe('Talyse Tata (person): materials to which they have granted rights have nominations', () => {

		it('includes awards of materials to which they have granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Hoge',
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
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
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
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
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
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
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
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
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
													uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Hoge',
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
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
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
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
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
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
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
