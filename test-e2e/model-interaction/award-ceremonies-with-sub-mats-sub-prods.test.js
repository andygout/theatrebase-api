import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const ROYAL_COURT_THEATRE_VENUE_UUID = 'ROYAL_COURT_THEATRE_VENUE_UUID';
const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = 'JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID';
const SUB_HOGE_MATERIAL_UUID = 'SUB_HOGE_MATERIAL_UUID';
const SUR_HOGE_MATERIAL_UUID = 'SUR_HOGE_MATERIAL_UUID';
const SUB_WIBBLE_PART_I_MATERIAL_UUID = 'SUB_WIBBLE_PART_I_MATERIAL_UUID';
const SUB_WIBBLE_PART_II_MATERIAL_UUID = 'SUB_WIBBLE_PART_II_MATERIAL_UUID';
const SUR_WIBBLE_MATERIAL_UUID = 'SUR_WIBBLE_MATERIAL_UUID';
const SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID = 'SUB_HOGE_PRODUCTION_UUID';
const NOËL_COWARD_THEATRE_VENUE_UUID = 'NOEL_COWARD_THEATRE_VENUE_UUID';
const SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID = 'SUR_HOGE_PRODUCTION_UUID';
const SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = 'SUB_WIBBLE_PART_I_PRODUCTION_UUID';
const SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = 'SUB_WIBBLE_PART_II_PRODUCTION_UUID';
const SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = 'SUR_WIBBLE_PRODUCTION_UUID';
const LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID = '2020_2_AWARD_CEREMONY_UUID';
const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'LAURENCE_OLIVIER_AWARDS_AWARD_UUID';
const CONOR_CORGE_PERSON_UUID = 'CONOR_CORGE_PERSON_UUID';
const STAGECRAFT_LTD_COMPANY_UUID = 'STAGECRAFT_LTD_COMPANY_UUID';
const FERDINAND_FOO_PERSON_UUID = 'FERDINAND_FOO_PERSON_UUID';
const EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID = '2019_2_AWARD_CEREMONY_UUID';
const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID';
const CRITICS_CIRCLE_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID = '2019_4_AWARD_CEREMONY_UUID';
const CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID = 'CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID';

let laurenceOlivierAwards2020AwardCeremony;
let eveningStandardTheatreAwards2019AwardCeremony;
let conorCorgePerson;
let stagecraftLtdCompany;
let ferdinandFooPerson;
let subHogeNoëlCowardProduction;
let surHogeNoëlCowardProduction;
let subWibblePartIJerwoodTheatreUpstairsProduction;
let surWibbleJerwoodTheatreUpstairsProduction;
let subWibblePartIMaterial;
let surWibbleMaterial;

const sandbox = createSandbox();

describe('Award ceremonies with sub-materials and sub-productions', () => {

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
						name: 'Jerwood Theatre Upstairs'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Hoge',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Hoge',
				format: 'collection of plays',
				year: '2019',
				subMaterials: [
					{
						name: 'Sub-Hoge'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble: Part I',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble: Part II',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Wibble',
				format: 'collection of plays',
				year: '2019',
				subMaterials: [
					{
						name: 'Sub-Wibble: Part I'
					},
					{
						name: 'Sub-Wibble: Part II'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Hoge',
				startDate: '2019-05-01',
				endDate: '2019-05-31',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Hoge',
				startDate: '2019-05-01',
				endDate: '2019-05-31',
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
				name: 'Sub-Wibble: Part I',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part II',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
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
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											}
										]
									}
								],
								productions: [
									{
										uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID
									},
									{
										uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Hoge'
									},
									{
										name: 'Sub-Wibble: Part I'
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
						name: 'Best Random Role',
						nominations: [
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
												name: 'Ferdinand Foo'
											}
										]
									}
								],
								productions: [
									{
										uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID
									},
									{
										uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Hoge'
									},
									{
										name: 'Sur-Wibble'
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
						name: 'Most Remarkable Role',
						nominations: [
							{
								isWinner: true,
								productions: [
									{
										uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Wibble: Part II'
									}
								]
							}
						]
					}
				]
			});

		laurenceOlivierAwards2020AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID}`);

		eveningStandardTheatreAwards2019AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID}`);

		conorCorgePerson = await chai.request(app)
			.get(`/people/${CONOR_CORGE_PERSON_UUID}`);

		stagecraftLtdCompany = await chai.request(app)
			.get(`/companies/${STAGECRAFT_LTD_COMPANY_UUID}`);

		ferdinandFooPerson = await chai.request(app)
			.get(`/people/${FERDINAND_FOO_PERSON_UUID}`);

		subHogeNoëlCowardProduction = await chai.request(app)
			.get(`/productions/${SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID}`);

		surHogeNoëlCowardProduction = await chai.request(app)
			.get(`/productions/${SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID}`);

		subWibblePartIJerwoodTheatreUpstairsProduction = await chai.request(app)
			.get(`/productions/${SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID}`);

		surWibbleJerwoodTheatreUpstairsProduction = await chai.request(app)
			.get(`/productions/${SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID}`);

		subWibblePartIMaterial = await chai.request(app)
			.get(`/materials/${SUB_WIBBLE_PART_I_MATERIAL_UUID}`);

		surWibbleMaterial = await chai.request(app)
			.get(`/materials/${SUR_WIBBLE_MATERIAL_UUID}`);

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
							isWinner: false,
							type: 'Nomination',
							entities: [
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
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										}
									]
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Sub-Hoge',
									startDate: '2019-05-01',
									endDate: '2019-05-31',
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
								},
								{
									model: 'PRODUCTION',
									uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Sub-Wibble: Part I',
									startDate: '2019-06-01',
									endDate: '2019-06-30',
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
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUB_HOGE_MATERIAL_UUID,
									name: 'Sub-Hoge',
									format: 'play',
									year: 2019,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_HOGE_MATERIAL_UUID,
										name: 'Sur-Hoge',
										surMaterial: null
									},
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
									name: 'Sub-Wibble: Part I',
									format: 'play',
									year: 2019,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_WIBBLE_MATERIAL_UUID,
										name: 'Sur-Wibble',
										surMaterial: null
									},
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

	describe('Evening Standard Theatre Awards 2019 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Random Role',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'Winner',
							entities: [
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
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										}
									]
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Sur-Hoge',
									startDate: '2019-05-01',
									endDate: '2019-05-31',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Sur-Wibble',
									startDate: '2019-06-01',
									endDate: '2019-06-30',
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
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUR_HOGE_MATERIAL_UUID,
									name: 'Sur-Hoge',
									format: 'collection of plays',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: SUR_WIBBLE_MATERIAL_UUID,
									name: 'Sur-Wibble',
									format: 'collection of plays',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						}
					]
				}
			];

			const { categories } = eveningStandardTheatreAwards2019AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Conor Corge (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
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
									name: 'Best Random Role',
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'collection of plays',
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
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
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
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											members: [
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
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'collection of plays',
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
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
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
				}
			];

			const { awards } = stagecraftLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Ferdinand Foo (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
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
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: {
												model: 'COMPANY',
												uuid: STAGECRAFT_LTD_COMPANY_UUID,
												name: 'Stagecraft Ltd',
												coMembers: []
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
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'collection of plays',
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
												uuid: STAGECRAFT_LTD_COMPANY_UUID,
												name: 'Stagecraft Ltd',
												coMembers: []
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
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
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
				}
			];

			const { awards } = ferdinandFooPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Hoge at Noël Coward Theatre (production)', () => {

		it('includes its and its sur-production\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
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
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'collection of plays',
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
											recipientProductions: [],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
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
				}
			];

			const { awards } = subHogeNoëlCowardProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Hoge at Noël Coward Theatre (production)', () => {

		it('includes its and its sub-productions\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
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
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProductions: [],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'collection of plays',
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
											recipientProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
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
				}
			];

			const { awards } = surHogeNoëlCowardProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Wibble: Part I at Jerwood Theatre Upstairs (production)', () => {

		it('includes its and its sur-production\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
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
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'collection of plays',
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
											recipientProductions: [],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
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
				}
			];

			const { awards } = subWibblePartIJerwoodTheatreUpstairsProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Wibble at Jerwood Theatre Upstairs (production)', () => {

		it('includes its and its sub-productions\' award nominations, in the latter case specifying the recipient', () => {

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
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part II',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											entities: [],
											coProductions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
													name: 'Sub-Wibble: Part II',
													format: 'play',
													year: 2019,
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
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProductions: [],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'collection of plays',
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
											recipientProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
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
				}
			];

			const { awards } = surWibbleJerwoodTheatreUpstairsProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Wibble: Part I (play) (material)', () => {

		it('includes its and its sur-material\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
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
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'collection of plays',
													year: 2019
												}
											],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
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
											recipientMaterials: [],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
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
				}
			];

			const { awards } = subWibblePartIMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Wibble (collection of plays) (material)', () => {

		it('includes its and its sub-materials\' award nominations, in the latter case specifying the recipient', () => {

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
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
													name: 'Sub-Wibble: Part II',
													format: 'play',
													year: 2019
												}
											],
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part II',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
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
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterials: [],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
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
											recipientMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019
												}
											],
											entities: [
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
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
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
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
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
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
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
				}
			];

			const { awards } = surWibbleMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

});
