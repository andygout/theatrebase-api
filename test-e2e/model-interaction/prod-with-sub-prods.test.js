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
const STOPPARD_FESTIVAL_2002_FESTIVAL_UUID = '2002_FESTIVAL_UUID';
const STOPPARD_FESTIVAL_FESTIVAL_SERIES_UUID = 'STOPPARD_FESTIVAL_FESTIVAL_SERIES_UUID';
const VOYAGE_MATERIAL_UUID = 'VOYAGE_MATERIAL_UUID';
const TOM_STOPPARD_JR_PERSON_UUID = 'TOM_STOPPARD_JR_PERSON_UUID';
const THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID = 'THE_SUB_STRAUSSLER_GROUP_COMPANY_UUID';
const ALEXANDER_HERZEN_JR_CHARACTER_UUID = 'ALEXANDER_HERZEN_JR_CHARACTER_UUID';
const SHIPWRECK_MATERIAL_UUID = 'SHIPWRECK_MATERIAL_UUID';
const SALVAGE_MATERIAL_UUID = 'SALVAGE_MATERIAL_UUID';
const THE_COAST_OF_UTOPIA_MATERIAL_UUID = 'THE_COAST_OF_UTOPIA_MATERIAL_UUID';
const TOM_STOPPARD_SR_PERSON_UUID = 'TOM_STOPPARD_SR_PERSON_UUID';
const THE_SUR_STRÄUSSLER_GROUP_COMPANY_UUID = 'THE_SUR_STRAUSSLER_GROUP_COMPANY_UUID';
const ALEXANDER_HERZEN_SR_CHARACTER_UUID = 'ALEXANDER_HERZEN_SR_CHARACTER_UUID';
const VOYAGE_OLIVIER_PRODUCTION_UUID = 'VOYAGE_PRODUCTION_UUID';
const STOPPARD_SEASON_UUID = 'STOPPARD_SEASON_SEASON_UUID';
const TREVOR_NUNN_JR_PERSON_UUID = 'TREVOR_NUNN_JR_PERSON_UUID';
const SUB_NATIONAL_THEATRE_COMPANY_UUID = 'SUB_NATIONAL_THEATRE_COMPANY_COMPANY_UUID';
const NICK_STARR_JR_PERSON_UUID = 'NICK_STARR_JR_PERSON_UUID';
const STEPHEN_DILLANE_JR_PERSON_UUID = 'STEPHEN_DILLANE_JR_PERSON_UUID';
const STEVEN_EDIS_JR_PERSON_UUID = 'STEVEN_EDIS_JR_PERSON_UUID';
const SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID = 'SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID';
const MARK_BOUSIE_JR_PERSON_UUID = 'MARK_BOUSIE_JR_PERSON_UUID';
const FIONA_BARDSLEY_JR_PERSON_UUID = 'FIONA_BARDSLEY_JR_PERSON_UUID';
const SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID = 'SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID';
const SUE_MILLIN_JR_PERSON_UUID = 'SUE_MILLIN_JR_PERSON_UUID';
const THE_SUB_GUARDIAN_COMPANY_UUID = 'THE_SUB_GUARDIAN_COMPANY_UUID';
const MICHAEL_BILLINGTON_JR_PERSON_UUID = 'MICHAEL_BILLINGTON_JR_PERSON_UUID';
const SHIPWRECK_OLIVIER_PRODUCTION_UUID = 'SHIPWRECK_PRODUCTION_UUID';
const SALVAGE_OLIVIER_PRODUCTION_UUID = 'SALVAGE_PRODUCTION_UUID';
const THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID = 'THE_COAST_OF_UTOPIA_PRODUCTION_UUID';
const TREVOR_NUNN_SR_PERSON_UUID = 'TREVOR_NUNN_SR_PERSON_UUID';
const SUR_NATIONAL_THEATRE_COMPANY_UUID = 'SUR_NATIONAL_THEATRE_COMPANY_COMPANY_UUID';
const NICK_STARR_SR_PERSON_UUID = 'NICK_STARR_SR_PERSON_UUID';
const STEPHEN_DILLANE_SR_PERSON_UUID = 'STEPHEN_DILLANE_SR_PERSON_UUID';
const STEVEN_EDIS_SR_PERSON_UUID = 'STEVEN_EDIS_SR_PERSON_UUID';
const SUR_MUSICAL_DIRECTION_LTD_COMPANY_UUID = 'SUR_MUSICAL_DIRECTION_LTD_COMPANY_UUID';
const MARK_BOUSIE_SR_PERSON_UUID = 'MARK_BOUSIE_SR_PERSON_UUID';
const FIONA_BARDSLEY_SR_PERSON_UUID = 'FIONA_BARDSLEY_SR_PERSON_UUID';
const SUR_STAGE_MANAGEMENT_LTD_COMPANY_UUID = 'SUR_STAGE_MANAGEMENT_LTD_COMPANY_UUID';
const SUE_MILLIN_SR_PERSON_UUID = 'SUE_MILLIN_SR_PERSON_UUID';
const THE_SUR_GUARDIAN_COMPANY_UUID = 'THE_SUR_GUARDIAN_COMPANY_UUID';
const MICHAEL_BILLINGTON_SR_PERSON_UUID = 'MICHAEL_BILLINGTON_SR_PERSON_UUID';
const VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID = 'VOYAGE_2_PRODUCTION_UUID';
const VIVIAN_BEAUMONT_THEATRE_VENUE_UUID = 'VIVIAN_BEAUMONT_THEATRE_VENUE_UUID';
const PRE_REVOLUTION_RUSSIA_FESTIVAL_FESTIVAL_UUID = 'PRE_REVOLUTION_RUSSIA_FESTIVAL_FESTIVAL_UUID';
const SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID = 'SHIPWRECK_2_PRODUCTION_UUID';
const SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID = 'SALVAGE_2_PRODUCTION_UUID';
const THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID = 'THE_COAST_OF_UTOPIA_2_PRODUCTION_UUID';

let theCoastOfUtopiaOlivierProduction;
let voyageOlivierProduction;
let theCoastOfUtopiaVivianBeaumontProduction;
let voyageVivianBeaumontProduction;
let theCoastOfUtopiaMaterial;
let voyageMaterial;
let tomStoppardJrPerson;
let theSubSträusslerGroupCompany;
let nationalTheatreVenue;
let olivierTheatreVenue;
let stoppardSeason;
let stoppardFestival2002;
let trevorNunnJrPerson;
let subNationalTheatreCompany;
let nickStarrJrPerson;
let stephenDillaneJrPerson;
let stevenEdisJrPerson;
let subMusicalDirectionLtdCompany;
let markBousieJrPerson;
let fionaBardsleyJrPerson;
let subStageManagementLtdCompany;
let sueMillinJrPerson;
let theSubGuardianCompany;
let michaelBillingtonJrPerson;
let alexanderHerzenJrCharacter;

const sandbox = createSandbox();

describe('Production with sub-productions', () => {

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
			.post('/festivals')
			.send({
				name: '2002',
				festivalSeries: {
					name: 'Stoppard Festival'
				}
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Voyage',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard Jr'
							},
							{
								model: 'COMPANY',
								name: 'The Sub-Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Shipwreck',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard Jr'
							},
							{
								model: 'COMPANY',
								name: 'The Sub-Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Salvage',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard Jr'
							},
							{
								model: 'COMPANY',
								name: 'The Sub-Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Coast of Utopia',
				format: 'trilogy of plays',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard Sr'
							},
							{
								model: 'COMPANY',
								name: 'The Sur-Sträussler Group'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Voyage'
					},
					{
						name: 'Shipwreck'
					},
					{
						name: 'Salvage'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen Sr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Voyage',
				subtitle: 'In the Thrall of German Idealistic Philosophy',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'Voyage'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				season: {
					name: 'Stoppard Season'
				},
				festival: {
					name: '2002'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Trevor Nunn Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-National Theatre Company',
								members: [
									{
										name: 'Nick Starr Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane Jr',
						roles: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Musical Directors',
						entities: [
							{
								name: 'Steven Edis Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin Jr'
									}
								]
							}
						]
					}
				],
				reviews: [
					{
						url: 'https://www.theguardian.com/culture/2002/aug/04/voyage-review',
						date: '2002-08-04',
						publication: {
							name: 'The Sub-Guardian'
						},
						critic: {
							name: 'Michael Billington Jr'
						}
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Shipwreck',
				subtitle: 'In the Year of European Revolution',
				startDate: '2002-07-08',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'Shipwreck'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				season: {
					name: 'Stoppard Season'
				},
				festival: {
					name: '2002'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Trevor Nunn Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-National Theatre Company',
								members: [
									{
										name: 'Nick Starr Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane Jr',
						roles: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Musical Directors',
						entities: [
							{
								name: 'Steven Edis Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin Jr'
									}
								]
							}
						]
					}
				],
				reviews: [
					{
						url: 'https://www.theguardian.com/culture/2002/aug/05/shipwreck-review',
						date: '2002-08-05',
						publication: {
							name: 'The Sub-Guardian'
						},
						critic: {
							name: 'Michael Billington Jr'
						}
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Salvage',
				subtitle: 'The Emancipation of the Serfs',
				startDate: '2002-07-19',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'Salvage'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				season: {
					name: 'Stoppard Season'
				},
				festival: {
					name: '2002'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Trevor Nunn Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-National Theatre Company',
								members: [
									{
										name: 'Nick Starr Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane Jr',
						roles: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Musical Directors',
						entities: [
							{
								name: 'Steven Edis Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin Jr'
									}
								]
							}
						]
					}
				],
				reviews: [
					{
						url: 'https://www.theguardian.com/culture/2002/aug/06/salvage-review',
						date: '2002-08-06',
						publication: {
							name: 'The Sub-Guardian'
						},
						critic: {
							name: 'Michael Billington Jr'
						}
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Coast of Utopia',
				subtitle: 'Romantics and Revolutionaries in an Age of Emperors',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'The Coast of Utopia'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				season: {
					name: 'Stoppard Season'
				},
				festival: {
					name: '2002'
				},
				subProductions: [
					{
						uuid: VOYAGE_OLIVIER_PRODUCTION_UUID
					},
					{
						uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID
					},
					{
						uuid: SALVAGE_OLIVIER_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Trevor Nunn Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-National Theatre Company',
								members: [
									{
										name: 'Nick Starr Sr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane Sr',
						roles: [
							{
								name: 'Alexander Herzen Sr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Senior Musical Directors',
						entities: [
							{
								name: 'Steven Edis Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie Sr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Senior Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin Sr'
									}
								]
							}
						]
					}
				],
				reviews: [
					{
						url: 'https://www.theguardian.com/culture/2002/aug/07/the-coast-of-utopia-review',
						date: '2002-08-07',
						publication: {
							name: 'The Sur-Guardian'
						},
						critic: {
							name: 'Michael Billington Sr'
						}
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Voyage',
				subtitle: 'In the Thrall of German Idealistic Philosophy',
				startDate: '2006-10-17',
				pressDate: '2006-11-27',
				endDate: '2007-05-12',
				material: {
					name: 'Voyage'
				},
				venue: {
					name: 'Vivian Beaumont Theatre'
				},
				festival: {
					name: 'Pre-Revolution Russia Festival'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Shipwreck',
				subtitle: 'In the Year of European Revolution',
				startDate: '2006-12-05',
				pressDate: '2006-12-21',
				endDate: '2007-05-12',
				material: {
					name: 'Shipwreck'
				},
				venue: {
					name: 'Vivian Beaumont Theatre'
				},
				festival: {
					name: 'Pre-Revolution Russia Festival'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Salvage',
				subtitle: 'The Emancipation of the Serfs',
				startDate: '2007-01-31',
				pressDate: '2007-02-18',
				endDate: '2007-05-13',
				material: {
					name: 'Salvage'
				},
				venue: {
					name: 'Vivian Beaumont Theatre'
				},
				festival: {
					name: 'Pre-Revolution Russia Festival'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Coast of Utopia',
				subtitle: 'Romantics and Revolutionaries in an Age of Emperors',
				startDate: '2006-10-17',
				endDate: '2007-05-13',
				material: {
					name: 'The Coast of Utopia'
				},
				venue: {
					name: 'Vivian Beaumont Theatre'
				},
				festival: {
					name: 'Pre-Revolution Russia Festival'
				},
				subProductions: [
					{
						uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID
					},
					{
						uuid: SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID
					},
					{
						uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID
					}
				]
			});

		theCoastOfUtopiaOlivierProduction = await chai.request(app)
			.get(`/productions/${THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID}`);

		voyageOlivierProduction = await chai.request(app)
			.get(`/productions/${VOYAGE_OLIVIER_PRODUCTION_UUID}`);

		theCoastOfUtopiaVivianBeaumontProduction = await chai.request(app)
			.get(`/productions/${THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID}`);

		voyageVivianBeaumontProduction = await chai.request(app)
			.get(`/productions/${VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID}`);

		theCoastOfUtopiaMaterial = await chai.request(app)
			.get(`/materials/${THE_COAST_OF_UTOPIA_MATERIAL_UUID}`);

		voyageMaterial = await chai.request(app)
			.get(`/materials/${VOYAGE_MATERIAL_UUID}`);

		tomStoppardJrPerson = await chai.request(app)
			.get(`/people/${TOM_STOPPARD_JR_PERSON_UUID}`);

		theSubSträusslerGroupCompany = await chai.request(app)
			.get(`/companies/${THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID}`);

		nationalTheatreVenue = await chai.request(app)
			.get(`/venues/${NATIONAL_THEATRE_VENUE_UUID}`);

		olivierTheatreVenue = await chai.request(app)
			.get(`/venues/${OLIVIER_THEATRE_VENUE_UUID}`);

		stoppardSeason = await chai.request(app)
			.get(`/seasons/${STOPPARD_SEASON_UUID}`);

		stoppardFestival2002 = await chai.request(app)
			.get(`/festivals/${STOPPARD_FESTIVAL_2002_FESTIVAL_UUID}`);

		trevorNunnJrPerson = await chai.request(app)
			.get(`/people/${TREVOR_NUNN_JR_PERSON_UUID}`);

		subNationalTheatreCompany = await chai.request(app)
			.get(`/companies/${SUB_NATIONAL_THEATRE_COMPANY_UUID}`);

		nickStarrJrPerson = await chai.request(app)
			.get(`/people/${NICK_STARR_JR_PERSON_UUID}`);

		stephenDillaneJrPerson = await chai.request(app)
			.get(`/people/${STEPHEN_DILLANE_JR_PERSON_UUID}`);

		stevenEdisJrPerson = await chai.request(app)
			.get(`/people/${STEVEN_EDIS_JR_PERSON_UUID}`);

		subMusicalDirectionLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID}`);

		markBousieJrPerson = await chai.request(app)
			.get(`/people/${MARK_BOUSIE_JR_PERSON_UUID}`);

		fionaBardsleyJrPerson = await chai.request(app)
			.get(`/people/${FIONA_BARDSLEY_JR_PERSON_UUID}`);

		subStageManagementLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID}`);

		sueMillinJrPerson = await chai.request(app)
			.get(`/people/${SUE_MILLIN_JR_PERSON_UUID}`);

		theSubGuardianCompany = await chai.request(app)
			.get(`/companies/${THE_SUB_GUARDIAN_COMPANY_UUID}`);

		michaelBillingtonJrPerson = await chai.request(app)
			.get(`/people/${MICHAEL_BILLINGTON_JR_PERSON_UUID}`);

		alexanderHerzenJrCharacter = await chai.request(app)
			.get(`/characters/${ALEXANDER_HERZEN_JR_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Coast of Utopia at Olivier Theatre (production with sub-productions that have a sur-venue)', () => {

		it('includes its sub-productions', () => {

			const expectedSubProductions = [
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					subtitle: 'In the Thrall of German Idealistic Philosophy',
					startDate: '2002-06-27',
					pressDate: '2002-08-03',
					endDate: '2002-11-23',
					material: {
						model: 'MATERIAL',
						uuid: VOYAGE_MATERIAL_UUID,
						name: 'Voyage',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
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
					season: {
						model: 'SEASON',
						uuid: STOPPARD_SEASON_UUID,
						name: 'Stoppard Season'
					},
					festival: {
						model: 'FESTIVAL',
						uuid: STOPPARD_FESTIVAL_2002_FESTIVAL_UUID,
						name: '2002',
						festivalSeries: {
							model: 'FESTIVAL_SERIES',
							uuid: STOPPARD_FESTIVAL_FESTIVAL_SERIES_UUID,
							name: 'Stoppard Festival'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
									name: 'Alexander Herzen Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					],
					reviews: [
						{
							model: 'REVIEW',
							url: 'https://www.theguardian.com/culture/2002/aug/04/voyage-review',
							date: '2002-08-04',
							publication: {
								model: 'COMPANY',
								uuid: THE_SUB_GUARDIAN_COMPANY_UUID,
								name: 'The Sub-Guardian'
							},
							critic: {
								model: 'PERSON',
								uuid: MICHAEL_BILLINGTON_JR_PERSON_UUID,
								name: 'Michael Billington Jr'
							}
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					subtitle: 'In the Year of European Revolution',
					startDate: '2002-07-08',
					pressDate: '2002-08-03',
					endDate: '2002-11-23',
					material: {
						model: 'MATERIAL',
						uuid: SHIPWRECK_MATERIAL_UUID,
						name: 'Shipwreck',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
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
					season: {
						model: 'SEASON',
						uuid: STOPPARD_SEASON_UUID,
						name: 'Stoppard Season'
					},
					festival: {
						model: 'FESTIVAL',
						uuid: STOPPARD_FESTIVAL_2002_FESTIVAL_UUID,
						name: '2002',
						festivalSeries: {
							model: 'FESTIVAL_SERIES',
							uuid: STOPPARD_FESTIVAL_FESTIVAL_SERIES_UUID,
							name: 'Stoppard Festival'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
									name: 'Alexander Herzen Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					],
					reviews: [
						{
							model: 'REVIEW',
							url: 'https://www.theguardian.com/culture/2002/aug/05/shipwreck-review',
							date: '2002-08-05',
							publication: {
								model: 'COMPANY',
								uuid: THE_SUB_GUARDIAN_COMPANY_UUID,
								name: 'The Sub-Guardian'
							},
							critic: {
								model: 'PERSON',
								uuid: MICHAEL_BILLINGTON_JR_PERSON_UUID,
								name: 'Michael Billington Jr'
							}
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					subtitle: 'The Emancipation of the Serfs',
					startDate: '2002-07-19',
					pressDate: '2002-08-03',
					endDate: '2002-11-23',
					material: {
						model: 'MATERIAL',
						uuid: SALVAGE_MATERIAL_UUID,
						name: 'Salvage',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
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
					season: {
						model: 'SEASON',
						uuid: STOPPARD_SEASON_UUID,
						name: 'Stoppard Season'
					},
					festival: {
						model: 'FESTIVAL',
						uuid: STOPPARD_FESTIVAL_2002_FESTIVAL_UUID,
						name: '2002',
						festivalSeries: {
							model: 'FESTIVAL_SERIES',
							uuid: STOPPARD_FESTIVAL_FESTIVAL_SERIES_UUID,
							name: 'Stoppard Festival'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
									name: 'Alexander Herzen Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					],
					reviews: [
						{
							model: 'REVIEW',
							url: 'https://www.theguardian.com/culture/2002/aug/06/salvage-review',
							date: '2002-08-06',
							publication: {
								model: 'COMPANY',
								uuid: THE_SUB_GUARDIAN_COMPANY_UUID,
								name: 'The Sub-Guardian'
							},
							critic: {
								model: 'PERSON',
								uuid: MICHAEL_BILLINGTON_JR_PERSON_UUID,
								name: 'Michael Billington Jr'
							}
						}
					]
				}
			];

			const { subProductions } = theCoastOfUtopiaOlivierProduction.body;

			expect(subProductions).to.deep.equal(expectedSubProductions);

		});

	});

	describe('Voyage at Olivier Theatre (production with sur-production that has a sur-venue)', () => {

		it('includes The Coast of Utopia at Olivier Theatre as its sur-production', () => {

			const expectedSurProduction = {
				model: 'PRODUCTION',
				uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
				name: 'The Coast of Utopia',
				subtitle: 'Romantics and Revolutionaries in an Age of Emperors',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					model: 'MATERIAL',
					uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
					name: 'The Coast of Utopia',
					format: 'trilogy of plays',
					year: 2002,
					surMaterial: null,
					writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_SR_PERSON_UUID,
										name: 'Tom Stoppard Sr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUR_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sur-Sträussler Group'
									}
								]
							}
					]
				},
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
				season: {
					model: 'SEASON',
					uuid: STOPPARD_SEASON_UUID,
					name: 'Stoppard Season'
				},
				festival: {
					model: 'FESTIVAL',
					uuid: STOPPARD_FESTIVAL_2002_FESTIVAL_UUID,
					name: '2002',
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						uuid: STOPPARD_FESTIVAL_FESTIVAL_SERIES_UUID,
						name: 'Stoppard Festival'
					}
				},
				surProduction: null,
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: TREVOR_NUNN_SR_PERSON_UUID,
								name: 'Trevor Nunn Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_NATIONAL_THEATRE_COMPANY_UUID,
								name: 'Sur-National Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: NICK_STARR_SR_PERSON_UUID,
										name: 'Nick Starr Sr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						uuid: STEPHEN_DILLANE_SR_PERSON_UUID,
						name: 'Stephen Dillane Sr',
						roles: [
							{
								model: 'CHARACTER',
								uuid: ALEXANDER_HERZEN_SR_CHARACTER_UUID,
								name: 'Alexander Herzen Sr',
								qualifier: null,
								isAlternate: false
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Senior Musical Directors',
						entities: [
							{
								model: 'PERSON',
								uuid: STEVEN_EDIS_SR_PERSON_UUID,
								name: 'Steven Edis Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Sur-Musical Direction Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: MARK_BOUSIE_SR_PERSON_UUID,
										name: 'Mark Bousie Sr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Senior Stage Managers',
						entities: [
							{
								model: 'PERSON',
								uuid: FIONA_BARDSLEY_SR_PERSON_UUID,
								name: 'Fiona Bardsley Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sur-Stage Management Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: SUE_MILLIN_SR_PERSON_UUID,
										name: 'Sue Millin Sr'
									}
								]
							}
						]
					}
				],
				reviews: [
					{
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2002/aug/07/the-coast-of-utopia-review',
						date: '2002-08-07',
						publication: {
							model: 'COMPANY',
							uuid: THE_SUR_GUARDIAN_COMPANY_UUID,
							name: 'The Sur-Guardian'
						},
						critic: {
							model: 'PERSON',
							uuid: MICHAEL_BILLINGTON_SR_PERSON_UUID,
							name: 'Michael Billington Sr'
						}
					}
				]
			};

			const { surProduction } = voyageOlivierProduction.body;

			expect(surProduction).to.deep.equal(expectedSurProduction);

		});

	});

	describe('The Coast of Utopia at Vivian Beaumont Theatre (production with sub-productions that do not have a sur-venue)', () => {

		it('includes its sub-productions', () => {

			const expectedSubProductions = [
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Voyage',
					subtitle: 'In the Thrall of German Idealistic Philosophy',
					startDate: '2006-10-17',
					pressDate: '2006-11-27',
					endDate: '2007-05-12',
					material: {
						model: 'MATERIAL',
						uuid: VOYAGE_MATERIAL_UUID,
						name: 'Voyage',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					season: null,
					festival: {
						model: 'FESTIVAL',
						uuid: PRE_REVOLUTION_RUSSIA_FESTIVAL_FESTIVAL_UUID,
						name: 'Pre-Revolution Russia Festival',
						festivalSeries: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Shipwreck',
					subtitle: 'In the Year of European Revolution',
					startDate: '2006-12-05',
					pressDate: '2006-12-21',
					endDate: '2007-05-12',
					material: {
						model: 'MATERIAL',
						uuid: SHIPWRECK_MATERIAL_UUID,
						name: 'Shipwreck',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					season: null,
					festival: {
						model: 'FESTIVAL',
						uuid: PRE_REVOLUTION_RUSSIA_FESTIVAL_FESTIVAL_UUID,
						name: 'Pre-Revolution Russia Festival',
						festivalSeries: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				},
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Salvage',
					subtitle: 'The Emancipation of the Serfs',
					startDate: '2007-01-31',
					pressDate: '2007-02-18',
					endDate: '2007-05-13',
					material: {
						model: 'MATERIAL',
						uuid: SALVAGE_MATERIAL_UUID,
						name: 'Salvage',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					season: null,
					festival: {
						model: 'FESTIVAL',
						uuid: PRE_REVOLUTION_RUSSIA_FESTIVAL_FESTIVAL_UUID,
						name: 'Pre-Revolution Russia Festival',
						festivalSeries: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [],
					reviews: []
				}
			];

			const { subProductions } = theCoastOfUtopiaVivianBeaumontProduction.body;

			expect(subProductions).to.deep.equal(expectedSubProductions);

		});

	});

	describe('Voyage at Vivian Beaumont Theatre (production with sur-production that does not have a sur-venue)', () => {

		it('includes The Coast of Utopia at Olivier Theatre as its sur-production', () => {

			const expectedSurProduction = {
				model: 'PRODUCTION',
				uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
				name: 'The Coast of Utopia',
				subtitle: 'Romantics and Revolutionaries in an Age of Emperors',
				startDate: '2006-10-17',
				pressDate: null,
				endDate: '2007-05-13',
				material: {
					model: 'MATERIAL',
					uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
					name: 'The Coast of Utopia',
					format: 'trilogy of plays',
					year: 2002,
					surMaterial: null,
					writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_SR_PERSON_UUID,
										name: 'Tom Stoppard Sr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUR_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sur-Sträussler Group'
									}
								]
							}
					]
				},
				venue: {
					model: 'VENUE',
					uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
					name: 'Vivian Beaumont Theatre',
					surVenue: null
				},
				season: null,
				festival: {
					model: 'FESTIVAL',
					uuid: PRE_REVOLUTION_RUSSIA_FESTIVAL_FESTIVAL_UUID,
					name: 'Pre-Revolution Russia Festival',
					festivalSeries: null
				},
				surProduction: null,
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: [],
				reviews: []
			};

			const { surProduction } = voyageVivianBeaumontProduction.body;

			expect(surProduction).to.deep.equal(expectedSurProduction);

		});

	});

	describe('The Coast of Utopia (material)', () => {

		it('includes its productions (but with no sur-productions as does not apply)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'The Coast of Utopia',
					startDate: '2006-10-17',
					endDate: '2007-05-13',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
					name: 'The Coast of Utopia',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
			];

			const { productions } = theCoastOfUtopiaMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Voyage (material)', () => {

		it('includes its productions and their sur-productions', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2006-10-17',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { productions } = voyageMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Tom Stoppard Jr (person)', () => {

		it('includes productions of materials they have written, including the sur-production', () => {

			const expectedMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2007-01-31',
					endDate: '2007-05-13',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2006-12-05',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2006-10-17',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { materialProductions } = tomStoppardJrPerson.body;

			expect(materialProductions).to.deep.equal(expectedMaterialProductions);

		});

	});

	describe('The Sub-Sträussler Group (company)', () => {

		it('includes productions of materials they have written, including the sur-production', () => {

			const expectedMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2007-01-31',
					endDate: '2007-05-13',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2006-12-05',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2006-10-17',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { materialProductions } = theSubSträusslerGroupCompany.body;

			expect(materialProductions).to.deep.equal(expectedMaterialProductions);

		});

	});

	describe('National Theatre (venue)', () => {

		it('includes productions at this venue, including the specific sub-venue and corresponding sur-productions; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					subVenue: {
						model: 'VENUE',
						name: 'Olivier Theatre',
						uuid: OLIVIER_THEATRE_VENUE_UUID
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					subVenue: {
						model: 'VENUE',
						name: 'Olivier Theatre',
						uuid: OLIVIER_THEATRE_VENUE_UUID
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					subVenue: {
						model: 'VENUE',
						name: 'Olivier Theatre',
						uuid: OLIVIER_THEATRE_VENUE_UUID
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { productions } = nationalTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Olivier Theatre (venue)', () => {

		it('includes productions at this venue and corresponding sur-productions; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { productions } = olivierTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Stoppard Season (season)', () => {

		it('includes productions in this season and corresponding sur-productions; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { productions } = stoppardSeason.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Stoppard Festival 2002 (festival)', () => {

		it('includes productions in this festival and corresponding sur-productions; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { productions } = stoppardFestival2002.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Trevor Nunn Jr (person)', () => {

		it('includes productions for which they have a producer credit, including the sur-production', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = trevorNunnJrPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Sub-National Theatre Company (company)', () => {

		it('includes productions for which they have a producer credit, including the sur-production', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = subNationalTheatreCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Nick Starr Jr (person)', () => {

		it('includes productions for which they have a producer credit, including the sur-production', () => {
			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = nickStarrJrPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Stephen Dillane Jr (person)', () => {

		it('includes productions for which they have a cast credit, including the sur-production', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
							name: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
							name: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
							name: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = stephenDillaneJrPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Steven Edis Jr (person)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = stevenEdisJrPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Sub-Musical Direction Ltd (company)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_JR_PERSON_UUID,
									name: 'Mark Bousie Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_JR_PERSON_UUID,
									name: 'Mark Bousie Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_JR_PERSON_UUID,
									name: 'Mark Bousie Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = subMusicalDirectionLtdCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Mark Bousie Jr (person)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Sub-Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Sub-Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Sub-Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = markBousieJrPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Fiona Bardsley Jr (person)', () => {

		it('includes productions for which they have a crew credit, including the sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { crewProductions } = fionaBardsleyJrPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Sub-Stage Management Ltd (company)', () => {

		it('includes productions for which they have a crew credit, including the sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_JR_PERSON_UUID,
									name: 'Sue Millin Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_JR_PERSON_UUID,
									name: 'Sue Millin Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_JR_PERSON_UUID,
									name: 'Sue Millin Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = subStageManagementLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Sue Millin Jr (person)', () => {

		it('includes productions for which they have a crew credit, including the sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = sueMillinJrPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('The Sub-Guardian (company)', () => {

		it('includes productions they have reviewed as a publication, including the sur-production', () => {

			const expectedReviewPublicationProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					review: {
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2002/aug/06/salvage-review',
						date: '2002-08-06',
						critic: {
							model: 'PERSON',
							uuid: MICHAEL_BILLINGTON_JR_PERSON_UUID,
							name: 'Michael Billington Jr'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					review: {
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2002/aug/05/shipwreck-review',
						date: '2002-08-05',
						critic: {
							model: 'PERSON',
							uuid: MICHAEL_BILLINGTON_JR_PERSON_UUID,
							name: 'Michael Billington Jr'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					review: {
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2002/aug/04/voyage-review',
						date: '2002-08-04',
						critic: {
							model: 'PERSON',
							uuid: MICHAEL_BILLINGTON_JR_PERSON_UUID,
							name: 'Michael Billington Jr'
						}
					}
				}
			];

			const { reviewPublicationProductions } = theSubGuardianCompany.body;

			expect(reviewPublicationProductions).to.deep.equal(expectedReviewPublicationProductions);

		});

	});

	describe('Michael Billington Jr (person)', () => {

		it('includes productions they have reviewed as a critic, including the sur-production', () => {

			const expectedReviewCriticProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					review: {
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2002/aug/06/salvage-review',
						date: '2002-08-06',
						publication: {
							model: 'COMPANY',
							uuid: THE_SUB_GUARDIAN_COMPANY_UUID,
							name: 'The Sub-Guardian'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					review: {
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2002/aug/05/shipwreck-review',
						date: '2002-08-05',
						publication: {
							model: 'COMPANY',
							uuid: THE_SUB_GUARDIAN_COMPANY_UUID,
							name: 'The Sub-Guardian'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					review: {
						model: 'REVIEW',
						url: 'https://www.theguardian.com/culture/2002/aug/04/voyage-review',
						date: '2002-08-04',
						publication: {
							model: 'COMPANY',
							uuid: THE_SUB_GUARDIAN_COMPANY_UUID,
							name: 'The Sub-Guardian'
						}
					}
				}
			];

			const { reviewCriticProductions } = michaelBillingtonJrPerson.body;

			expect(reviewCriticProductions).to.deep.equal(expectedReviewCriticProductions);

		});

	});

	describe('Alexander Herzen Jr (character)', () => {

		it('includes productions in which character was portrayed, including the sur-production', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roleName: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roleName: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roleName: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = alexanderHerzenJrCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('productions list', () => {

		it('includes productions and corresponding sur-productions; will exclude sur-productions as these will be included via their sub-productions', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2007-01-31',
					endDate: '2007-05-13',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2006-12-05',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2006-10-17',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
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
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
