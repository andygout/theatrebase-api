import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const LIVERPOOL_EVERYMAN_PLAYHOUSE_VENUE_UUID = 'LIVERPOOL_EVERYMAN_PLAYHOUSE_VENUE_UUID';
const PLAYHOUSE_THEATRE_VENUE_UUID = 'PLAYHOUSE_THEATRE_VENUE_UUID';
const THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID = 'THE_LADYKILLERS_1_MATERIAL_UUID';
const WILLIAM_ROSE_PERSON_UUID = 'WILLIAM_ROSE_PERSON_UUID';
const THE_LADYKILLERS_PLAY_MATERIAL_UUID = 'THE_LADYKILLERS_2_MATERIAL_UUID';
const GRAHAM_LINEHAN_PERSON_UUID = 'GRAHAM_LINEHAN_PERSON_UUID';
const STUDIOCANAL_COMPANY_UUID = 'STUDIOCANAL_COMPANY_UUID';
const ALISON_MEESE_PERSON_UUID = 'ALISON_MEESE_PERSON_UUID';
const THE_LADYKILLERS_PLAYHOUSE_PRODUCTION_UUID = 'THE_LADYKILLERS_PRODUCTION_UUID';
const THE_LADYKILLERS_GIELGUD_PRODUCTION_UUID = 'THE_LADYKILLERS_2_PRODUCTION_UUID';
const GIELGUD_THEATRE_VENUE_UUID = 'GIELGUD_THEATRE_VENUE_UUID';

let studioCanalCompany;
let alisonMeesePerson;

const sandbox = createSandbox();

describe('Material with rights grantor credits', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'Liverpool Everyman & Playhouse',
				subVenues: [
					{
						name: 'Playhouse Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Ladykillers',
				differentiator: '1',
				format: 'motion picture screenplay',
				year: '1955',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Rose'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Ladykillers',
				differentiator: '2',
				format: 'play',
				year: '2011',
				writingCredits: [
					{
						entities: [
							{
								name: 'Graham Linehan'
							}
						]
					},
					{
						name: 'from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Ladykillers',
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
								name: 'StudioCanal'
							},
							{
								name: 'Alison Meese'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Ladykillers',
				startDate: '2011-11-03',
				endDate: '2012-04-19',
				material: {
					name: 'The Ladykillers',
					differentiator: '2'
				},
				venue: {
					name: 'Playhouse Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Ladykillers',
				startDate: '2011-11-26',
				pressDate: '2011-12-07',
				endDate: '2012-04-14',
				material: {
					name: 'The Ladykillers',
					differentiator: '2'
				},
				venue: {
					name: 'Gielgud Theatre'
				}
			});

		studioCanalCompany = await chai.request(app)
			.get(`/companies/${STUDIOCANAL_COMPANY_UUID}`);

		alisonMeesePerson = await chai.request(app)
			.get(`/people/${ALISON_MEESE_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('StudioCanal (company)', () => {

		it('includes materials for which it has a rights grantor credit', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = studioCanalCompany.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

		it('includes productions of materials for which they have granted rights', () => {

			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_LADYKILLERS_GIELGUD_PRODUCTION_UUID,
					name: 'The Ladykillers',
					startDate: '2011-11-26',
					endDate: '2012-04-14',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: THE_LADYKILLERS_PLAYHOUSE_PRODUCTION_UUID,
					name: 'The Ladykillers',
					startDate: '2011-11-03',
					endDate: '2012-04-19',
					venue: {
						model: 'VENUE',
						uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
						name: 'Playhouse Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: LIVERPOOL_EVERYMAN_PLAYHOUSE_VENUE_UUID,
							name: 'Liverpool Everyman & Playhouse'
						}
					},
					surProduction: null
				}
			];

			const { rightsGrantorMaterialProductions } = studioCanalCompany.body;

			expect(rightsGrantorMaterialProductions).to.deep.equal(expectedRightsGrantorMaterialProductions);

		});

	});

	describe('Alison Meese (person)', () => {

		it('includes materials for which they have a rights grantor credit', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = alisonMeesePerson.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

		it('includes productions of materials for which they have granted rights', () => {

			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_LADYKILLERS_GIELGUD_PRODUCTION_UUID,
					name: 'The Ladykillers',
					startDate: '2011-11-26',
					endDate: '2012-04-14',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: THE_LADYKILLERS_PLAYHOUSE_PRODUCTION_UUID,
					name: 'The Ladykillers',
					startDate: '2011-11-03',
					endDate: '2012-04-19',
					venue: {
						model: 'VENUE',
						uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
						name: 'Playhouse Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: LIVERPOOL_EVERYMAN_PLAYHOUSE_VENUE_UUID,
							name: 'Liverpool Everyman & Playhouse'
						}
					},
					surProduction: null
				}
			];

			const { rightsGrantorMaterialProductions } = alisonMeesePerson.body;

			expect(rightsGrantorMaterialProductions).to.deep.equal(expectedRightsGrantorMaterialProductions);

		});

	});

});
