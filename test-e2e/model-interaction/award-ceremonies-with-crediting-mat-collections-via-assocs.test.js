import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { createRelationship, deleteRelationship, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const SUB_PLUGH_PART_I_ORIGINAL_VERSION_MATERIAL_UUID = 'SUB_PLUGH_PART_I_1_MATERIAL_UUID';
const FRANCIS_FLOB_JR_PERSON_UUID = 'FRANCIS_FLOB_JR_PERSON_UUID';
const SUB_CURTAIN_UP_LTD_COMPANY_UUID = 'SUB_CURTAIN_UP_LTD_COMPANY_UUID';
const MID_PLUGH_SECTION_I_ORIGINAL_VERSION_MATERIAL_UUID = 'MID_PLUGH_SECTION_I_1_MATERIAL_UUID';
const FRANCIS_FLOB_PERSON_UUID = 'FRANCIS_FLOB_PERSON_UUID';
const MID_CURTAIN_UP_LTD_COMPANY_UUID = 'MID_CURTAIN_UP_LTD_COMPANY_UUID';
const SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = 'SUR_PLUGH_1_MATERIAL_UUID';
const FRANCIS_FLOB_SR_PERSON_UUID = 'FRANCIS_FLOB_SR_PERSON_UUID';
const SUR_CURTAIN_UP_LTD_COMPANY_UUID = 'SUR_CURTAIN_UP_LTD_COMPANY_UUID';
const SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID = 'SUB_PLUGH_PART_I_2_MATERIAL_UUID';
const SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID = 'SUB_PLUGH_PART_II_2_MATERIAL_UUID';
const MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID = 'MID_PLUGH_SECTION_I_2_MATERIAL_UUID';
const MID_PLUGH_SECTION_II_SUBSEQUENT_VERSION_MATERIAL_UUID = 'MID_PLUGH_SECTION_II_2_MATERIAL_UUID';
const SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = 'SUR_PLUGH_2_MATERIAL_UUID';
const SUB_WALDO_PART_I_MATERIAL_UUID = 'SUB_WALDO_PART_I_MATERIAL_UUID';
const JANE_ROE_JR_PERSON_UUID = 'JANE_ROE_JR_PERSON_UUID';
const SUB_FICTIONEERS_LTD_COMPANY_UUID = 'SUB_FICTIONEERS_LTD_COMPANY_UUID';
const MID_WALDO_SECTION_I_MATERIAL_UUID = 'MID_WALDO_SECTION_I_MATERIAL_UUID';
const JANE_ROE_PERSON_UUID = 'JANE_ROE_PERSON_UUID';
const MID_FICTIONEERS_LTD_COMPANY_UUID = 'MID_FICTIONEERS_LTD_COMPANY_UUID';
const SUR_WALDO_MATERIAL_UUID = 'SUR_WALDO_MATERIAL_UUID';
const JANE_ROE_SR_PERSON_UUID = 'JANE_ROE_SR_PERSON_UUID';
const SUR_FICTIONEERS_LTD_COMPANY_UUID = 'SUR_FICTIONEERS_LTD_COMPANY_UUID';
const SUB_WIBBLE_PART_I_MATERIAL_UUID = 'SUB_WIBBLE_PART_I_MATERIAL_UUID';
const SUB_WIBBLE_PART_II_MATERIAL_UUID = 'SUB_WIBBLE_PART_II_MATERIAL_UUID';
const MID_WIBBLE_SECTION_I_MATERIAL_UUID = 'MID_WIBBLE_SECTION_I_MATERIAL_UUID';
const MID_WIBBLE_SECTION_II_MATERIAL_UUID = 'MID_WIBBLE_SECTION_II_MATERIAL_UUID';
const SUR_WIBBLE_MATERIAL_UUID = 'SUR_WIBBLE_MATERIAL_UUID';
const WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID = '2010_2_AWARD_CEREMONY_UUID';
const WORDSMITH_AWARD_UUID = 'WORDSMITH_AWARD_AWARD_UUID';
const PLAYWRITING_PRIZE_2009_AWARD_CEREMONY_UUID = '2009_2_AWARD_CEREMONY_UUID';
const PLAYWRITING_PRIZE_AWARD_UUID = 'PLAYWRITING_PRIZE_AWARD_UUID';
const DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID = '2008_2_AWARD_CEREMONY_UUID';
const DRAMATISTS_MEDAL_AWARD_UUID = 'DRAMATISTS_MEDAL_AWARD_UUID';
const SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID = '2009_4_AWARD_CEREMONY_UUID';
const SCRIPTING_SHIELD_AWARD_UUID = 'SCRIPTING_SHIELD_AWARD_UUID';
const TRAGEDIANS_TROPHY_2009_AWARD_CEREMONY_UUID = '2009_6_AWARD_CEREMONY_UUID';
const TRAGEDIANS_TROPHY_AWARD_UUID = 'TRAGEDIANS_TROPHY_AWARD_UUID';

let subPlughPartIOriginalVersionMaterial;
let midPlughSectionIOriginalVersionMaterial;
let surPlughOriginalVersionMaterial;
let francisFlobJrPerson;
let francisFlobPerson;
let francisFlobSrPerson;
let subCurtainUpLtdCompany;
let midCurtainUpLtdCompany;
let surCurtainUpLtdCompany;
let subWaldoPartIMaterial;
let midWaldoSectionIMaterial;
let surWaldoMaterial;
let janeRoeJrPerson;
let janeRoePerson;
let janeRoeSrPerson;
let subFictioneersLtdCompany;
let midFictioneersLtdCompany;
let surFictioneersLtdCompany;

const sandbox = createSandbox();

describe('Award ceremonies with crediting material collections loosely connected to source material/original version (with person/company/material nominations gained via associations to sur-sur and sub-sub-materials)', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh: Part I',
				differentiator: '1',
				format: 'play',
				year: '1899',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Curtain Up Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh: Part II',
				differentiator: '1',
				format: 'play',
				year: '1899'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Plugh: Section I',
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
								name: 'Mid-Curtain Up Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Plugh: Part I',
						differentiator: '1'
					},
					{
						name: 'Sub-Plugh: Part II',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Plugh: Section II',
				differentiator: '1',
				format: 'sub-collection of plays',
				year: '1899'
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
								name: 'Francis Flob Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Curtain Up Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Mid-Plugh: Section I',
						differentiator: '1'
					},
					{
						name: 'Mid-Plugh: Section II',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh: Part I',
				differentiator: '2',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Curtain Up Ltd'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stagecraft Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh: Part II',
				differentiator: '2',
				format: 'play',
				year: '2009'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Plugh: Section I',
				differentiator: '2',
				format: 'sub-collection of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Curtain Up Ltd'
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
								name: 'Mid-Stagecraft Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Plugh: Part I',
						differentiator: '2'
					},
					{
						name: 'Sub-Plugh: Part II',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Plugh: Section II',
				differentiator: '2',
				format: 'sub-collection of plays',
				year: '2009'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Plugh',
				differentiator: '2',
				format: 'collection of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Curtain Up Ltd'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Stagecraft Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Mid-Plugh: Section I',
						differentiator: '2'
					},
					{
						name: 'Mid-Plugh: Section II',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Waldo: Part I',
				format: 'novel',
				year: '1974',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Fictioneers Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Waldo: Part II',
				format: 'novel',
				year: '1974'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Waldo: Section I',
				format: 'sub-collection of novels',
				year: '1974',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Fictioneers Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Waldo: Part I'
					},
					{
						name: 'Sub-Waldo: Part II'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Waldo: Section II',
				format: 'sub-collection of novels',
				year: '1974'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Waldo',
				format: 'collection of novels',
				year: '1974',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Fictioneers Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Mid-Waldo: Section I'
					},
					{
						name: 'Mid-Waldo: Section II'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble: Part I',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Theatricals Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble: Part II',
				format: 'play',
				year: '2009'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Wibble: Section I',
				format: 'sub-collection of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Theatricals Ltd'
							}
						]
					}
				],
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
			.post('/materials')
			.send({
				name: 'Mid-Wibble: Section II',
				format: 'sub-collection of plays',
				year: '2009'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Wibble',
				format: 'collection of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Theatricals Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Mid-Wibble: Section I'
					},
					{
						name: 'Mid-Wibble: Section II'
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
								materials: [
									{
										name: 'Sub-Plugh: Part I',
										differentiator: '2'
									}
								]
							},
							{
								isWinner: true,
								materials: [
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
				name: '2009',
				award: {
					name: 'Playwriting Prize'
				},
				categories: [
					{
						name: 'Best Random Play',
						nominations: [
							{
								isWinner: true,
								materials: [
									{
										name: 'Sur-Plugh',
										differentiator: '2'
									}
								]
							},
							{
								materials: [
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
				name: '2008',
				award: {
					name: 'Dramatists Medal'
				},
				categories: [
					{
						name: 'Most Remarkable Play',
						nominations: [
							{
								materials: [
									{
										name: 'Mid-Plugh: Section I',
										differentiator: '2'
									}
								]
							},
							{
								isWinner: true,
								materials: [
									{
										name: 'Mid-Wibble: Section I'
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
					name: 'Scripting Shield'
				},
				categories: [
					{
						name: 'Most Notable Play',
						nominations: [
							{
								isWinner: true,
								materials: [
									{
										name: 'Sub-Plugh: Part II',
										differentiator: '2'
									}
								]
							},
							{
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

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2009',
				award: {
					name: 'Tragedians Trophy'
				},
				categories: [
					{
						name: 'Most Interesting Play',
						nominations: [
							{
								materials: [
									{
										name: 'Mid-Plugh: Section II',
										differentiator: '2'
									}
								]
							},
							{
								isWinner: true,
								materials: [
									{
										name: 'Mid-Wibble: Section II'
									}
								]
							}
						]
					}
				]
			});

	});

	after(() => {

		sandbox.restore();

	});

	describe('Subsequent versions have nominations; connected only via sub-instances', () => {

		before(async () => {

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: SUB_PLUGH_PART_I_ORIGINAL_VERSION_MATERIAL_UUID,
				relationshipName: 'SUBSEQUENT_VERSION_OF'
			});

		});

		after(async () => {

			await deleteRelationship({
				sourceLabel: 'Material',
				sourceUuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: SUB_PLUGH_PART_I_ORIGINAL_VERSION_MATERIAL_UUID,
				relationshipName: 'SUBSEQUENT_VERSION_OF'
			});

		});

		describe('Sub-Plugh: Part I (play, 1899) (material): its subsequent versions have nominations', () => {

			it('includes awards of its subsequent versions (and their sur-material and sur-sur-material)', async () => {

				subPlughPartIOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${SUB_PLUGH_PART_I_ORIGINAL_VERSION_MATERIAL_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = subPlughPartIOriginalVersionMaterial.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Mid-Plugh: Section I (sub-collection of plays, 1899) (material): its sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of its sub-material\'s subsequent versions (and their sur-material and sur-sur-material)', async () => {

				midPlughSectionIOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${MID_PLUGH_SECTION_I_ORIGINAL_VERSION_MATERIAL_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = midPlughSectionIOriginalVersionMaterial.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sur-Plugh (collection of plays, 1899) (material): its sub-sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of its sub-sub-material\'s subsequent versions (and their sur-material and sur-sur-material)', async () => {

				surPlughOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

		describe('Francis Flob Jr (person): their work\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s subsequent versions (and their sur-material and sur-sur-material)', async () => {

				francisFlobJrPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_JR_PERSON_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = francisFlobJrPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Francis Flob (person): their work\'s sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sub-material\'s subsequent versions (and their sur-material and sur-sur-material)', async () => {

				francisFlobPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_PERSON_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = francisFlobPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Francis Flob Sr (person): their work\'s sub-sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sub-sub-material\'s subsequent versions (and their sur-material and sur-sur-material)', async () => {

				francisFlobSrPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_SR_PERSON_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = francisFlobSrPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sub-Curtain Up Ltd (company): their work\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s subsequent versions (and their sur-material and sur-sur-material)', async () => {

				subCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${SUB_CURTAIN_UP_LTD_COMPANY_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = subCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Mid-Curtain Up Ltd (company): their work\'s sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sub-material\'s subsequent versions (and their sur-material and sur-sur-material)', async () => {

				midCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${MID_CURTAIN_UP_LTD_COMPANY_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = midCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sur-Curtain Up Ltd (company): their work\'s sub-sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sub-sub-material\'s subsequent versions (and their sur-material and sur-sur-material)', async () => {

				surCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${SUR_CURTAIN_UP_LTD_COMPANY_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = surCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

	});

	describe('Subsequent versions have nominations; connected only via mid-instances', () => {

		before(async () => {

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: MID_PLUGH_SECTION_I_ORIGINAL_VERSION_MATERIAL_UUID,
				relationshipName: 'SUBSEQUENT_VERSION_OF'
			});

		});

		after(async () => {

			await deleteRelationship({
				sourceLabel: 'Material',
				sourceUuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: MID_PLUGH_SECTION_I_ORIGINAL_VERSION_MATERIAL_UUID,
				relationshipName: 'SUBSEQUENT_VERSION_OF'
			});

		});

		describe('Sub-Plugh: Part I (play, 1899) (material): its sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of its sur-material\'s subsequent versions (and their sur-material, but not their sub-materials)', async () => {

				subPlughPartIOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${SUB_PLUGH_PART_I_ORIGINAL_VERSION_MATERIAL_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = subPlughPartIOriginalVersionMaterial.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Mid-Plugh: Section I (sub-collection of plays, 1899) (material): its subsequent versions have nominations', () => {

			it('includes awards of its subsequent versions (and their sur-material and sub-materials)', async () => {

				midPlughSectionIOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${MID_PLUGH_SECTION_I_ORIGINAL_VERSION_MATERIAL_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = midPlughSectionIOriginalVersionMaterial.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sur-Plugh (collection of plays, 1899) (material): its sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of its sub-material\'s subsequent versions (and their sur-material and sub-materials)', async () => {

				surPlughOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

		describe('Francis Flob Jr (person): their work\'s sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sur-material\'s subsequent versions (and their sur-material, but not their sub-materials)', async () => {

				francisFlobJrPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_JR_PERSON_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = francisFlobJrPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Francis Flob (person): their work\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s subsequent versions (and their sur-material and sub-materials)', async () => {

				francisFlobPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_PERSON_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = francisFlobPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Francis Flob Sr (person): their work\'s sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sub-material\'s subsequent versions (and their sur-material and sub-materials)', async () => {

				francisFlobSrPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_SR_PERSON_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = francisFlobSrPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sub-Curtain Up Ltd (company): their work\'s sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sur-material\'s subsequent versions (and their sur-material, but not their sub-materials)', async () => {

				subCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${SUB_CURTAIN_UP_LTD_COMPANY_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = subCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Mid-Curtain Up Ltd (company): their work\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s subsequent versions (and their sur-material and sub-materials)', async () => {

				midCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${MID_CURTAIN_UP_LTD_COMPANY_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = midCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sur-Curtain Up Ltd (company): their work\'s sub-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sub-material\'s subsequent versions (and their sur-material and sub-materials)', async () => {

				surCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${SUR_CURTAIN_UP_LTD_COMPANY_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = surCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

	});

	describe('Subsequent versions have nominations; connected only via sur-instances', () => {

		before(async () => {

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID,
				relationshipName: 'SUBSEQUENT_VERSION_OF'
			});

		});

		after(async () => {

			await deleteRelationship({
				sourceLabel: 'Material',
				sourceUuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID,
				relationshipName: 'SUBSEQUENT_VERSION_OF'
			});

		});

		describe('Sub-Plugh: Part I (play, 1899) (material): its sur-sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of its sur-sur-material\'s subsequent versions (but not their sub-materials and sub-sub-materials)', async () => {

				subPlughPartIOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${SUB_PLUGH_PART_I_ORIGINAL_VERSION_MATERIAL_UUID}`);

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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = subPlughPartIOriginalVersionMaterial.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Mid-Plugh: Section I (sub-collection of plays, 1899) (material): its sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of its sur-material\'s subsequent versions (but not their sub-materials and sub-sub-materials)', async () => {

				midPlughSectionIOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${MID_PLUGH_SECTION_I_ORIGINAL_VERSION_MATERIAL_UUID}`);

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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = midPlughSectionIOriginalVersionMaterial.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sur-Plugh (collection of plays, 1899) (material): subsequent versions have nominations', () => {

			it('includes awards of its subsequent versions (and their sub-materials and sub-sub-materials)', async () => {

				surPlughOriginalVersionMaterial = await chai.request(app)
					.get(`/materials/${SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
					},
					{
						model: 'AWARD',
						uuid: TRAGEDIANS_TROPHY_AWARD_UUID,
						name: 'Tragedians Trophy',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: TRAGEDIANS_TROPHY_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Interesting Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section II',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

		describe('Francis Flob Jr (person): their work\'s sur-sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sur-sur-material\'s subsequent versions (but not their sub-materials and sub-sub-materials)', async () => {

				francisFlobJrPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_JR_PERSON_UUID}`);

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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = francisFlobJrPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Francis Flob (person): their work\'s sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sur-material\'s subsequent versions (but not their sub-materials and sub-sub-materials)', async () => {

				francisFlobPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_PERSON_UUID}`);

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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = francisFlobPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Francis Flob Sr (person): their work\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s subsequent versions (and their sub-materials and sub-sub-materials)', async () => {

				francisFlobSrPerson = await chai.request(app)
					.get(`/people/${FRANCIS_FLOB_SR_PERSON_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
					},
					{
						model: 'AWARD',
						uuid: TRAGEDIANS_TROPHY_AWARD_UUID,
						name: 'Tragedians Trophy',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: TRAGEDIANS_TROPHY_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Interesting Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section II',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = francisFlobSrPerson.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sub-Curtain Up Ltd (company): their work\'s sur-sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sur-sur-material\'s subsequent versions (but not their sub-materials and sub-sub-materials)', async () => {

				subCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${SUB_CURTAIN_UP_LTD_COMPANY_UUID}`);

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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = subCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Mid-Curtain Up Ltd (company): their work\'s sur-material\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s sur-material\'s subsequent versions (but not their sub-materials and sub-sub-materials)', async () => {

				midCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${MID_CURTAIN_UP_LTD_COMPANY_UUID}`);

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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
					}
				];

				const { subsequentVersionMaterialAwards } = midCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

		describe('Sur-Curtain Up Ltd (company): their work\'s subsequent versions have nominations', () => {

			it('includes awards of their work\'s subsequent versions (and their sub-materials and sub-sub-materials)', async () => {

				surCurtainUpLtdCompany = await chai.request(app)
					.get(`/companies/${SUR_CURTAIN_UP_LTD_COMPANY_UUID}`);

				const expectedSubsequentVersionMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section I',
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
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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
					},
					{
						model: 'AWARD',
						uuid: TRAGEDIANS_TROPHY_AWARD_UUID,
						name: 'Tragedians Trophy',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: TRAGEDIANS_TROPHY_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Interesting Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_PLUGH_SECTION_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh: Section II',
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
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSubsequentVersionMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sub-Plugh: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_PLUGH_SECTION_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Mid-Plugh: Section I',
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

				const { subsequentVersionMaterialAwards } = surCurtainUpLtdCompany.body;

				expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

			});

		});

	});

	describe('Sourcing materials have nominations; connected only via sub-instances', () => {

		before(async () => {

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: SUB_WALDO_PART_I_MATERIAL_UUID,
				relationshipName: 'USES_SOURCE_MATERIAL'
			});

		});

		after(async () => {

			await deleteRelationship({
				sourceLabel: 'Material',
				sourceUuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: SUB_WALDO_PART_I_MATERIAL_UUID,
				relationshipName: 'USES_SOURCE_MATERIAL'
			});

		});

		describe('Sub-Waldo: Part I (novel, 1974) (material): its sourcing materials have nominations', () => {

			it('includes awards of its sourcing materials (and their sur-material and sur-sur-material)', async () => {

				subWaldoPartIMaterial = await chai.request(app)
					.get(`/materials/${SUB_WALDO_PART_I_MATERIAL_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = subWaldoPartIMaterial.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Mid-Waldo: Section I (sub-collection of plays, 1899) (material): its sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of its sub-material\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				midWaldoSectionIMaterial = await chai.request(app)
					.get(`/materials/${MID_WALDO_SECTION_I_MATERIAL_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = midWaldoSectionIMaterial.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sur-Waldo (collection of plays, 1899) (material): its sub-sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of its sub-sub-material\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				surWaldoMaterial = await chai.request(app)
					.get(`/materials/${SUR_WALDO_MATERIAL_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

		describe('Jane Roe Jr (person): their work\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				janeRoeJrPerson = await chai.request(app)
					.get(`/people/${JANE_ROE_JR_PERSON_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = janeRoeJrPerson.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Jane Roe (person): their work\'s sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sub-material\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				janeRoePerson = await chai.request(app)
					.get(`/people/${JANE_ROE_PERSON_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

		describe('Jane Roe Sr (person): their work\'s sub-sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sub-sub-material\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				janeRoeSrPerson = await chai.request(app)
					.get(`/people/${JANE_ROE_SR_PERSON_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = janeRoeSrPerson.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sub-Fictioneers Ltd (company): their work\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				subFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${SUB_FICTIONEERS_LTD_COMPANY_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = subFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Mid-Fictioneers Ltd (company): their work\'s sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sub-material\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				midFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${MID_FICTIONEERS_LTD_COMPANY_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = midFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sur-Fictioneers Ltd (company): their work\'s sub-sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sub-sub-material\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				surFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${SUR_FICTIONEERS_LTD_COMPANY_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
								uuid: WORDSMITH_AWARD_2010_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = surFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

	});

	describe('Sourcing materials have nominations; connected only via mid-instances', () => {

		before(async () => {

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: MID_WALDO_SECTION_I_MATERIAL_UUID,
				relationshipName: 'USES_SOURCE_MATERIAL'
			});

		});

		after(async () => {

			await deleteRelationship({
				sourceLabel: 'Material',
				sourceUuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: MID_WALDO_SECTION_I_MATERIAL_UUID,
				relationshipName: 'USES_SOURCE_MATERIAL'
			});

		});

		describe('Sub-Waldo: Part I (play, 1899) (material): its sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of its sur-material\'s sourcing materials (and their sur-material, but not their sub-materials)', async () => {

				subWaldoPartIMaterial = await chai.request(app)
					.get(`/materials/${SUB_WALDO_PART_I_MATERIAL_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = subWaldoPartIMaterial.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Mid-Waldo: Section I (sub-collection of plays, 1899) (material): its sourcing materials have nominations', () => {

			it('includes awards of its sourcing materials (and their sur-material and sub-materials)', async () => {

				midWaldoSectionIMaterial = await chai.request(app)
					.get(`/materials/${MID_WALDO_SECTION_I_MATERIAL_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = midWaldoSectionIMaterial.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sur-Waldo (collection of plays, 1899) (material): its sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of its sub-material\'s sourcing materials (and their sur-material and sub-materials)', async () => {

				surWaldoMaterial = await chai.request(app)
					.get(`/materials/${SUR_WALDO_MATERIAL_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

		describe('Jane Roe Jr (person): their work\'s sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sur-material\'s sourcing materials (and their sur-material, but not their sub-materials)', async () => {

				janeRoeJrPerson = await chai.request(app)
					.get(`/people/${JANE_ROE_JR_PERSON_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = janeRoeJrPerson.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Jane Roe (person): their work\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sourcing materials (and their sur-material and sub-materials)', async () => {

				janeRoePerson = await chai.request(app)
					.get(`/people/${JANE_ROE_PERSON_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

		describe('Jane Roe Sr (person): their work\'s sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sub-material\'s sourcing materials (and their sur-material and sub-materials)', async () => {

				janeRoeSrPerson = await chai.request(app)
					.get(`/people/${JANE_ROE_SR_PERSON_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = janeRoeSrPerson.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sub-Fictioneers Ltd (company): their work\'s sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sur-material\'s sourcing materials (and their sur-material, but not their sub-materials)', async () => {

				subFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${SUB_FICTIONEERS_LTD_COMPANY_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = subFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Mid-Fictioneers Ltd (company): their work\'s sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sub-material\'s sourcing materials (and their sur-material and sur-sur-material)', async () => {

				midFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${MID_FICTIONEERS_LTD_COMPANY_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = midFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sur-Fictioneers Ltd (company): their work\'s sub-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sub-material\'s sourcing materials (and their sur-material and sub-materials)', async () => {

				surFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${SUR_FICTIONEERS_LTD_COMPANY_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = surFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

	});

	describe('Sourcing materials have nominations; connected only via sur-instances', () => {

		before(async () => {

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: SUR_WIBBLE_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: SUR_WALDO_MATERIAL_UUID,
				relationshipName: 'USES_SOURCE_MATERIAL'
			});

		});

		after(async () => {

			await deleteRelationship({
				sourceLabel: 'Material',
				sourceUuid: SUR_WIBBLE_MATERIAL_UUID,
				destinationLabel: 'Material',
				destinationUuid: SUR_WALDO_MATERIAL_UUID,
				relationshipName: 'USES_SOURCE_MATERIAL'
			});

		});

		describe('Sub-Waldo: Part I (play, 1899) (material): its sur-sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of its sur-sur-material\'s sourcing materials (but not their sub-materials and sub-sub-materials)', async () => {

				subWaldoPartIMaterial = await chai.request(app)
					.get(`/materials/${SUB_WALDO_PART_I_MATERIAL_UUID}`);

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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = subWaldoPartIMaterial.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Mid-Waldo: Section I (sub-collection of plays, 1899) (material): its sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of its sur-material\'s sourcing materials (but not their sub-materials and sub-sub-materials)', async () => {

				midWaldoSectionIMaterial = await chai.request(app)
					.get(`/materials/${MID_WALDO_SECTION_I_MATERIAL_UUID}`);

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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = midWaldoSectionIMaterial.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sur-Waldo (collection of plays, 1899) (material): sourcing materials have nominations', () => {

			it('includes awards of its sourcing materials (and their sub-materials and sub-sub-materials)', async () => {

				surWaldoMaterial = await chai.request(app)
					.get(`/materials/${SUR_WALDO_MATERIAL_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
					},
					{
						model: 'AWARD',
						uuid: TRAGEDIANS_TROPHY_AWARD_UUID,
						name: 'Tragedians Trophy',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: TRAGEDIANS_TROPHY_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Interesting Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_II_MATERIAL_UUID,
														name: 'Mid-Wibble: Section II',
														format: 'sub-collection of plays',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

		describe('Jane Roe Jr (person): their work\'s sur-sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sur-sur-material\'s sourcing materials (but not their sub-materials and sub-sub-materials)', async () => {

				janeRoeJrPerson = await chai.request(app)
					.get(`/people/${JANE_ROE_JR_PERSON_UUID}`);

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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = janeRoeJrPerson.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Jane Roe (person): their work\'s sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sur-material\'s sourcing materials (but not their sub-materials and sub-sub-materials)', async () => {

				janeRoePerson = await chai.request(app)
					.get(`/people/${JANE_ROE_PERSON_UUID}`);

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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = janeRoePerson.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Jane Roe Sr (person): their work\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sourcing materials (and their sub-materials and sub-sub-materials)', async () => {

				janeRoeSrPerson = await chai.request(app)
					.get(`/people/${JANE_ROE_SR_PERSON_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
					},
					{
						model: 'AWARD',
						uuid: TRAGEDIANS_TROPHY_AWARD_UUID,
						name: 'Tragedians Trophy',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: TRAGEDIANS_TROPHY_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Interesting Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_II_MATERIAL_UUID,
														name: 'Mid-Wibble: Section II',
														format: 'sub-collection of plays',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = janeRoeSrPerson.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sub-Fictioneers Ltd (company): their work\'s sur-sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sur-sur-material\'s sourcing materials (but not their sub-materials and sub-sub-materials)', async () => {

				subFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${SUB_FICTIONEERS_LTD_COMPANY_UUID}`);

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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = subFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Mid-Fictioneers Ltd (company): their work\'s sur-material\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sur-material\'s sourcing materials (but not their sub-materials and sub-sub-materials)', async () => {

				midFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${MID_FICTIONEERS_LTD_COMPANY_UUID}`);

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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
					}
				];

				const { sourcingMaterialAwards } = midFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

		describe('Sur-Fictioneers Ltd (company): their work\'s sourcing materials have nominations', () => {

			it('includes awards of their work\'s sourcing materials (and their sub-materials and sub-sub-materials)', async () => {

				surFictioneersLtdCompany = await chai.request(app)
					.get(`/companies/${SUR_FICTIONEERS_LTD_COMPANY_UUID}`);

				const expectedSourcingMaterialAwards = [
					{
						model: 'AWARD',
						uuid: DRAMATISTS_MEDAL_AWARD_UUID,
						name: 'Dramatists Medal',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: DRAMATISTS_MEDAL_2008_AWARD_CEREMONY_UUID,
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														format: 'sub-collection of plays',
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
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
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
						uuid: SCRIPTING_SHIELD_AWARD_UUID,
						name: 'Scripting Shield',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: SCRIPTING_SHIELD_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Notable Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: false,
												type: 'Nomination',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
														name: 'Sub-Wibble: Part II',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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
					},
					{
						model: 'AWARD',
						uuid: TRAGEDIANS_TROPHY_AWARD_UUID,
						name: 'Tragedians Trophy',
						ceremonies: [
							{
								model: 'AWARD_CEREMONY',
								uuid: TRAGEDIANS_TROPHY_2009_AWARD_CEREMONY_UUID,
								name: '2009',
								categories: [
									{
										model: 'AWARD_CEREMONY_CATEGORY',
										name: 'Most Interesting Play',
										nominations: [
											{
												model: 'NOMINATION',
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_II_MATERIAL_UUID,
														name: 'Mid-Wibble: Section II',
														format: 'sub-collection of plays',
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
												isWinner: true,
												type: 'Winner',
												entities: [],
												productions: [],
												materials: [],
												recipientSourcingMaterials: [
													{
														model: 'MATERIAL',
														uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
														name: 'Sub-Wibble: Part I',
														format: 'play',
														year: 2009,
														surMaterial: {
															model: 'MATERIAL',
															uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
															name: 'Mid-Wibble: Section I',
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

				const { sourcingMaterialAwards } = surFictioneersLtdCompany.body;

				expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

			});

		});

	});

});
