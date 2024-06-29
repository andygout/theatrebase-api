import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID = 'THE_FELLOWSHIP_OF_THE_RING_1_MATERIAL_UUID';
const J_R_R_TOLKIEN_PERSON_UUID = 'J_R_R_TOLKIEN_PERSON_UUID';
const THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID = 'THE_LORD_OF_THE_RINGS_1_MATERIAL_UUID';
const TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID = 'TOLKIENS_LEGENDARIUM_1_MATERIAL_UUID';
const THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID = 'THE_FELLOWSHIP_OF_THE_RING_2_MATERIAL_UUID';
const SHAUN_MCKENNA_PERSON_UUID = 'SHAUN_MCKENNA_PERSON_UUID';
const THE_TOLKIEN_ESTATE_COMPANY_UUID = 'THE_TOLKIEN_ESTATE_COMPANY_UUID';
const BAILLIE_TOLKIEN_PERSON_UUID = 'BAILLIE_TOLKIEN_PERSON_UUID';
const THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID = 'THE_LORD_OF_THE_RINGS_2_MATERIAL_UUID';
const TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID = 'TOLKIENS_LEGENDARIUM_2_MATERIAL_UUID';
const THE_FELLOWSHIP_OF_THE_RING_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID = 'THE_FELLOWSHIP_OF_THE_RING_PRODUCTION_UUID';
const THEATRE_ROYAL_DRURY_LANE_VENUE_UUID = 'THEATRE_ROYAL_DRURY_LANE_VENUE_UUID';
const THE_LORD_OF_THE_RINGS_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID = 'THE_LORD_OF_THE_RINGS_PRODUCTION_UUID';
const TOLKIENS_LEGENDARIUM_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID = 'TOLKIENS_LEGENDARIUM_PRODUCTION_UUID';
const THE_FELLOWSHIP_OF_THE_RING_WATERMILL_PRODUCTION_UUID = 'THE_FELLOWSHIP_OF_THE_RING_2_PRODUCTION_UUID';
const WATERMILL_THEATRE_VENUE_UUID = 'WATERMILL_THEATRE_VENUE_UUID';
const THE_LORD_OF_THE_RINGS_WATERMILL_PRODUCTION_UUID = 'THE_LORD_OF_THE_RINGS_2_PRODUCTION_UUID';
const TOLKIENS_LEGENDARIUM_WATERMILL_PRODUCTION_UUID = 'TOLKIENS_LEGENDARIUM_2_PRODUCTION_UUID';

let theTolkienEstateCompany;
let baillieTolkienPerson;

const sandbox = createSandbox();

describe('Material with sub-sub-materials and rights grantor credits thereof', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Fellowship of the Ring',
				differentiator: '1',
				format: 'novel',
				year: '1954',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Lord of the Rings',
				differentiator: '1',
				format: 'trilogy of novels',
				year: '1955',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Fellowship of the Ring',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Tolkien\'s Legendarium',
				differentiator: '1',
				format: 'body of writing',
				year: '1977',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lord of the Rings',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Fellowship of the Ring',
				differentiator: '2',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Fellowship of the Ring',
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
								name: 'The Tolkien Estate'
							},
							{
								name: 'Baillie Tolkien'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Lord of the Rings',
				differentiator: '2',
				format: 'trilogy of plays',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Lord of the Rings',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Fellowship of the Ring',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Tolkien\'s Legendarium',
				differentiator: '2',
				format: 'collection of plays',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Tolkien\'s Legendarium',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lord of the Rings',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Fellowship of the Ring',
				startDate: '2007-05-09',
				pressDate: '2007-06-19',
				endDate: '2008-07-20',
				material: {
					name: 'The Fellowship of the Ring',
					differentiator: '2'
				},
				venue: {
					name: 'Theatre Royal Drury Lane'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Lord of the Rings',
				startDate: '2007-05-09',
				pressDate: '2007-06-19',
				endDate: '2008-07-20',
				material: {
					name: 'The Lord of the Rings',
					differentiator: '2'
				},
				venue: {
					name: 'Theatre Royal Drury Lane'
				},
				subProductions: [
					{
						uuid: THE_FELLOWSHIP_OF_THE_RING_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Tolkien\'s Legendarium',
				startDate: '2007-05-09',
				pressDate: '2007-06-19',
				endDate: '2008-07-20',
				material: {
					name: 'Tolkien\'s Legendarium',
					differentiator: '2'
				},
				venue: {
					name: 'Theatre Royal Drury Lane'
				},
				subProductions: [
					{
						uuid: THE_LORD_OF_THE_RINGS_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Fellowship of the Ring',
				startDate: '2023-07-25',
				pressDate: '2023-08-01',
				endDate: '2023-10-15',
				material: {
					name: 'The Fellowship of the Ring',
					differentiator: '2'
				},
				venue: {
					name: 'Watermill Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Lord of the Rings',
				startDate: '2023-07-25',
				pressDate: '2023-08-01',
				endDate: '2023-10-15',
				material: {
					name: 'The Lord of the Rings',
					differentiator: '2'
				},
				venue: {
					name: 'Watermill Theatre'
				},
				subProductions: [
					{
						uuid: THE_FELLOWSHIP_OF_THE_RING_WATERMILL_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Tolkien\'s Legendarium',
				startDate: '2023-07-25',
				pressDate: '2023-08-01',
				endDate: '2023-10-15',
				material: {
					name: 'Tolkien\'s Legendarium',
					differentiator: '2'
				},
				venue: {
					name: 'Watermill Theatre'
				},
				subProductions: [
					{
						uuid: THE_LORD_OF_THE_RINGS_WATERMILL_PRODUCTION_UUID
					}
				]
			});

		theTolkienEstateCompany = await chai.request(app)
			.get(`/companies/${THE_TOLKIEN_ESTATE_COMPANY_UUID}`);

		baillieTolkienPerson = await chai.request(app)
			.get(`/people/${BAILLIE_TOLKIEN_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Tolkien Estate (company)', () => {

		it('includes materials for which it has a rights grantor credit, with corresponding sur-material and sur-sur-material', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: 'Tolkien\'s Legendarium'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: 'Tolkien\'s Legendarium'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
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
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = theTolkienEstateCompany.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

		it('includes productions of materials for which they have granted rights, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_FELLOWSHIP_OF_THE_RING_WATERMILL_PRODUCTION_UUID,
					name: 'The Fellowship of the Ring',
					startDate: '2023-07-25',
					endDate: '2023-10-15',
					venue: {
						model: 'VENUE',
						uuid: WATERMILL_THEATRE_VENUE_UUID,
						name: 'Watermill Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LORD_OF_THE_RINGS_WATERMILL_PRODUCTION_UUID,
						name: 'The Lord of the Rings',
						surProduction: {
							model: 'PRODUCTION',
							uuid: TOLKIENS_LEGENDARIUM_WATERMILL_PRODUCTION_UUID,
							name: 'Tolkien\'s Legendarium'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_FELLOWSHIP_OF_THE_RING_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
					name: 'The Fellowship of the Ring',
					startDate: '2007-05-09',
					endDate: '2008-07-20',
					venue: {
						model: 'VENUE',
						uuid: THEATRE_ROYAL_DRURY_LANE_VENUE_UUID,
						name: 'Theatre Royal Drury Lane',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LORD_OF_THE_RINGS_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
						name: 'The Lord of the Rings',
						surProduction: {
							model: 'PRODUCTION',
							uuid: TOLKIENS_LEGENDARIUM_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
							name: 'Tolkien\'s Legendarium'
						}
					}
				}
			];

			const { rightsGrantorMaterialProductions } = theTolkienEstateCompany.body;

			expect(rightsGrantorMaterialProductions).to.deep.equal(expectedRightsGrantorMaterialProductions);

		});

	});

	describe('Baillie Tolkien (person)', () => {

		it('includes materials for which they have a rights grantor credit, with corresponding sur-material and sur-sur-material', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: 'Tolkien\'s Legendarium'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: 'Tolkien\'s Legendarium'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
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
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = baillieTolkienPerson.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

		it('includes productions of materials for which they have granted rights, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {

			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_FELLOWSHIP_OF_THE_RING_WATERMILL_PRODUCTION_UUID,
					name: 'The Fellowship of the Ring',
					startDate: '2023-07-25',
					endDate: '2023-10-15',
					venue: {
						model: 'VENUE',
						uuid: WATERMILL_THEATRE_VENUE_UUID,
						name: 'Watermill Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LORD_OF_THE_RINGS_WATERMILL_PRODUCTION_UUID,
						name: 'The Lord of the Rings',
						surProduction: {
							model: 'PRODUCTION',
							uuid: TOLKIENS_LEGENDARIUM_WATERMILL_PRODUCTION_UUID,
							name: 'Tolkien\'s Legendarium'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_FELLOWSHIP_OF_THE_RING_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
					name: 'The Fellowship of the Ring',
					startDate: '2007-05-09',
					endDate: '2008-07-20',
					venue: {
						model: 'VENUE',
						uuid: THEATRE_ROYAL_DRURY_LANE_VENUE_UUID,
						name: 'Theatre Royal Drury Lane',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LORD_OF_THE_RINGS_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
						name: 'The Lord of the Rings',
						surProduction: {
							model: 'PRODUCTION',
							uuid: TOLKIENS_LEGENDARIUM_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
							name: 'Tolkien\'s Legendarium'
						}
					}
				}
			];

			const { rightsGrantorMaterialProductions } = baillieTolkienPerson.body;

			expect(rightsGrantorMaterialProductions).to.deep.equal(expectedRightsGrantorMaterialProductions);

		});

	});

});
