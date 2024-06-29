import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID = 'GENESIS_MATERIAL_UUID';
const RICHARD_BANCROFT_PERSON_UUID = 'RICHARD_BANCROFT_PERSON_UUID';
const THE_CANTERBURY_EDITORS_COMPANY_UUID = 'THE_CANTERBURY_EDITORS_COMPANY_UUID';
const THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID = 'THE_OLD_TESTAMENT_MATERIAL_UUID';
const THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID = 'THE_BIBLE_KING_JAMES_VERSION_MATERIAL_UUID';
const GODBLOG_PLAY_MATERIAL_UUID = 'GODBLOG_MATERIAL_UUID';
const JEANETTE_WINTERSON_PERSON_UUID = 'JEANETTE_WINTERSON_PERSON_UUID';
const ONLY_FRUITS_COMPANY_UUID = 'ONLY_FRUITS_COMPANY_UUID';
const GOD_CHARACTER_UUID = 'GOD_CHARACTER_UUID';
const THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID = 'THE_BOOKS_OF_THE_OLD_TESTAMENT_MATERIAL_UUID';
const SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID = 'SIXTY_SIX_BOOKS_MATERIAL_UUID';
const GODBLOG_BUSH_PRODUCTION_UUID = 'GODBLOG_PRODUCTION_UUID';
const BUSH_THEATRE_VENUE_UUID = 'BUSH_THEATRE_VENUE_UUID';
const THE_BOOKS_OF_THE_OLD_TESTAMENT_BUSH_PRODUCTION_UUID = 'THE_BOOKS_OF_THE_OLD_TESTAMENT_PRODUCTION_UUID';
const SIXTY_SIX_BOOKS_BUSH_PRODUCTION_UUID = 'SIXTY_SIX_BOOKS_PRODUCTION_UUID';
const GODBLOG_WESTMINSTER_ABBEY_PRODUCTION_UUID = 'GODBLOG_2_PRODUCTION_UUID';
const WESTMINSTER_ABBEY_VENUE_UUID = 'WESTMINSTER_ABBEY_VENUE_UUID';
const THE_BOOKS_OF_THE_OLD_TESTAMENT_WESTMINSTER_ABBEY_PRODUCTION_UUID = 'THE_BOOKS_OF_THE_OLD_TESTAMENT_2_PRODUCTION_UUID';
const SIXTY_SIX_BOOKS_WESTMINSTER_ABBEY_PRODUCTION_UUID = 'SIXTY_SIX_BOOKS_2_PRODUCTION_UUID';

let genesisReligiousTextMaterial;
let godblogPlayMaterial;
let theBooksOfTheOldTestamentPlaysMaterial;
let richardBancroftPerson;
let jeanetteWintersonPerson;
let theCanterburyEditorsCompany;
let onlyFruitsCompany;
let godblogBushTheatreProduction;
let godCharacter;

const sandbox = createSandbox();

describe('Material with sub-sub-materials and source materials thereof', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Genesis',
				format: 'religious text',
				year: '1611',
				writingCredits: [
					{
						entities: [
							{
								name: 'Richard Bancroft'
							},
							{
								model: 'COMPANY',
								name: 'The Canterbury Editors'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Old Testament',
				format: 'division of religious texts',
				year: '1611',
				writingCredits: [
					{
						entities: [
							{
								name: 'Richard Bancroft'
							},
							{
								model: 'COMPANY',
								name: 'The Canterbury Editors'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Genesis'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Bible: King James Version',
				format: 'collection of religious texts',
				year: '1611',
				writingCredits: [
					{
						entities: [
							{
								name: 'Richard Bancroft'
							},
							{
								model: 'COMPANY',
								name: 'The Canterbury Editors'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Old Testament'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Godblog',
				format: 'play',
				year: '2011',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jeanette Winterson'
							},
							{
								model: 'COMPANY',
								name: 'Only Fruits'
							}
						]
					},
					{
						name: 'in response to',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Genesis'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'God'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Books of the Old Testament',
				format: 'sub-collection of plays',
				year: '2011',
				writingCredits: [
					{
						name: 'in response to',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Old Testament'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Godblog'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sixty-Six Books',
				format: 'collection of plays',
				year: '2011',
				writingCredits: [
					{
						name: 'in response to',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Bible: King James Version'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Books of the Old Testament'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Godblog',
				startDate: '2011-10-10',
				pressDate: '2011-10-14',
				endDate: '2011-10-28',
				material: {
					name: 'Godblog'
				},
				venue: {
					name: 'Bush Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Books of the Old Testament',
				startDate: '2011-10-10',
				pressDate: '2011-10-14',
				endDate: '2011-10-29',
				material: {
					name: 'The Books of the Old Testament'
				},
				venue: {
					name: 'Bush Theatre'
				},
				subProductions: [
					{
						uuid: GODBLOG_BUSH_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sixty-Six Books',
				startDate: '2011-10-10',
				pressDate: '2011-10-14',
				endDate: '2011-10-29',
				material: {
					name: 'Sixty-Six Books'
				},
				venue: {
					name: 'Bush Theatre'
				},
				subProductions: [
					{
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_BUSH_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Godblog',
				startDate: '2011-10-29',
				pressDate: '2011-10-30',
				endDate: '2011-10-31',
				material: {
					name: 'Godblog'
				},
				venue: {
					name: 'Westminster Abbey'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Books of the Old Testament',
				startDate: '2011-10-29',
				pressDate: '2011-10-30',
				endDate: '2011-10-31',
				material: {
					name: 'The Books of the Old Testament'
				},
				venue: {
					name: 'Westminster Abbey'
				},
				subProductions: [
					{
						uuid: GODBLOG_WESTMINSTER_ABBEY_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sixty-Six Books',
				startDate: '2011-10-29',
				pressDate: '2011-10-30',
				endDate: '2011-10-31',
				material: {
					name: 'Sixty-Six Books'
				},
				venue: {
					name: 'Westminster Abbey'
				},
				subProductions: [
					{
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_WESTMINSTER_ABBEY_PRODUCTION_UUID
					}
				]
			});

		genesisReligiousTextMaterial = await chai.request(app)
			.get(`/materials/${GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID}`);

		godblogPlayMaterial = await chai.request(app)
			.get(`/materials/${GODBLOG_PLAY_MATERIAL_UUID}`);

		theBooksOfTheOldTestamentPlaysMaterial = await chai.request(app)
			.get(`/materials/${THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID}`);

		richardBancroftPerson = await chai.request(app)
			.get(`/people/${RICHARD_BANCROFT_PERSON_UUID}`);

		jeanetteWintersonPerson = await chai.request(app)
			.get(`/people/${JEANETTE_WINTERSON_PERSON_UUID}`);

		theCanterburyEditorsCompany = await chai.request(app)
			.get(`/companies/${THE_CANTERBURY_EDITORS_COMPANY_UUID}`);

		onlyFruitsCompany = await chai.request(app)
			.get(`/companies/${ONLY_FRUITS_COMPANY_UUID}`);

		godblogBushTheatreProduction = await chai.request(app)
			.get(`/productions/${GODBLOG_BUSH_PRODUCTION_UUID}`);

		godCharacter = await chai.request(app)
			.get(`/characters/${GOD_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Genesis (religious text) (material)', () => {

		it('includes materials that used it as source material, with corresponding sur-material and sur-sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { sourcingMaterials } = genesisReligiousTextMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of material that used it as source material, including the sur-production and sur-sur-production', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: GODBLOG_WESTMINSTER_ABBEY_PRODUCTION_UUID,
					name: 'Godblog',
					startDate: '2011-10-29',
					endDate: '2011-10-31',
					venue: {
						model: 'VENUE',
						uuid: WESTMINSTER_ABBEY_VENUE_UUID,
						name: 'Westminster Abbey',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_WESTMINSTER_ABBEY_PRODUCTION_UUID,
						name: 'The Books of the Old Testament',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SIXTY_SIX_BOOKS_WESTMINSTER_ABBEY_PRODUCTION_UUID,
							name: 'Sixty-Six Books'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: GODBLOG_BUSH_PRODUCTION_UUID,
					name: 'Godblog',
					startDate: '2011-10-10',
					endDate: '2011-10-28',
					venue: {
						model: 'VENUE',
						uuid: BUSH_THEATRE_VENUE_UUID,
						name: 'Bush Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_BUSH_PRODUCTION_UUID,
						name: 'The Books of the Old Testament',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SIXTY_SIX_BOOKS_BUSH_PRODUCTION_UUID,
							name: 'Sixty-Six Books'
						}
					}
				}
			];

			const { sourcingMaterialProductions } = genesisReligiousTextMaterial.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Godblog (play) (material)', () => {

		it('includes writers of this material and its source material (with corresponding sur-material and sur-sur-material) grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: JEANETTE_WINTERSON_PERSON_UUID,
							name: 'Jeanette Winterson'
						},
						{
							model: 'COMPANY',
							uuid: ONLY_FRUITS_COMPANY_UUID,
							name: 'Only Fruits'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'in response to',
					entities: [
						{
							model: 'MATERIAL',
							uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
							name: 'Genesis',
							format: 'religious text',
							year: 1611,
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
								name: 'The Old Testament',
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'The Bible: King James Version'
								}
							},
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: RICHARD_BANCROFT_PERSON_UUID,
											name: 'Richard Bancroft'
										},
										{
											model: 'COMPANY',
											uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
											name: 'The Canterbury Editors'
										}
									]
								}
							]
						}
					]
				}
			];

			const { writingCredits } = godblogPlayMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

		it('includes writers and source material (with corresponding sur-material) of this material\'s sur-material', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
				name: 'The Books of the Old Testament',
				subtitle: null,
				format: 'sub-collection of plays',
				year: 2011,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'in response to',
						entities: [
							{
								model: 'MATERIAL',
								uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
								name: 'The Old Testament',
								format: 'division of religious texts',
								year: 1611,
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'The Bible: King James Version',
									surMaterial: null
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: RICHARD_BANCROFT_PERSON_UUID,
												name: 'Richard Bancroft'
											},
											{
												model: 'COMPANY',
												uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
												name: 'The Canterbury Editors'
											}
										]
									}
								]
							}
						]
					}
				],
				originalVersionMaterial: null,
				surMaterial: {
					model: 'MATERIAL',
					uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
					name: 'Sixty-Six Books',
					subtitle: null,
					format: 'collection of plays',
					year: 2011,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'The Bible: King James Version',
									format: 'collection of religious texts',
									year: 1611,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
												}
											]
										}
									]
								}
							]
						}
					],
					originalVersionMaterial: null,
					characterGroups: []
				},
				characterGroups: []
			};

			const { surMaterial } = godblogPlayMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

	});

	describe('The Books of the Old Testament (sub-collection of plays) (material)', () => {

		it('includes writers and source material of this material\'s sur-material', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
				name: 'Sixty-Six Books',
				subtitle: null,
				format: 'collection of plays',
				year: 2011,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'in response to',
						entities: [
							{
								model: 'MATERIAL',
								uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
								name: 'The Bible: King James Version',
								format: 'collection of religious texts',
								year: 1611,
								surMaterial: null,
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: RICHARD_BANCROFT_PERSON_UUID,
												name: 'Richard Bancroft'
											},
											{
												model: 'COMPANY',
												uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
												name: 'The Canterbury Editors'
											}
										]
									}
								]
							}
						]
					}
				],
				originalVersionMaterial: null,
				surMaterial: null,
				characterGroups: []
			};

			const { surMaterial } = theBooksOfTheOldTestamentPlaysMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

	});

	describe('Richard Bancroft (person)', () => {

		it('includes materials that used their work as source material, with corresponding sur-material and sur-sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { sourcingMaterials } = richardBancroftPerson.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of materials that used their work as source material, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: GODBLOG_WESTMINSTER_ABBEY_PRODUCTION_UUID,
					name: 'Godblog',
					startDate: '2011-10-29',
					endDate: '2011-10-31',
					venue: {
						model: 'VENUE',
						uuid: WESTMINSTER_ABBEY_VENUE_UUID,
						name: 'Westminster Abbey',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_WESTMINSTER_ABBEY_PRODUCTION_UUID,
						name: 'The Books of the Old Testament',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SIXTY_SIX_BOOKS_WESTMINSTER_ABBEY_PRODUCTION_UUID,
							name: 'Sixty-Six Books'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: GODBLOG_BUSH_PRODUCTION_UUID,
					name: 'Godblog',
					startDate: '2011-10-10',
					endDate: '2011-10-28',
					venue: {
						model: 'VENUE',
						uuid: BUSH_THEATRE_VENUE_UUID,
						name: 'Bush Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_BUSH_PRODUCTION_UUID,
						name: 'The Books of the Old Testament',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SIXTY_SIX_BOOKS_BUSH_PRODUCTION_UUID,
							name: 'Sixty-Six Books'
						}
					}
				}
			];

			const { sourcingMaterialProductions } = richardBancroftPerson.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('The Canterbury Editors (company)', () => {

		it('includes materials that used their work as source material, with corresponding sur-material and sur-sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { sourcingMaterials } = theCanterburyEditorsCompany.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of materials that used their work as source material, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: GODBLOG_WESTMINSTER_ABBEY_PRODUCTION_UUID,
					name: 'Godblog',
					startDate: '2011-10-29',
					endDate: '2011-10-31',
					venue: {
						model: 'VENUE',
						uuid: WESTMINSTER_ABBEY_VENUE_UUID,
						name: 'Westminster Abbey',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_WESTMINSTER_ABBEY_PRODUCTION_UUID,
						name: 'The Books of the Old Testament',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SIXTY_SIX_BOOKS_WESTMINSTER_ABBEY_PRODUCTION_UUID,
							name: 'Sixty-Six Books'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: GODBLOG_BUSH_PRODUCTION_UUID,
					name: 'Godblog',
					startDate: '2011-10-10',
					endDate: '2011-10-28',
					venue: {
						model: 'VENUE',
						uuid: BUSH_THEATRE_VENUE_UUID,
						name: 'Bush Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_BUSH_PRODUCTION_UUID,
						name: 'The Books of the Old Testament',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SIXTY_SIX_BOOKS_BUSH_PRODUCTION_UUID,
							name: 'Sixty-Six Books'
						}
					}
				}
			];

			const { sourcingMaterialProductions } = richardBancroftPerson.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Jeanette Winterson (person)', () => {

		it('includes materials they have written, with corresponding sur-material and sur-sur-materials', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { materials } = jeanetteWintersonPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Only Fruits (company)', () => {

		it('includes materials it has written, with corresponding sur-material and sur-sur-material', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { materials } = onlyFruitsCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Godblog at Bush Theatre (production)', () => {

		it('includes in its material data the writers of the material and its source material (with corresponding sur-material and sur-sur-material)', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: GODBLOG_PLAY_MATERIAL_UUID,
				name: 'Godblog',
				format: 'play',
				year: 2011,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
					name: 'The Books of the Old Testament',
					surMaterial: {
						model: 'MATERIAL',
						uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
						name: 'Sixty-Six Books'
					}
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: JEANETTE_WINTERSON_PERSON_UUID,
								name: 'Jeanette Winterson'
							},
							{
								model: 'COMPANY',
								uuid: ONLY_FRUITS_COMPANY_UUID,
								name: 'Only Fruits'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'in response to',
						entities: [
							{
								model: 'MATERIAL',
								uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
								name: 'Genesis',
								format: 'religious text',
								year: 1611,
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'The Old Testament',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Bible: King James Version'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: RICHARD_BANCROFT_PERSON_UUID,
												name: 'Richard Bancroft'
											},
											{
												model: 'COMPANY',
												uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
												name: 'The Canterbury Editors'
											}
										]
									}
								]
							}
						]
					}
				]
			};

			const { material } = godblogBushTheatreProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('God (character)', () => {

		it('includes in its material data the writers of the material and its source material (with corresponding sur-material and sur-sur-materials)', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
												}
											]
										}
									]
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = godCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('materials list', () => {

		it('includes writers of the materials and their corresponding source material (with corresponding sur-material)', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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
					model: 'MATERIAL',
					uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
					name: 'Genesis',
					format: 'religious text',
					year: 1611,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
						name: 'The Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
							name: 'The Bible: King James Version'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RICHARD_BANCROFT_PERSON_UUID,
									name: 'Richard Bancroft'
								},
								{
									model: 'COMPANY',
									uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
									name: 'The Canterbury Editors'
								}
							]
						}
					]
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
