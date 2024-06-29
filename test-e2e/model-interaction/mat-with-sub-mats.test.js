import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const VOYAGE_MATERIAL_UUID = 'VOYAGE_MATERIAL_UUID';
const TOM_STOPPARD_PERSON_UUID = 'TOM_STOPPARD_PERSON_UUID';
const THE_STRÄUSSLER_GROUP_COMPANY_UUID = 'THE_STRAUSSLER_GROUP_COMPANY_UUID';
const ALEXANDER_HERZEN_CHARACTER_UUID = 'ALEXANDER_HERZEN_CHARACTER_UUID';
const SHIPWRECK_MATERIAL_UUID = 'SHIPWRECK_MATERIAL_UUID';
const SALVAGE_MATERIAL_UUID = 'SALVAGE_MATERIAL_UUID';
const THE_COAST_OF_UTOPIA_MATERIAL_UUID = 'THE_COAST_OF_UTOPIA_MATERIAL_UUID';
const IVAN_TURGENEV_CHARACTER_UUID = 'IVAN_TURGENEV_CHARACTER_UUID';
const VOYAGE_OLIVIER_PRODUCTION_UUID = 'VOYAGE_PRODUCTION_UUID';
const THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID = 'THE_COAST_OF_UTOPIA_PRODUCTION_UUID';
const GARPLY_MATERIAL_UUID = 'GARPLY_MATERIAL_UUID';
const CONOR_CORGE_PERSON_UUID = 'CONOR_CORGE_PERSON_UUID';
const SCRIBES_LTD_COMPANY_UUID = 'SCRIBES_LTD_COMPANY_UUID';
const SUB_GARPLY_WYNDHAMS_PRODUCTION_UUID = 'SUB_GARPLY_PRODUCTION_UUID';
const WYNDHAMS_THEATRE_VENUE_UUID = 'WYNDHAMS_THEATRE_VENUE_UUID';
const SUR_GARPLY_WYNDHAMS_PRODUCTION_UUID = 'SUR_GARPLY_PRODUCTION_UUID';

let theCoastOfUtopiaMaterial;
let voyageMaterial;
let alexanderHerzenCharacter;
let ivanTurgunevCharacter;
let theCoastOfUtopiaOlivierProduction;
let voyageOlivierProduction;
let tomStoppardPerson;
let theSträusslerGroupCompany;
let garplyMaterial;
let conorCorgePerson;
let scribesLtdCompany;

const sandbox = createSandbox();

describe('Material with sub-materials', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Voyage',
				subtitle: 'In the Thrall of German Idealistic Philosophy',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								name: 'The Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Shipwreck',
				subtitle: 'In the Year of European Revolution',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								name: 'The Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Salvage',
				subtitle: 'The Emancipation of the Serfs',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								name: 'The Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Coast of Utopia',
				subtitle: 'Romantics and Revolutionaries in an Age of Emperors',
				format: 'trilogy of plays',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								name: 'The Sträussler Group'
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
								name: 'Ivan Turgenev'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Voyage',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'Voyage'
				},
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Coast of Utopia',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'The Coast of Utopia'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				subProductions: [
					{
						uuid: VOYAGE_OLIVIER_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Garply',
				format: 'play',
				year: '2019',
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
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Garply',
				startDate: '2007-11-01',
				endDate: '2007-11-30',
				material: {
					name: 'Garply'
				},
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Garply',
				startDate: '2007-11-01',
				endDate: '2007-11-30',
				material: {
					name: 'Garply'
				},
				venue: {
					name: 'Wyndham\'s Theatre'
				},
				subProductions: [
					{
						uuid: SUB_GARPLY_WYNDHAMS_PRODUCTION_UUID
					}
				]
			});

		theCoastOfUtopiaMaterial = await chai.request(app)
			.get(`/materials/${THE_COAST_OF_UTOPIA_MATERIAL_UUID}`);

		voyageMaterial = await chai.request(app)
			.get(`/materials/${VOYAGE_MATERIAL_UUID}`);

		alexanderHerzenCharacter = await chai.request(app)
			.get(`/characters/${ALEXANDER_HERZEN_CHARACTER_UUID}`);

		ivanTurgunevCharacter = await chai.request(app)
			.get(`/characters/${IVAN_TURGENEV_CHARACTER_UUID}`);

		theCoastOfUtopiaOlivierProduction = await chai.request(app)
			.get(`/productions/${THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID}`);

		voyageOlivierProduction = await chai.request(app)
			.get(`/productions/${VOYAGE_OLIVIER_PRODUCTION_UUID}`);

		tomStoppardPerson = await chai.request(app)
			.get(`/people/${TOM_STOPPARD_PERSON_UUID}`);

		theSträusslerGroupCompany = await chai.request(app)
			.get(`/companies/${THE_STRÄUSSLER_GROUP_COMPANY_UUID}`);

		garplyMaterial = await chai.request(app)
			.get(`/materials/${GARPLY_MATERIAL_UUID}`);

		conorCorgePerson = await chai.request(app)
			.get(`/people/${CONOR_CORGE_PERSON_UUID}`);

		scribesLtdCompany = await chai.request(app)
			.get(`/companies/${SCRIBES_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Coast of Utopia (material with sub-materials)', () => {

		it('includes its sub-materials', () => {

			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: VOYAGE_MATERIAL_UUID,
					name: 'Voyage',
					subtitle: 'In the Thrall of German Idealistic Philosophy',
					format: 'play',
					year: 2002,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
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
									uuid: ALEXANDER_HERZEN_CHARACTER_UUID,
									name: 'Alexander Herzen',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: SHIPWRECK_MATERIAL_UUID,
					name: 'Shipwreck',
					subtitle: 'In the Year of European Revolution',
					format: 'play',
					year: 2002,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
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
									uuid: ALEXANDER_HERZEN_CHARACTER_UUID,
									name: 'Alexander Herzen',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: SALVAGE_MATERIAL_UUID,
					name: 'Salvage',
					subtitle: 'The Emancipation of the Serfs',
					format: 'play',
					year: 2002,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
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
									uuid: ALEXANDER_HERZEN_CHARACTER_UUID,
									name: 'Alexander Herzen',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { subMaterials } = theCoastOfUtopiaMaterial.body;

			expect(subMaterials).to.deep.equal(expectedSubMaterials);

		});

	});

	describe('Voyage (material with sur-material)', () => {

		it('includes The Coast of Utopia as its sur-material', () => {

			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
				name: 'The Coast of Utopia',
				subtitle: 'Romantics and Revolutionaries in an Age of Emperors',
				format: 'trilogy of plays',
				year: 2002,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: TOM_STOPPARD_PERSON_UUID,
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
								name: 'The Sträussler Group'
							}
						]
					}
				],
				originalVersionMaterial: null,
				surMaterial: null,
				characterGroups: [
					{
						model: 'CHARACTER_GROUP',
						name: null,
						position: null,
						characters: [
							{
								model: 'CHARACTER',
								uuid: IVAN_TURGENEV_CHARACTER_UUID,
								name: 'Ivan Turgenev',
								qualifier: null
							}
						]
					}
				]
			};

			const { surMaterial } = voyageMaterial.body;

			expect(surMaterial).to.deep.equal(expectedSurMaterial);

		});

	});

	describe('Alexander Herzen (character)', () => {

		it('includes materials in which character was depicted, including the sur-material', () => {

			const expectedMaterials = [
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					],
					depictions: []
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					],
					depictions: []
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = alexanderHerzenCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Ivan Turgenev (character)', () => {

		it('includes materials in which character was depicted, but with no sur-material as does not apply', () => {

			const expectedMaterials = [
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = ivanTurgunevCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('The Coast of Utopia at Olivier Theatre (production)', () => {

		it('includes the material (but with no sur-material as does not apply)', () => {

			const expectedMaterial = {
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
								uuid: TOM_STOPPARD_PERSON_UUID,
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
								name: 'The Sträussler Group'
							}
						]
					}
				]
			};

			const { material } = theCoastOfUtopiaOlivierProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Voyage at Olivier Theatre (production)', () => {

		it('includes the material and its sur-material', () => {

			const expectedMaterial = {
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
								uuid: TOM_STOPPARD_PERSON_UUID,
								name: 'Tom Stoppard'
							},
							{
								model: 'COMPANY',
								uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
								name: 'The Sträussler Group'
							}
						]
					}
				]
			};

			const { material } = voyageOlivierProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Tom Stoppard (person)', () => {

		it('includes materials with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedMaterials = [
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				}
			];

			const { materials } = tomStoppardPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('The Sträussler Group (company)', () => {

		it('includes materials with corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

			const expectedMaterials = [
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				}
			];

			const { materials } = theSträusslerGroupCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Garply (material): single material is attached to multiple tiers of a production', () => {

		it('includes productions of materials that used it as source material, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_GARPLY_WYNDHAMS_PRODUCTION_UUID,
					name: 'Sub-Garply',
					startDate: '2007-11-01',
					endDate: '2007-11-30',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_GARPLY_WYNDHAMS_PRODUCTION_UUID,
						name: 'Sur-Garply',
						surProduction: null
					}
				}
			];

			const { productions } = garplyMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Conor Corge (person): single instance of their work is attached to multiple tiers of a production', () => {

		it('includes materials, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_GARPLY_WYNDHAMS_PRODUCTION_UUID,
					name: 'Sub-Garply',
					startDate: '2007-11-01',
					endDate: '2007-11-30',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_GARPLY_WYNDHAMS_PRODUCTION_UUID,
						name: 'Sur-Garply',
						surProduction: null
					}
				}
			];

			const { materialProductions } = conorCorgePerson.body;

			expect(materialProductions).to.deep.equal(expectedMaterialProductions);

		});

	});

	describe('Scribes Ltd (company): single instance of their work is attached to multiple tiers of a production', () => {

		it('includes materials, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_GARPLY_WYNDHAMS_PRODUCTION_UUID,
					name: 'Sub-Garply',
					startDate: '2007-11-01',
					endDate: '2007-11-30',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_GARPLY_WYNDHAMS_PRODUCTION_UUID,
						name: 'Sur-Garply',
						surProduction: null
					}
				}
			];

			const { materialProductions } = scribesLtdCompany.body;

			expect(materialProductions).to.deep.equal(expectedMaterialProductions);

		});

	});

	describe('materials list', () => {

		it('includes materials and, where applicable, corresponding sur-material; will exclude sur-materials as these will be included via sub-material association', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: GARPLY_MATERIAL_UUID,
					name: 'Garply',
					format: 'play',
					year: 2019,
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
						}
					]
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
								}
							]
						}
					]
				},
				{
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
									uuid: TOM_STOPPARD_PERSON_UUID,
									name: 'Tom Stoppard'
								},
								{
									model: 'COMPANY',
									uuid: THE_STRÄUSSLER_GROUP_COMPANY_UUID,
									name: 'The Sträussler Group'
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
