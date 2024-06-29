import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID = 'BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID';
const FERDINAND_FOO_PERSON_UUID = 'FERDINAND_FOO_PERSON_UUID';
const FICTIONEERS_LTD_COMPANY_UUID = 'FICTIONEERS_LTD_COMPANY_UUID';
const BAR_CHARACTER_UUID = 'BAR_CHARACTER_UUID';
const DURANDS_LINE_MATERIAL_UUID = 'DURANDS_LINE_MATERIAL_UUID';
const RON_HUTCHINSON_PERSON_UUID = 'RON_HUTCHINSON_PERSON_UUID';
const CAMPAIGN_MATERIAL_UUID = 'CAMPAIGN_MATERIAL_UUID';
const AMIT_GUPTA_PERSON_UUID = 'AMIT_GUPTA_PERSON_UUID';
const PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID = 'PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID';
const BLACK_TULIPS_MATERIAL_UUID = 'BLACK_TULIPS_MATERIAL_UUID';
const DAVID_EDGAR_PERSON_UUID = 'DAVID_EDGAR_PERSON_UUID';
const BLOOD_AND_GIFTS_MATERIAL_UUID = 'BLOOD_AND_GIFTS_MATERIAL_UUID';
const J_T_ROGERS_PERSON_UUID = 'J_T_ROGERS_PERSON_UUID';
const MINISKIRTS_OF_KABUL_MATERIAL_UUID = 'MINISKIRTS_OF_KABUL_MATERIAL_UUID';
const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID = 'PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID';
const HONEY_MATERIAL_UUID = 'HONEY_MATERIAL_UUID';
const BEN_OCKRENT_PERSON_UUID = 'BEN_OCKRENT_PERSON_UUID';
const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID = 'THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID';
const ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID = 'ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID';
const RICHARD_BEAN_PERSON_UUID = 'RICHARD_BEAN_PERSON_UUID';
const PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID = 'PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID';
const THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID = 'THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID';
const BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID = 'BUGLES_AT_THE_GATES_OF_JALALABAD_PRODUCTION_UUID';
const PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_TRICYCLE_PRODUCTION_UUID = 'PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_PRODUCTION_UUID';
const MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID = 'MINISKIRTS_OF_KABUL_PRODUCTION_UUID';
const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_TRICYCLE_PRODUCTION_UUID = 'PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_PRODUCTION_UUID';
const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID = 'THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_PRODUCTION_UUID';
const PART_THREE_ENDURING_FREEDOM_1996_2009_TRICYCLE_PRODUCTION_UUID = 'PART_THREE_ENDURING_FREEDOM_1996_2009_PRODUCTION_UUID';
const THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID = 'THE_GREAT_GAME_AFGHANISTAN_PRODUCTION_UUID';

let theGreatGameAfghanistanMaterial;
let partOneInvasionsAndIndependenceMaterial;
let buglesAtTheGatesOfJalalabadMaterial;
let barCharacter;
let theGreatGameAfghanistanTricycleProduction;
let partOneInvasionsAndIndependenceTricycleProduction;
let buglesAtTheGateOfJalalabadTricycleProduction;
let ferdinandFooPerson;
let fictioneersLtdCompany;

const sandbox = createSandbox();

describe('Material with sub-sub-materials', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Bugles at the Gates of Jalalabad',
				subtitle: 'Bugles at the Gates of Jalalabad subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Fictioneers Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Durand\'s Line',
				subtitle: 'Durand\'s Line subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ron Hutchinson'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Campaign',
				subtitle: 'Campaign subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Amit Gupta'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part One — Invasions and Independence (1842-1930)',
				subtitle: 'Invasions and Independence subtitle',
				format: 'sub-collection of plays',
				year: '2009',
				subMaterials: [
					{
						name: 'Bugles at the Gates of Jalalabad'
					},
					{
						name: 'Durand\'s Line'
					},
					{
						name: 'Campaign'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Black Tulips',
				subtitle: 'Black Tulips subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'David Edgar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Blood and Gifts',
				subtitle: 'Blood and Gifts subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'J T Rogers'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Miniskirts of Kabul',
				subtitle: 'Miniskirts of Kabul subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Fictioneers Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
				subtitle: 'Communism, the Mujahideen and the Taliban subtitle',
				format: 'sub-collection of plays',
				year: '2009',
				subMaterials: [
					{
						name: 'Black Tulips'
					},
					{
						name: 'Blood and Gifts'
					},
					{
						name: 'Miniskirts of Kabul'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Honey',
				subtitle: 'Honey subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ben Ockrent'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Night Is Darkest Before the Dawn',
				subtitle: 'The Night Is Darkest Before the Dawn subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Fictioneers Ltd'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'On the Side of the Angels',
				subtitle: 'On the Side of the Angels subtitle',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Richard Bean'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part Three — Enduring Freedom (1996-2009)',
				subtitle: 'Enduring Freedom subtitle',
				format: 'sub-collection of plays',
				year: '2009',
				subMaterials: [
					{
						name: 'Honey'
					},
					{
						name: 'The Night Is Darkest Before the Dawn'
					},
					{
						name: 'On the Side of the Angels'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Great Game: Afghanistan',
				subtitle: 'Distrust, Diplomatic Intrigue, and Regional Wars',
				format: 'collection of plays',
				year: '2009',
				subMaterials: [
					{
						name: 'Part One — Invasions and Independence (1842-1930)'
					},
					{
						name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)'
					},
					{
						name: 'Part Three — Enduring Freedom (1996-2009)'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Bugles at the Gates of Jalalabad',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Bugles at the Gates of Jalalabad'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part One — Invasions and Independence (1842-1930)',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part One — Invasions and Independence (1842-1930)'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Miniskirts of Kabul',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Miniskirts of Kabul'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Night Is Darkest Before the Dawn',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'The Night Is Darkest Before the Dawn'
				},
				venue: {
					name: 'Tricycle Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part Three — Enduring Freedom (1996-2009)',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part Three — Enduring Freedom (1996-2009)'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Great Game: Afghanistan',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'The Great Game: Afghanistan'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: PART_THREE_ENDURING_FREEDOM_1996_2009_TRICYCLE_PRODUCTION_UUID
					}
				]
			});

		theGreatGameAfghanistanMaterial = await chai.request(app)
			.get(`/materials/${THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID}`);

		partOneInvasionsAndIndependenceMaterial = await chai.request(app)
			.get(`/materials/${PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID}`);

		buglesAtTheGatesOfJalalabadMaterial = await chai.request(app)
			.get(`/materials/${BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID}`);

		barCharacter = await chai.request(app)
			.get(`/characters/${BAR_CHARACTER_UUID}`);

		theGreatGameAfghanistanTricycleProduction = await chai.request(app)
			.get(`/productions/${THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID}`);

		partOneInvasionsAndIndependenceTricycleProduction = await chai.request(app)
			.get(`/productions/${PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_TRICYCLE_PRODUCTION_UUID}`);

		buglesAtTheGateOfJalalabadTricycleProduction = await chai.request(app)
			.get(`/productions/${BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID}`);

		ferdinandFooPerson = await chai.request(app)
			.get(`/people/${FERDINAND_FOO_PERSON_UUID}`);

		fictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${FICTIONEERS_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Great Game: Afghanistan (material with sub-sub-materials)', () => {

		it('includes its sub-materials and sub-sub-materials', () => {

			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
					name: 'Part One — Invasions and Independence (1842-1930)',
					subtitle: 'Invasions and Independence subtitle',
					format: 'sub-collection of plays',
					year: 2009,
					writingCredits: [],
					originalVersionMaterial: null,
					subMaterials: [
						{
							model: 'MATERIAL',
							uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
							name: 'Bugles at the Gates of Jalalabad',
							subtitle: 'Bugles at the Gates of Jalalabad subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										},
										{
											model: 'COMPANY',
											uuid: FICTIONEERS_LTD_COMPANY_UUID,
											name: 'Fictioneers Ltd'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: [
								{
									model: 'CHARACTER_GROUP',
									name: null,
									position: null,
									characters: [
										{
											model: 'CHARACTER',
											uuid: BAR_CHARACTER_UUID,
											name: 'Bar',
											qualifier: null
										}
									]
								}
							]
						},
						{
							model: 'MATERIAL',
							uuid: DURANDS_LINE_MATERIAL_UUID,
							name: 'Durand\'s Line',
							subtitle: 'Durand\'s Line subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: RON_HUTCHINSON_PERSON_UUID,
											name: 'Ron Hutchinson'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: []
						},
						{
							model: 'MATERIAL',
							uuid: CAMPAIGN_MATERIAL_UUID,
							name: 'Campaign',
							subtitle: 'Campaign subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: AMIT_GUPTA_PERSON_UUID,
											name: 'Amit Gupta'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: []
						}
					],
					characterGroups: []
				},
				{
					model: 'MATERIAL',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID,
					name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
					subtitle: 'Communism, the Mujahideen and the Taliban subtitle',
					format: 'sub-collection of plays',
					year: 2009,
					writingCredits: [],
					originalVersionMaterial: null,
					subMaterials: [
						{
							model: 'MATERIAL',
							uuid: BLACK_TULIPS_MATERIAL_UUID,
							name: 'Black Tulips',
							subtitle: 'Black Tulips subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: DAVID_EDGAR_PERSON_UUID,
											name: 'David Edgar'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: []
						},
						{
							model: 'MATERIAL',
							uuid: BLOOD_AND_GIFTS_MATERIAL_UUID,
							name: 'Blood and Gifts',
							subtitle: 'Blood and Gifts subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: J_T_ROGERS_PERSON_UUID,
											name: 'J T Rogers'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: []
						},
						{
							model: 'MATERIAL',
							uuid: MINISKIRTS_OF_KABUL_MATERIAL_UUID,
							name: 'Miniskirts of Kabul',
							subtitle: 'Miniskirts of Kabul subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										},
										{
											model: 'COMPANY',
											uuid: FICTIONEERS_LTD_COMPANY_UUID,
											name: 'Fictioneers Ltd'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: [
								{
									model: 'CHARACTER_GROUP',
									name: null,
									position: null,
									characters: [
										{
											model: 'CHARACTER',
											uuid: BAR_CHARACTER_UUID,
											name: 'Bar',
											qualifier: null
										}
									]
								}
							]
						}
					],
					characterGroups: []
				},
				{
					model: 'MATERIAL',
					uuid: PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID,
					name: 'Part Three — Enduring Freedom (1996-2009)',
					subtitle: 'Enduring Freedom subtitle',
					format: 'sub-collection of plays',
					year: 2009,
					writingCredits: [],
					originalVersionMaterial: null,
					subMaterials: [
						{
							model: 'MATERIAL',
							uuid: HONEY_MATERIAL_UUID,
							name: 'Honey',
							subtitle: 'Honey subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: BEN_OCKRENT_PERSON_UUID,
											name: 'Ben Ockrent'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: []
						},
						{
							model: 'MATERIAL',
							uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID,
							name: 'The Night Is Darkest Before the Dawn',
							subtitle: 'The Night Is Darkest Before the Dawn subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										},
										{
											model: 'COMPANY',
											uuid: FICTIONEERS_LTD_COMPANY_UUID,
											name: 'Fictioneers Ltd'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: [
								{
									model: 'CHARACTER_GROUP',
									name: null,
									position: null,
									characters: [
										{
											model: 'CHARACTER',
											uuid: BAR_CHARACTER_UUID,
											name: 'Bar',
											qualifier: null
										}
									]
								}
							]
						},
						{
							model: 'MATERIAL',
							uuid: ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID,
							name: 'On the Side of the Angels',
							subtitle: 'On the Side of the Angels subtitle',
							format: 'play',
							year: 2009,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: RICHARD_BEAN_PERSON_UUID,
											name: 'Richard Bean'
										}
									]
								}
							],
							originalVersionMaterial: null,
							characterGroups: []
						}
					],
					characterGroups: []
				}
			];

			const { subMaterials } = theGreatGameAfghanistanMaterial.body;

			expect(subMaterials).to.deep.equal(expectedSubMaterials);

		});

	});

	describe('Part One — Invasions and Independence (1842-1930) (material with sur-material and sub-materials)', () => {

		it('includes The Great Game: Afghanistan as its sur-material', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
				name: 'The Great Game: Afghanistan',
				subtitle: 'Distrust, Diplomatic Intrigue, and Regional Wars',
				format: 'collection of plays',
				year: 2009,
				writingCredits: [],
				originalVersionMaterial: null,
				surMaterial: null,
				characterGroups: []
			};

			const { surMaterial } = partOneInvasionsAndIndependenceMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

		it('includes its sub-materials', () => {

			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					subtitle: 'Bugles at the Gates of Jalalabad subtitle',
					format: 'play',
					year: 2009,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					],
					originalVersionMaterial: null,
					subMaterials: [],
					characterGroups: [
						{
							model: 'CHARACTER_GROUP',
							name: null,
							position: null,
							characters: [
								{
									model: 'CHARACTER',
									uuid: BAR_CHARACTER_UUID,
									name: 'Bar',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: DURANDS_LINE_MATERIAL_UUID,
					name: 'Durand\'s Line',
					subtitle: 'Durand\'s Line subtitle',
					format: 'play',
					year: 2009,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RON_HUTCHINSON_PERSON_UUID,
									name: 'Ron Hutchinson'
								}
							]
						}
					],
					originalVersionMaterial: null,
					subMaterials: [],
					characterGroups: []
				},
				{
					model: 'MATERIAL',
					uuid: CAMPAIGN_MATERIAL_UUID,
					name: 'Campaign',
					subtitle: 'Campaign subtitle',
					format: 'play',
					year: 2009,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: AMIT_GUPTA_PERSON_UUID,
									name: 'Amit Gupta'
								}
							]
						}
					],
					originalVersionMaterial: null,
					subMaterials: [],
					characterGroups: []
				}
			];

			const { subMaterials } = partOneInvasionsAndIndependenceMaterial.body;

			expect(subMaterials).to.deep.equal(expectedSubMaterials);

		});

	});

	describe('Bugles at the Gates of Jalalabad (material with sur-sur-material)', () => {

		it('includes Part One — Invasions and Independence (1842-1930) as its sur-material and The Great Game: Afghanistan as its sur-sur-material', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
				name: 'Part One — Invasions and Independence (1842-1930)',
				subtitle: 'Invasions and Independence subtitle',
				format: 'sub-collection of plays',
				year: 2009,
				writingCredits: [],
				originalVersionMaterial: null,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
					name: 'The Great Game: Afghanistan',
					subtitle: 'Distrust, Diplomatic Intrigue, and Regional Wars',
					format: 'collection of plays',
					year: 2009,
					writingCredits: [],
					originalVersionMaterial: null,
					characterGroups: []
				},
				characterGroups: []
			};

			const { surMaterial } = buglesAtTheGatesOfJalalabadMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

	});

	describe('Bar (character)', () => {

		it('includes materials in which character was depicted, including the sur-material and sur-sur-material', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID,
						name: 'Part Three — Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: MINISKIRTS_OF_KABUL_MATERIAL_UUID,
					name: 'Miniskirts of Kabul',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID,
						name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
						name: 'Part One — Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = barCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('The Great Game: Afghanistan at Tricycle Theatre (production)', () => {

		it('includes the material (but with no sur-material as does not apply)', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
				name: 'The Great Game: Afghanistan',
				format: 'collection of plays',
				year: 2009,
				surMaterial: null,
				writingCredits: []
			};

			const { material } = theGreatGameAfghanistanTricycleProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Part One — Invasions and Independence (1842-1930) at Tricycle Theatre (production)', () => {

		it('includes the material and its sur-material', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
				name: 'Part One — Invasions and Independence (1842-1930)',
				format: 'sub-collection of plays',
				year: 2009,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
					name: 'The Great Game: Afghanistan',
					surMaterial: null
				},
				writingCredits: []
			};

			const { material } = partOneInvasionsAndIndependenceTricycleProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Bugles at the Gates of Jalalabad at Tricycle Theatre (production)', () => {

		it('includes the material and its sur-material and sur-sur-material', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
				name: 'Bugles at the Gates of Jalalabad',
				format: 'play',
				year: 2009,
				surMaterial: {
					model: 'MATERIAL',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
					name: 'Part One — Invasions and Independence (1842-1930)',
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
						name: 'The Great Game: Afghanistan'
					}
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: FERDINAND_FOO_PERSON_UUID,
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								uuid: FICTIONEERS_LTD_COMPANY_UUID,
								name: 'Fictioneers Ltd'
							}
						]
					}
				]
			};

			const { material } = buglesAtTheGateOfJalalabadTricycleProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Ferdinand Foo (person)', () => {

		it('includes materials with corresponding sur-material and sur-sur-materials; will exclude sur-materials and sur-sur-materials when included via sub-material or sub-sub-material associations', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID,
						name: 'Part Three — Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: MINISKIRTS_OF_KABUL_MATERIAL_UUID,
					name: 'Miniskirts of Kabul',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID,
						name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
						name: 'Part One — Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
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
			];

			const { materials } = ferdinandFooPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Fictioneers Ltd (company)', () => {

		it('includes materials with corresponding sur-material and sur-sur-materials; will exclude sur-materials and sur-sur-materials when included via sub-material or sub-sub-material associations', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID,
						name: 'Part Three — Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: MINISKIRTS_OF_KABUL_MATERIAL_UUID,
					name: 'Miniskirts of Kabul',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID,
						name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
						name: 'Part One — Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
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
			];

			const { materials } = fictioneersLtdCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('materials list', () => {

		it('includes materials with corresponding sur-material and sur-sur-materials; will exclude sur-materials and sur-sur-materials as these will be included via sub-material and sub-sub-material associations', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID,
					name: 'On the Side of the Angels',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID,
						name: 'Part Three — Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RICHARD_BEAN_PERSON_UUID,
									name: 'Richard Bean'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID,
						name: 'Part Three — Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: HONEY_MATERIAL_UUID,
					name: 'Honey',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_1996_2009_MATERIAL_UUID,
						name: 'Part Three — Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: BEN_OCKRENT_PERSON_UUID,
									name: 'Ben Ockrent'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: MINISKIRTS_OF_KABUL_MATERIAL_UUID,
					name: 'Miniskirts of Kabul',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID,
						name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: FICTIONEERS_LTD_COMPANY_UUID,
									name: 'Fictioneers Ltd'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: BLOOD_AND_GIFTS_MATERIAL_UUID,
					name: 'Blood and Gifts',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID,
						name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: J_T_ROGERS_PERSON_UUID,
									name: 'J T Rogers'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: BLACK_TULIPS_MATERIAL_UUID,
					name: 'Black Tulips',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_1979_1996_MATERIAL_UUID,
						name: 'Part Two — Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: DAVID_EDGAR_PERSON_UUID,
									name: 'David Edgar'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: CAMPAIGN_MATERIAL_UUID,
					name: 'Campaign',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
						name: 'Part One — Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: AMIT_GUPTA_PERSON_UUID,
									name: 'Amit Gupta'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: DURANDS_LINE_MATERIAL_UUID,
					name: 'Durand\'s Line',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
						name: 'Part One — Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RON_HUTCHINSON_PERSON_UUID,
									name: 'Ron Hutchinson'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_1842_1930_MATERIAL_UUID,
						name: 'Part One — Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
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
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
