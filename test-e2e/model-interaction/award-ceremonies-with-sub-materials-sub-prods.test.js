import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Award ceremonies with sub-materials and sub-productions', () => {

	chai.use(chaiHttp);

	const ROYAL_COURT_THEATRE_VENUE_UUID = '2';
	const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '3';
	const SUB_HOGE_MATERIAL_UUID = '6';
	const SUR_HOGE_MATERIAL_UUID = '11';
	const SUB_WALDO_MATERIAL_UUID = '16';
	const SUR_WALDO_MATERIAL_UUID = '21';
	const SUB_WIBBLE_MATERIAL_UUID = '27';
	const SUR_WIBBLE_MATERIAL_UUID = '34';
	const SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID = '38';
	const NOËL_COWARD_THEATRE_VENUE_UUID = '40';
	const SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID = '41';
	const SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '44';
	const SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '47';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '57';
	const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '58';
	const CONOR_CORGE_PERSON_UUID = '59';
	const STAGECRAFT_LTD_COMPANY_UUID = '60';
	const FERDINAND_FOO_PERSON_UUID = '61';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '71';
	const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '72';

	let laurenceOlivierAwards2020AwardCeremony;
	let eveningStandardTheatreAwards2019AwardCeremony;
	let conorCorgePerson;
	let stagecraftLtdCompany;
	let ferdinandFooPerson;
	let subHogeNoëlCowardProduction;
	let surHogeNoëlCowardProduction;
	let subWibbleJerwoodTheatreUpstairsProduction;
	let surWibbleJerwoodTheatreUpstairsProduction;
	let subWibbleMaterial;
	let surWibbleMaterial;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

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
				name: 'Sub-Waldo',
				format: 'novel',
				year: '2017'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Waldo',
				format: 'trilogy of novels',
				year: '2017',
				subMaterials: [
					{
						name: 'Sub-Waldo'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble',
				format: 'play',
				year: '2019',
				writingCredits: [
					{
						name: 'adapted from',
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
				name: 'Sur-Wibble',
				format: 'trilogy of plays',
				year: '2019',
				writingCredits: [
					{
						name: 'adapted from',
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
						name: 'Sub-Wibble'
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
				name: 'Sub-Wibble',
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
						uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
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
										uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Hoge'
									},
									{
										name: 'Sub-Wibble'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
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

		laurenceOlivierAwards2020AwardCeremony = await chai.request(app)
			.get(`/awards/ceremonies/${LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`);

		eveningStandardTheatreAwards2019AwardCeremony = await chai.request(app)
			.get(`/awards/ceremonies/${EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID}`);

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

		subWibbleJerwoodTheatreUpstairsProduction = await chai.request(app)
			.get(`/productions/${SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID}`);

		surWibbleJerwoodTheatreUpstairsProduction = await chai.request(app)
			.get(`/productions/${SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID}`);

		subWibbleMaterial = await chai.request(app)
			.get(`/materials/${SUB_WIBBLE_MATERIAL_UUID}`);

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
										name: 'Sur-Hoge'
									}
								},
								{
									model: 'PRODUCTION',
									uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Sub-Wibble',
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
										name: 'Sur-Wibble'
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
										name: 'Sur-Hoge'
									},
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: SUB_WIBBLE_MATERIAL_UUID,
									name: 'Sub-Wibble',
									format: 'play',
									year: 2019,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_WIBBLE_MATERIAL_UUID,
										name: 'Sur-Wibble'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'adapted from',
											entities: [
												{
													model: 'MATERIAL',
													uuid: SUB_WALDO_MATERIAL_UUID,
													name: 'Sub-Waldo',
													format: 'novel',
													year: 2017,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WALDO_MATERIAL_UUID,
														name: 'Sur-Waldo'
													},
													writingCredits: []
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
									format: 'trilogy of plays',
									year: 2019,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'adapted from',
											entities: [
												{
													model: 'MATERIAL',
													uuid: SUR_WALDO_MATERIAL_UUID,
													name: 'Sur-Waldo',
													format: 'trilogy of novels',
													year: 2017,
													surMaterial: null,
													writingCredits: []
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
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
													format: 'trilogy of plays',
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														name: 'Sur-Wibble'
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
													format: 'trilogy of plays',
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														name: 'Sur-Wibble'
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
													format: 'trilogy of plays',
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														name: 'Sur-Wibble'
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
											recipientProduction: {
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
											},
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
													format: 'trilogy of plays',
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
											recipientProduction: null,
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
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														name: 'Sur-Wibble'
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
											recipientProduction: null,
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
													format: 'trilogy of plays',
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
											recipientProduction: {
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
											},
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
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														name: 'Sur-Wibble'
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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

	describe('Sub-Wibble at Jerwood Theatre Upstairs (production)', () => {

		it('includes its and its sur-production\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
											recipientProduction: {
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
											},
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
													format: 'trilogy of plays',
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
											recipientProduction: null,
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
														name: 'Sur-Hoge'
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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

			const { awards } = subWibbleJerwoodTheatreUpstairsProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Wibble at Jerwood Theatre Upstairs (production)', () => {

		it('includes its and its sub-productions\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
											recipientProduction: null,
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
													format: 'trilogy of plays',
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Sub-Wibble',
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
											},
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
														name: 'Sur-Hoge'
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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

	describe('Sub-Wibble (play) (material)', () => {

		it('includes its and its sur-material\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: SUR_WIBBLE_MATERIAL_UUID,
												name: 'Sur-Wibble',
												format: 'trilogy of plays',
												year: 2019
											},
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
											recipientMaterial: null,
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														name: 'Sur-Wibble'
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
														name: 'Sur-Hoge'
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

			const { awards } = subWibbleMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Wibble (trilogy of plays) (material)', () => {

		it('includes its and its sub-materials\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
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
											recipientMaterial: null,
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
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
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
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: SUB_WIBBLE_MATERIAL_UUID,
												name: 'Sub-Wibble',
												format: 'play',
												year: 2019
											},
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
														name: 'Sur-Hoge'
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														name: 'Sur-Wibble'
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
														name: 'Sur-Hoge'
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