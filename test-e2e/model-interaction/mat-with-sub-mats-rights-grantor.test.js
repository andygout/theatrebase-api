import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const BIRMINGHAM_REPERTORY_THEATRE_VENUE_UUID = 'BIRMINGHAM_REPERTORY_THEATRE_VENUE_UUID';
const THE_HOUSE_VENUE_UUID = 'THE_HOUSE_VENUE_UUID';
const THE_LION_THE_WITCH_AND_THE_WARDROBE_NOVEL_MATERIAL_UUID = 'THE_LION_THE_WITCH_AND_THE_WARDROBE_1_MATERIAL_UUID';
const C_S_LEWIS_PERSON_UUID = 'C_S_LEWIS_PERSON_UUID';
const THE_CHRONICLES_OF_NARNIA_SERIES_OF_NOVELS_MATERIAL_UUID = 'THE_CHRONICLES_OF_NARNIA_1_MATERIAL_UUID';
const THE_LION_THE_WITCH_AND_THE_WARDROBE_PLAY_MATERIAL_UUID = 'THE_LION_THE_WITCH_AND_THE_WARDROBE_2_MATERIAL_UUID';
const ADAM_PECK_PERSON_UUID = 'ADAM_PECK_PERSON_UUID';
const C_S_LEWIS_SOCIETY_COMPANY_UUID = 'C_S_LEWIS_SOCIETY_COMPANY_UUID';
const SARAH_SELDEN_PERSON_UUID = 'SARAH_SELDEN_PERSON_UUID';
const THE_CHRONICLES_OF_NARNIA_PLAYS_MATERIAL_UUID = 'THE_CHRONICLES_OF_NARNIA_2_MATERIAL_UUID';
const THE_LION_THE_WITCH_AND_THE_WARDROBE_GILLIAN_LYNNE_PRODUCTION_UUID = 'THE_LION_THE_WITCH_AND_THE_WARDROBE_PRODUCTION_UUID';
const GILLIAN_LYNNE_THEATRE_VENUE_UUID = 'GILLIAN_LYNNE_THEATRE_VENUE_UUID';
const THE_CHRONICLES_OF_NARNIA_GILLIAN_LYNNE_PRODUCTION_UUID = 'THE_CHRONICLES_OF_NARNIA_PRODUCTION_UUID';
const THE_LION_THE_WITCH_AND_THE_WARDROBE_THE_HOUSE_PRODUCTION_UUID = 'THE_LION_THE_WITCH_AND_THE_WARDROBE_2_PRODUCTION_UUID';
const THE_CHRONICLES_OF_NARNIA_THE_HOUSE_PRODUCTION_UUID = 'THE_CHRONICLES_OF_NARNIA_2_PRODUCTION_UUID';
const CINERIGHTS_LTD_COMPANY_UUID = 'CINERIGHTS_LTD_COMPANY_UUID';
const TALYSE_TATA_PERSON_UUID = 'TALYSE_TATA_PERSON_UUID';
const SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID = 'SUB_HOGE_PRODUCTION_UUID';
const NOËL_COWARD_THEATRE_VENUE_UUID = 'NOEL_COWARD_THEATRE_VENUE_UUID';
const SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID = 'SUR_HOGE_PRODUCTION_UUID';

let cSLewisSocietyCompany;
let sarahSeldenPerson;
let cinerightsLtdCompany;
let talyseTataPerson;

const sandbox = createSandbox();

describe('Material with sub-materials and rights grantor credits thereof', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'Birmingham Repertory Theatre',
				subVenues: [
					{
						name: 'The House'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Lion, the Witch and the Wardrobe',
				differentiator: '1',
				format: 'novel',
				year: '1950',
				writingCredits: [
					{
						entities: [
							{
								name: 'C S Lewis'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Chronicles of Narnia',
				differentiator: '1',
				format: 'series of novels',
				year: '1956',
				writingCredits: [
					{
						entities: [
							{
								name: 'C S Lewis'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lion, the Witch and the Wardrobe',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Lion, the Witch and the Wardrobe',
				differentiator: '2',
				format: 'play',
				year: '2017',
				writingCredits: [
					{
						entities: [
							{
								name: 'Adam Peck'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Lion, the Witch and the Wardrobe',
								differentiator: '1'
							}
						]
					},
					{
						name: 'by special arrangement with',
						creditType: 'RIGHTS_GRANTOR',
						entities: [
							{
								model: 'COMPANY',
								name: 'C S Lewis Society'
							},
							{
								name: 'Sarah Selden'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Chronicles of Narnia',
				differentiator: '2',
				format: 'plays',
				year: '2017',
				writingCredits: [
					{
						entities: [
							{
								name: 'Adam Peck'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Chronicles of Narnia',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lion, the Witch and the Wardrobe',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Lion, the Witch and the Wardrobe',
				startDate: '2022-07-18',
				pressDate: '2022-07-28',
				endDate: '2023-01-08',
				material: {
					name: 'The Lion, the Witch and the Wardrobe',
					differentiator: '2'
				},
				venue: {
					name: 'Gillian Lynne Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Chronicles of Narnia',
				startDate: '2022-07-18',
				pressDate: '2022-07-28',
				endDate: '2023-01-08',
				material: {
					name: 'The Chronicles of Narnia',
					differentiator: '2'
				},
				venue: {
					name: 'Gillian Lynne Theatre'
				},
				subProductions: [
					{
						uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_GILLIAN_LYNNE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Lion, the Witch and the Wardrobe',
				startDate: '2023-11-14',
				pressDate: '2023-11-17',
				endDate: '2024-01-28',
				material: {
					name: 'The Lion, the Witch and the Wardrobe',
					differentiator: '2'
				},
				venue: {
					name: 'The House'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Chronicles of Narnia',
				startDate: '2023-11-14',
				pressDate: '2023-11-17',
				endDate: '2024-01-28',
				material: {
					name: 'The Chronicles of Narnia',
					differentiator: '2'
				},
				venue: {
					name: 'The House'
				},
				subProductions: [
					{
						uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_THE_HOUSE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hoge',
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
			.post('/productions')
			.send({
				name: 'Sub-Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				material: {
					name: 'Hoge'
				},
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				material: {
					name: 'Hoge'
				},
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		cSLewisSocietyCompany = await chai.request(app)
			.get(`/companies/${C_S_LEWIS_SOCIETY_COMPANY_UUID}`);

		sarahSeldenPerson = await chai.request(app)
			.get(`/people/${SARAH_SELDEN_PERSON_UUID}`);

		cinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${CINERIGHTS_LTD_COMPANY_UUID}`);

		talyseTataPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('C S Lewis Society (company)', () => {

		it('includes materials for which it has a rights grantor credit, with corresponding sur-material', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_PLAY_MATERIAL_UUID,
					name: 'The Lion, the Witch and the Wardrobe',
					format: 'play',
					year: 2017,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_CHRONICLES_OF_NARNIA_PLAYS_MATERIAL_UUID,
						name: 'The Chronicles of Narnia',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ADAM_PECK_PERSON_UUID,
									name: 'Adam Peck'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_NOVEL_MATERIAL_UUID,
									name: 'The Lion, the Witch and the Wardrobe',
									format: 'novel',
									year: 1950,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_CHRONICLES_OF_NARNIA_SERIES_OF_NOVELS_MATERIAL_UUID,
										name: 'The Chronicles of Narnia',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: C_S_LEWIS_PERSON_UUID,
													name: 'C S Lewis'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: C_S_LEWIS_SOCIETY_COMPANY_UUID,
									name: 'C S Lewis Society'
								},
								{
									model: 'PERSON',
									uuid: SARAH_SELDEN_PERSON_UUID,
									name: 'Sarah Selden'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = cSLewisSocietyCompany.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

		it('includes productions of materials for which they have granted rights, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_THE_HOUSE_PRODUCTION_UUID,
					name: 'The Lion, the Witch and the Wardrobe',
					startDate: '2023-11-14',
					endDate: '2024-01-28',
					venue: {
						model: 'VENUE',
						uuid: THE_HOUSE_VENUE_UUID,
						name: 'The House',
						surVenue: {
							model: 'VENUE',
							uuid: BIRMINGHAM_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Birmingham Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_CHRONICLES_OF_NARNIA_THE_HOUSE_PRODUCTION_UUID,
						name: 'The Chronicles of Narnia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_GILLIAN_LYNNE_PRODUCTION_UUID,
					name: 'The Lion, the Witch and the Wardrobe',
					startDate: '2022-07-18',
					endDate: '2023-01-08',
					venue: {
						model: 'VENUE',
						uuid: GILLIAN_LYNNE_THEATRE_VENUE_UUID,
						name: 'Gillian Lynne Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_CHRONICLES_OF_NARNIA_GILLIAN_LYNNE_PRODUCTION_UUID,
						name: 'The Chronicles of Narnia',
						surProduction: null
					}
				}
			];

			const { rightsGrantorMaterialProductions } = cSLewisSocietyCompany.body;

			expect(rightsGrantorMaterialProductions).to.deep.equal(expectedRightsGrantorMaterialProductions);

		});

	});

	describe('Sarah Selden (person)', () => {

		it('includes materials for which they have a rights grantor credit, with corresponding sur-material', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_PLAY_MATERIAL_UUID,
					name: 'The Lion, the Witch and the Wardrobe',
					format: 'play',
					year: 2017,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_CHRONICLES_OF_NARNIA_PLAYS_MATERIAL_UUID,
						name: 'The Chronicles of Narnia',
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ADAM_PECK_PERSON_UUID,
									name: 'Adam Peck'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_NOVEL_MATERIAL_UUID,
									name: 'The Lion, the Witch and the Wardrobe',
									format: 'novel',
									year: 1950,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_CHRONICLES_OF_NARNIA_SERIES_OF_NOVELS_MATERIAL_UUID,
										name: 'The Chronicles of Narnia',
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: C_S_LEWIS_PERSON_UUID,
													name: 'C S Lewis'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: C_S_LEWIS_SOCIETY_COMPANY_UUID,
									name: 'C S Lewis Society'
								},
								{
									model: 'PERSON',
									uuid: SARAH_SELDEN_PERSON_UUID,
									name: 'Sarah Selden'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = sarahSeldenPerson.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

		it('includes productions of materials for which they have granted rights, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_THE_HOUSE_PRODUCTION_UUID,
					name: 'The Lion, the Witch and the Wardrobe',
					startDate: '2023-11-14',
					endDate: '2024-01-28',
					venue: {
						model: 'VENUE',
						uuid: THE_HOUSE_VENUE_UUID,
						name: 'The House',
						surVenue: {
							model: 'VENUE',
							uuid: BIRMINGHAM_REPERTORY_THEATRE_VENUE_UUID,
							name: 'Birmingham Repertory Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_CHRONICLES_OF_NARNIA_THE_HOUSE_PRODUCTION_UUID,
						name: 'The Chronicles of Narnia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_GILLIAN_LYNNE_PRODUCTION_UUID,
					name: 'The Lion, the Witch and the Wardrobe',
					startDate: '2022-07-18',
					endDate: '2023-01-08',
					venue: {
						model: 'VENUE',
						uuid: GILLIAN_LYNNE_THEATRE_VENUE_UUID,
						name: 'Gillian Lynne Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_CHRONICLES_OF_NARNIA_GILLIAN_LYNNE_PRODUCTION_UUID,
						name: 'The Chronicles of Narnia',
						surProduction: null
					}
				}
			];

			const { rightsGrantorMaterialProductions } = sarahSeldenPerson.body;

			expect(rightsGrantorMaterialProductions).to.deep.equal(expectedRightsGrantorMaterialProductions);

		});

	});

	describe('Cinerights Ltd (company): single material for which they have granted rights is attached to multiple tiers of a production', () => {

		it('includes productions of materials for which they have granted rights, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedRightsGrantorMaterialProductions = [
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
						uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
						name: 'Sur-Hoge',
						surProduction: null
					}
				}
			];

			const { rightsGrantorMaterialProductions } = cinerightsLtdCompany.body;

			expect(rightsGrantorMaterialProductions).to.deep.equal(expectedRightsGrantorMaterialProductions);

		});

	});

	describe('Talyse Tata (person): single material for which they have granted rights is attached to multiple tiers of a production', () => {

		it('includes productions of materials for which they have granted rights, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedRightsGrantorMaterialProductions = [
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
						uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
						name: 'Sur-Hoge',
						surProduction: null
					}
				}
			];

			const { rightsGrantorMaterialProductions } = talyseTataPerson.body;

			expect(rightsGrantorMaterialProductions).to.deep.equal(expectedRightsGrantorMaterialProductions);

		});

	});

});
