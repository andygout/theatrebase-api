import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID = 'BRING_UP_THE_BODIES_1_MATERIAL_UUID';
const HILARY_MANTEL_PERSON_UUID = 'HILARY_MANTEL_PERSON_UUID';
const THE_MANTEL_GROUP_COMPANY_UUID = 'THE_MANTEL_GROUP_COMPANY_UUID';
const THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID = 'THE_WOLF_HALL_TRILOGY_1_MATERIAL_UUID';
const BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID = 'BRING_UP_THE_BODIES_2_MATERIAL_UUID';
const MIKE_POULTON_PERSON_UUID = 'MIKE_POULTON_PERSON_UUID';
const ROYAL_SHAKESPEARE_COMPANY_UUID = 'ROYAL_SHAKESPEARE_COMPANY_COMPANY_UUID';
const THOMAS_CROMWELL_CHARACTER_UUID = 'THOMAS_CROMWELL_CHARACTER_UUID';
const THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID = 'THE_WOLF_HALL_TRILOGY_2_MATERIAL_UUID';
const BRING_UP_THE_BODIES_SWAN_PRODUCTION_UUID = 'BRING_UP_THE_BODIES_PRODUCTION_UUID';
const SWAN_THEATRE_VENUE_UUID = 'SWAN_THEATRE_VENUE_UUID';
const THE_WOLF_HALL_TRILOGY_SWAN_PRODUCTION_UUID = 'THE_WOLF_HALL_TRILOGY_PRODUCTION_UUID';
const BRING_UP_THE_BODIES_ALDWYCH_PRODUCTION_UUID = 'BRING_UP_THE_BODIES_2_PRODUCTION_UUID';
const ALDWYCH_THEATRE_VENUE_UUID = 'ALDWYCH_THEATRE_VENUE_UUID';
const THE_WOLF_HALL_TRILOGY_ALDWYCH_PRODUCTION_UUID = 'THE_WOLF_HALL_TRILOGY_2_PRODUCTION_UUID';
const THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_NOVEL_MATERIAL_UUID = 'THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_1_MATERIAL_UUID';
const CHARLES_DICKENS_PERSON_UUID = 'CHARLES_DICKENS_PERSON_UUID';
const DOMBEY_AND_SON_LTD_COMPANY_UUID = 'DOMBEY_AND_SON_LTD_COMPANY_UUID';
const THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PART_I_PLAY_MATERIAL_UUID = 'THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PART_I_MATERIAL_UUID';
const DAVID_EDGAR_PERSON_UUID = 'DAVID_EDGAR_PERSON_UUID';
const EDGAR_WORKS_LTD_COMPANY_UUID = 'EDGAR_WORKS_LTD_COMPANY_UUID';
const THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PLAYS_MATERIAL_UUID = 'THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_2_MATERIAL_UUID';
const THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PART_I_GIELGUD_PRODUCTION_UUID = 'THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PART_I_PRODUCTION_UUID';
const GIELGUD_THEATRE_VENUE_UUID = 'GIELGUD_THEATRE_VENUE_UUID';
const THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_GIELGUD_PRODUCTION_UUID = 'THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PRODUCTION_UUID';
const WALDO_MATERIAL_UUID = 'WALDO_MATERIAL_UUID';
const JANE_ROE_PERSON_UUID = 'JANE_ROE_PERSON_UUID';
const FICTIONEERS_LTD_COMPANY_UUID = 'FICTIONEERS_LTD_COMPANY_UUID';
const SUB_WIBBLE_MATERIAL_UUID = 'SUB_WIBBLE_MATERIAL_UUID';
const QUINCY_QUX_I_PERSON_UUID = 'QUINCY_QUX_I_PERSON_UUID';
const OLD_THEATRICALS_LTD_COMPANY_UUID = 'OLD_THEATRICALS_LTD_COMPANY_UUID';
const SUR_WIBBLE_MATERIAL_UUID = 'SUR_WIBBLE_MATERIAL_UUID';
const SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID = 'SUB_WIBBLE_PRODUCTION_UUID';
const WIBBLE_MATERIAL_UUID = 'WIBBLE_MATERIAL_UUID';
const QUINCY_QUX_II_PERSON_UUID = 'QUINCY_QUX_II_PERSON_UUID';
const NEW_THEATRICALS_LTD_COMPANY_UUID = 'NEW_THEATRICALS_LTD_COMPANY_UUID';
const OLD_VIC_THEATRE_VENUE_UUID = 'OLD_VIC_THEATRE_VENUE_UUID';
const SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID = 'SUR_WIBBLE_PRODUCTION_UUID';

let bringUpTheBodiesNovelMaterial;
let bringUpTheBodiesPlayMaterial;
let hilaryMantelPerson;
let mikePoultonPerson;
let theMantelGroupCompany;
let royalShakespeareCompany;
let bringUpTheBodiesSwanTheatreProduction;
let thomasCromwellCharacter;
let theLifeAndAdventuresOfNicholasNicklebyNovelMaterial;
let waldoMaterial;
let janeRoePerson;
let fictioneersLtdCompany;

const sandbox = createSandbox();

describe('Material with sub-materials and source materials thereof', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Bring Up the Bodies',
				differentiator: '1',
				format: 'novel',
				year: '2012',
				writingCredits: [
					{
						entities: [
							{
								name: 'Hilary Mantel'
							},
							{
								model: 'COMPANY',
								name: 'The Mantel Group'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Wolf Hall Trilogy',
				differentiator: '1',
				format: 'trilogy of novels',
				year: '2020',
				writingCredits: [
					{
						entities: [
							{
								name: 'Hilary Mantel'
							},
							{
								model: 'COMPANY',
								name: 'The Mantel Group'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Bring Up the Bodies',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Bring Up the Bodies',
				differentiator: '2',
				format: 'play',
				year: '2013',
				writingCredits: [
					{
						entities: [
							{
								name: 'Mike Poulton'
							},
							{
								model: 'COMPANY',
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Bring Up the Bodies',
								differentiator: '1'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Thomas Cromwell'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Wolf Hall Trilogy',
				differentiator: '2',
				format: 'trilogy of plays',
				year: '2021',
				writingCredits: [
					{
						entities: [
							{
								name: 'Mike Poulton'
							},
							{
								model: 'COMPANY',
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Wolf Hall Trilogy',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Bring Up the Bodies',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Bring Up the Bodies',
				startDate: '2013-12-19',
				pressDate: '2014-01-08',
				endDate: '2014-03-29',
				material: {
					name: 'Bring Up the Bodies',
					differentiator: '2'
				},
				venue: {
					name: 'Swan Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Wolf Hall Trilogy',
				startDate: '2013-12-19',
				pressDate: '2014-01-08',
				endDate: '2014-03-29',
				material: {
					name: 'The Wolf Hall Trilogy',
					differentiator: '2'
				},
				venue: {
					name: 'Swan Theatre'
				},
				subProductions: [
					{
						uuid: BRING_UP_THE_BODIES_SWAN_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Bring Up the Bodies',
				startDate: '2014-05-01',
				pressDate: '2014-05-17',
				endDate: '2014-09-06',
				material: {
					name: 'Bring Up the Bodies',
					differentiator: '2'
				},
				venue: {
					name: 'Aldwych Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Wolf Hall Trilogy',
				startDate: '2014-05-01',
				pressDate: '2014-05-17',
				endDate: '2014-09-06',
				material: {
					name: 'The Wolf Hall Trilogy',
					differentiator: '2'
				},
				venue: {
					name: 'Aldwych Theatre'
				},
				subProductions: [
					{
						uuid: BRING_UP_THE_BODIES_ALDWYCH_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Life and Adventures of Nicholas Nickleby',
				differentiator: '1',
				format: 'novel',
				year: '1839',
				writingCredits: [
					{
						entities: [
							{
								name: 'Charles Dickens'
							},
							{
								model: 'COMPANY',
								name: 'Dombey and Son Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Life and Adventures of Nicholas Nickleby: Part I',
				format: 'play',
				year: '1980',
				writingCredits: [
					{
						name: 'adapted for the stage by',
						entities: [
							{
								name: 'David Edgar'
							},
							{
								model: 'COMPANY',
								name: 'Edgar Works Ltd'
							}
						]
					},
					{
						name: 'from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Life and Adventures of Nicholas Nickleby',
								differentiator: '1'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Life and Adventures of Nicholas Nickleby',
				differentiator: '2',
				format: 'play in two parts',
				year: '1980',
				writingCredits: [
					{
						name: 'adapted for the stage by',
						entities: [
							{
								name: 'David Edgar'
							},
							{
								model: 'COMPANY',
								name: 'Edgar Works Ltd'
							}
						]
					},
					{
						name: 'from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Life and Adventures of Nicholas Nickleby',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Life and Adventures of Nicholas Nickleby: Part I'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Life and Adventures of Nicholas Nickleby: Part I',
				startDate: '2007-12-07',
				pressDate: '2007-12-08',
				endDate: '2008-01-27',
				material: {
					name: 'The Life and Adventures of Nicholas Nickleby: Part I'
				},
				venue: {
					name: 'Gielgud Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Life and Adventures of Nicholas Nickleby',
				startDate: '2007-12-07',
				pressDate: '2007-12-08',
				endDate: '2008-01-27',
				material: {
					name: 'The Life and Adventures of Nicholas Nickleby',
					differentiator: '2'
				},
				venue: {
					name: 'Gielgud Theatre'
				},
				subProductions: [
					{
						uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PART_I_GIELGUD_PRODUCTION_UUID
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
				name: 'Sub-Wibble',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux I'
							},
							{
								model: 'COMPANY',
								name: 'Old Theatricals Ltd'
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
				name: 'Sur-Wibble',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux I'
							},
							{
								model: 'COMPANY',
								name: 'Old Theatricals Ltd'
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
				name: 'Wibble',
				format: 'play',
				year: '2023',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux II'
							},
							{
								model: 'COMPANY',
								name: 'New Theatricals Ltd'
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
			.post('/productions')
			.send({
				name: 'Sub-Wibble',
				startDate: '2002-02-26',
				pressDate: '2002-02-27',
				endDate: '2002-02-28',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Old Vic Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2002-02-26',
				pressDate: '2002-02-27',
				endDate: '2002-02-28',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Old Vic Theatre'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID
					}
				]
			});

		bringUpTheBodiesNovelMaterial = await chai.request(app)
			.get(`/materials/${BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID}`);

		bringUpTheBodiesPlayMaterial = await chai.request(app)
			.get(`/materials/${BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID}`);

		hilaryMantelPerson = await chai.request(app)
			.get(`/people/${HILARY_MANTEL_PERSON_UUID}`);

		mikePoultonPerson = await chai.request(app)
			.get(`/people/${MIKE_POULTON_PERSON_UUID}`);

		theMantelGroupCompany = await chai.request(app)
			.get(`/companies/${THE_MANTEL_GROUP_COMPANY_UUID}`);

		royalShakespeareCompany = await chai.request(app)
			.get(`/companies/${ROYAL_SHAKESPEARE_COMPANY_UUID}`);

		bringUpTheBodiesSwanTheatreProduction = await chai.request(app)
			.get(`/productions/${BRING_UP_THE_BODIES_SWAN_PRODUCTION_UUID}`);

		thomasCromwellCharacter = await chai.request(app)
			.get(`/characters/${THOMAS_CROMWELL_CHARACTER_UUID}`);

		theLifeAndAdventuresOfNicholasNicklebyNovelMaterial = await chai.request(app)
			.get(`/materials/${THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_NOVEL_MATERIAL_UUID}`);

		waldoMaterial = await chai.request(app)
			.get(`/materials/${WALDO_MATERIAL_UUID}`);

		janeRoePerson = await chai.request(app)
			.get(`/people/${JANE_ROE_PERSON_UUID}`);

		fictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${FICTIONEERS_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Bring Up the Bodies (novel) (material)', () => {

		it('includes materials that used it as source material, with corresponding sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
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

			const { sourcingMaterials } = bringUpTheBodiesNovelMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of material that used it as source material, including the sur-production', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: BRING_UP_THE_BODIES_ALDWYCH_PRODUCTION_UUID,
					name: 'Bring Up the Bodies',
					startDate: '2014-05-01',
					endDate: '2014-09-06',
					venue: {
						model: 'VENUE',
						uuid: ALDWYCH_THEATRE_VENUE_UUID,
						name: 'Aldwych Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_WOLF_HALL_TRILOGY_ALDWYCH_PRODUCTION_UUID,
						name: 'The Wolf Hall Trilogy',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BRING_UP_THE_BODIES_SWAN_PRODUCTION_UUID,
					name: 'Bring Up the Bodies',
					startDate: '2013-12-19',
					endDate: '2014-03-29',
					venue: {
						model: 'VENUE',
						uuid: SWAN_THEATRE_VENUE_UUID,
						name: 'Swan Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_WOLF_HALL_TRILOGY_SWAN_PRODUCTION_UUID,
						name: 'The Wolf Hall Trilogy',
						surProduction: null
					}
				}
			];

			const { sourcingMaterialProductions } = bringUpTheBodiesNovelMaterial.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Bring Up the Bodies (play) (material)', () => {

		it('includes writers of this material and its source material (with corresponding sur-material) grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: MIKE_POULTON_PERSON_UUID,
							name: 'Mike Poulton'
						},
						{
							model: 'COMPANY',
							uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
							name: 'Royal Shakespeare Company'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'adapted from',
					entities: [
						{
							model: 'MATERIAL',
							uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
							name: 'Bring Up the Bodies',
							format: 'novel',
							year: 2012,
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
								name: 'The Wolf Hall Trilogy',
								surMaterial: null
							},
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: HILARY_MANTEL_PERSON_UUID,
											name: 'Hilary Mantel'
										},
										{
											model: 'COMPANY',
											uuid: THE_MANTEL_GROUP_COMPANY_UUID,
											name: 'The Mantel Group'
										}
									]
								}
							]
						}
					]
				}
			];

			const { writingCredits } = bringUpTheBodiesPlayMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

		it('includes writers and source material of this material\'s sur-material', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
				name: 'The Wolf Hall Trilogy',
				subtitle: null,
				format: 'trilogy of plays',
				year: 2021,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: MIKE_POULTON_PERSON_UUID,
								name: 'Mike Poulton'
							},
							{
								model: 'COMPANY',
								uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
								name: 'The Wolf Hall Trilogy',
								format: 'trilogy of novels',
								year: 2020,
								surMaterial: null,
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: HILARY_MANTEL_PERSON_UUID,
												name: 'Hilary Mantel'
											},
											{
												model: 'COMPANY',
												uuid: THE_MANTEL_GROUP_COMPANY_UUID,
												name: 'The Mantel Group'
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

			const { surMaterial } = bringUpTheBodiesPlayMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

	});

	describe('Hilary Mantel (person)', () => {

		it('includes materials that used their work as source material, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
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

			const { sourcingMaterials } = hilaryMantelPerson.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of materials that used their work as source material, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: BRING_UP_THE_BODIES_ALDWYCH_PRODUCTION_UUID,
					name: 'Bring Up the Bodies',
					startDate: '2014-05-01',
					endDate: '2014-09-06',
					venue: {
						model: 'VENUE',
						uuid: ALDWYCH_THEATRE_VENUE_UUID,
						name: 'Aldwych Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_WOLF_HALL_TRILOGY_ALDWYCH_PRODUCTION_UUID,
						name: 'The Wolf Hall Trilogy',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BRING_UP_THE_BODIES_SWAN_PRODUCTION_UUID,
					name: 'Bring Up the Bodies',
					startDate: '2013-12-19',
					endDate: '2014-03-29',
					venue: {
						model: 'VENUE',
						uuid: SWAN_THEATRE_VENUE_UUID,
						name: 'Swan Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_WOLF_HALL_TRILOGY_SWAN_PRODUCTION_UUID,
						name: 'The Wolf Hall Trilogy',
						surProduction: null
					}
				}
			];

			const { sourcingMaterialProductions } = hilaryMantelPerson.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('The Mantel Group (company)', () => {

		it('includes materials that used their work as source material, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
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

			const { sourcingMaterials } = theMantelGroupCompany.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of materials that used their work as source material, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: BRING_UP_THE_BODIES_ALDWYCH_PRODUCTION_UUID,
					name: 'Bring Up the Bodies',
					startDate: '2014-05-01',
					endDate: '2014-09-06',
					venue: {
						model: 'VENUE',
						uuid: ALDWYCH_THEATRE_VENUE_UUID,
						name: 'Aldwych Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_WOLF_HALL_TRILOGY_ALDWYCH_PRODUCTION_UUID,
						name: 'The Wolf Hall Trilogy',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: BRING_UP_THE_BODIES_SWAN_PRODUCTION_UUID,
					name: 'Bring Up the Bodies',
					startDate: '2013-12-19',
					endDate: '2014-03-29',
					venue: {
						model: 'VENUE',
						uuid: SWAN_THEATRE_VENUE_UUID,
						name: 'Swan Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_WOLF_HALL_TRILOGY_SWAN_PRODUCTION_UUID,
						name: 'The Wolf Hall Trilogy',
						surProduction: null
					}
				}
			];

			const { sourcingMaterialProductions } = theMantelGroupCompany.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Mike Poulton (person)', () => {

		it('includes materials they have written, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
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

			const { materials } = mikePoultonPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Royal Shakespeare Company (company)', () => {

		it('includes materials it has written, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
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

			const { materials } = royalShakespeareCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Bring Up the Bodies at Swan Theatre (production)', () => {

		it('includes in its material data the writers of the material and its source material (with corresponding sur-material)', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
				name: 'Bring Up the Bodies',
				format: 'play',
				year: 2013,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
					name: 'The Wolf Hall Trilogy',
					surMaterial: null
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: MIKE_POULTON_PERSON_UUID,
								name: 'Mike Poulton'
							},
							{
								model: 'COMPANY',
								uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
								name: 'Bring Up the Bodies',
								format: 'novel',
								year: 2012,
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
									name: 'The Wolf Hall Trilogy',
									surMaterial: null
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: HILARY_MANTEL_PERSON_UUID,
												name: 'Hilary Mantel'
											},
											{
												model: 'COMPANY',
												uuid: THE_MANTEL_GROUP_COMPANY_UUID,
												name: 'The Mantel Group'
											}
										]
									}
								]
							}
						]
					}
				]
			};

			const { material } = bringUpTheBodiesSwanTheatreProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Thomas Cromwell (character)', () => {

		it('includes in its material data the writers of the material and its source material (with corresponding sur-material)', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
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

			const { materials } = thomasCromwellCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('The Life and Adventures of Nicholas Nickleby (novel) (material): single source material is attached to multiple tiers of sourcing material', () => {

		it('includes materials that used it as source material, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PART_I_PLAY_MATERIAL_UUID,
					name: 'The Life and Adventures of Nicholas Nickleby: Part I',
					format: 'play',
					year: 1980,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PLAYS_MATERIAL_UUID,
						name: 'The Life and Adventures of Nicholas Nickleby',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for the stage by',
							entities: [
								{
									model: 'PERSON',
									uuid: DAVID_EDGAR_PERSON_UUID,
									name: 'David Edgar'
								},
								{
									model: 'COMPANY',
									uuid: EDGAR_WORKS_LTD_COMPANY_UUID,
									name: 'Edgar Works Ltd'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_NOVEL_MATERIAL_UUID,
									name: 'The Life and Adventures of Nicholas Nickleby',
									format: 'novel',
									year: 1839,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: CHARLES_DICKENS_PERSON_UUID,
													name: 'Charles Dickens'
												},
												{
													model: 'COMPANY',
													uuid: DOMBEY_AND_SON_LTD_COMPANY_UUID,
													name: 'Dombey and Son Ltd'
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

			const { sourcingMaterials } = theLifeAndAdventuresOfNicholasNicklebyNovelMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of material that used it as source material, including the sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PART_I_GIELGUD_PRODUCTION_UUID,
					name: 'The Life and Adventures of Nicholas Nickleby: Part I',
					startDate: '2007-12-07',
					endDate: '2008-01-27',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_GIELGUD_PRODUCTION_UUID,
						name: 'The Life and Adventures of Nicholas Nickleby',
						surProduction: null
					}
				}
			];

			const { sourcingMaterialProductions } = theLifeAndAdventuresOfNicholasNicklebyNovelMaterial.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Waldo (novel, 1974) (material): single source material is attached to multiple tiers of sourcing material, and a separate sourcing material is attached to multiple tiers of a production', () => {

		it('includes materials that used it as source material, with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: WIBBLE_MATERIAL_UUID,
					name: 'Wibble',
					format: 'play',
					year: 2023,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: QUINCY_QUX_II_PERSON_UUID,
									name: 'Quincy Qux II'
								},
								{
									model: 'COMPANY',
									uuid: NEW_THEATRICALS_LTD_COMPANY_UUID,
									name: 'New Theatricals Ltd'
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
				},
				{
					model: 'MATERIAL',
					uuid: SUB_WIBBLE_MATERIAL_UUID,
					name: 'Sub-Wibble',
					format: 'play',
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
									uuid: QUINCY_QUX_I_PERSON_UUID,
									name: 'Quincy Qux I'
								},
								{
									model: 'COMPANY',
									uuid: OLD_THEATRICALS_LTD_COMPANY_UUID,
									name: 'Old Theatricals Ltd'
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
			];

			const { sourcingMaterials } = waldoMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of materials that used it as source material, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
					name: 'Sub-Wibble',
					startDate: '2002-02-26',
					endDate: '2002-02-28',
					venue: {
						model: 'VENUE',
						uuid: OLD_VIC_THEATRE_VENUE_UUID,
						name: 'Old Vic Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				}
			];

			const { sourcingMaterialProductions } = waldoMaterial.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Jane Roe (person): single material that used their work as source material is attached to multiple tiers of a production', () => {

		it('includes productions of material that used it as source material, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
					name: 'Sub-Wibble',
					startDate: '2002-02-26',
					endDate: '2002-02-28',
					venue: {
						model: 'VENUE',
						uuid: OLD_VIC_THEATRE_VENUE_UUID,
						name: 'Old Vic Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				}
			];

			const { sourcingMaterialProductions } = janeRoePerson.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Fictioneers Ltd (company): single material that used their work as source material is attached to multiple tiers of a production', () => {

		it('includes productions of material that used it as source material, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
					name: 'Sub-Wibble',
					startDate: '2002-02-26',
					endDate: '2002-02-28',
					venue: {
						model: 'VENUE',
						uuid: OLD_VIC_THEATRE_VENUE_UUID,
						name: 'Old Vic Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				}
			];

			const { sourcingMaterialProductions } = fictioneersLtdCompany.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('materials list', () => {

		it('includes writers of the materials and their corresponding source material (with corresponding sur-material)', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: WIBBLE_MATERIAL_UUID,
					name: 'Wibble',
					format: 'play',
					year: 2023,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: QUINCY_QUX_II_PERSON_UUID,
									name: 'Quincy Qux II'
								},
								{
									model: 'COMPANY',
									uuid: NEW_THEATRICALS_LTD_COMPANY_UUID,
									name: 'New Theatricals Ltd'
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
				},
				{
					model: 'MATERIAL',
					uuid: BRING_UP_THE_BODIES_PLAY_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'play',
					year: 2013,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_PLAYS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: MIKE_POULTON_PERSON_UUID,
									name: 'Mike Poulton'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
									name: 'Bring Up the Bodies',
									format: 'novel',
									year: 2012,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
										name: 'The Wolf Hall Trilogy',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: HILARY_MANTEL_PERSON_UUID,
													name: 'Hilary Mantel'
												},
												{
													model: 'COMPANY',
													uuid: THE_MANTEL_GROUP_COMPANY_UUID,
													name: 'The Mantel Group'
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
					uuid: BRING_UP_THE_BODIES_NOVEL_MATERIAL_UUID,
					name: 'Bring Up the Bodies',
					format: 'novel',
					year: 2012,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_WOLF_HALL_TRILOGY_NOVELS_MATERIAL_UUID,
						name: 'The Wolf Hall Trilogy',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HILARY_MANTEL_PERSON_UUID,
									name: 'Hilary Mantel'
								},
								{
									model: 'COMPANY',
									uuid: THE_MANTEL_GROUP_COMPANY_UUID,
									name: 'The Mantel Group'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: SUB_WIBBLE_MATERIAL_UUID,
					name: 'Sub-Wibble',
					format: 'play',
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
									uuid: QUINCY_QUX_I_PERSON_UUID,
									name: 'Quincy Qux I'
								},
								{
									model: 'COMPANY',
									uuid: OLD_THEATRICALS_LTD_COMPANY_UUID,
									name: 'Old Theatricals Ltd'
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
				},
				{
					model: 'MATERIAL',
					uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PART_I_PLAY_MATERIAL_UUID,
					name: 'The Life and Adventures of Nicholas Nickleby: Part I',
					format: 'play',
					year: 1980,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_PLAYS_MATERIAL_UUID,
						name: 'The Life and Adventures of Nicholas Nickleby',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for the stage by',
							entities: [
								{
									model: 'PERSON',
									uuid: DAVID_EDGAR_PERSON_UUID,
									name: 'David Edgar'
								},
								{
									model: 'COMPANY',
									uuid: EDGAR_WORKS_LTD_COMPANY_UUID,
									name: 'Edgar Works Ltd'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_NOVEL_MATERIAL_UUID,
									name: 'The Life and Adventures of Nicholas Nickleby',
									format: 'novel',
									year: 1839,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: CHARLES_DICKENS_PERSON_UUID,
													name: 'Charles Dickens'
												},
												{
													model: 'COMPANY',
													uuid: DOMBEY_AND_SON_LTD_COMPANY_UUID,
													name: 'Dombey and Son Ltd'
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
				},
				{
					model: 'MATERIAL',
					uuid: THE_LIFE_AND_ADVENTURES_OF_NICHOLAS_NICKLEBY_NOVEL_MATERIAL_UUID,
					name: 'The Life and Adventures of Nicholas Nickleby',
					format: 'novel',
					year: 1839,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CHARLES_DICKENS_PERSON_UUID,
									name: 'Charles Dickens'
								},
								{
									model: 'COMPANY',
									uuid: DOMBEY_AND_SON_LTD_COMPANY_UUID,
									name: 'Dombey and Son Ltd'
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
