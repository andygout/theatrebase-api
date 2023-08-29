import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid';
import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';
import { getStubUuid } from '../test-helpers';

describe('Material with sub-materials', () => {

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

	let theCoastOfUtopiaMaterial;
	let voyageMaterial;
	let alexanderHerzenCharacter;
	let ivanTurgunevCharacter;
	let theCoastOfUtopiaOlivierProduction;
	let voyageOlivierProduction;
	let tomStoppardPerson;
	let theSträusslerGroupCompany;

	const sandbox = createSandbox();

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

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

		it('includes materials and, where applicable, corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

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

		it('includes materials and, where applicable, corresponding sur-material; will exclude sur-materials when included via sub-material association', () => {

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

	describe('materials list', () => {

		it('includes materials and, where applicable, corresponding sur-material; will exclude sur-materials as these will be included via sub-material association', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
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
