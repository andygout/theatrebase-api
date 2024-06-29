import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const sandbox = createSandbox();

describe('CRUD (Create, Read, Update, Delete): Award ceremonies API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new award ceremony', async () => {

			const response = await chai.request(app)
				.get('/award-ceremonies/new');

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').returns(AWARD_CEREMONY_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

			const response = await chai.request(app)
				.post('/award-ceremonies')
				.send({
					name: '2020'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('gets data required to edit specific award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/award-ceremonies/${AWARD_CEREMONY_UUID}/edit`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2019'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/award-ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				award: null,
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/award-ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID = 'HAIRSPRAY_PRODUCTION_UUID';
		const SHAFTESBURY_THEATRE_VENUE_UUID = 'SHAFTESBURY_THEATRE_VENUE_UUID';
		const GARPLY_LYTTELTON_PRODUCTION_UUID = 'GARPLY_PRODUCTION_UUID';
		const LYTTELTON_THEATRE_VENUE_UUID = 'LYTTELTON_THEATRE_VENUE_UUID';
		const GARPLY_WYNDHAMS_PRODUCTION_UUID = 'GARPLY_2_PRODUCTION_UUID';
		const WYNDHAMS_THEATRE_VENUE_UUID = 'WYNDHAMS_THEATRE_VENUE_UUID';
		const SAINT_JOAN_OLIVIER_PRODUCTION_UUID = 'SAINT_JOAN_PRODUCTION_UUID';
		const OLIVIER_THEATRE_VENUE_UUID = 'OLIVIER_THEATRE_VENUE_UUID';
		const PARADE_DONMAR_PRODUCTION_UUID = 'PARADE_PRODUCTION_UUID';
		const DONMAR_WAREHOUSE_VENUE_UUID = 'DONMAR_WAREHOUSE_VENUE_UUID';
		const GRAULT_ALMEIDA_PRODUCTION_UUID = 'GRAULT_PRODUCTION_UUID';
		const ALMEIDA_THEATRE_VENUE_UUID = 'ALMEIDA_THEATRE_VENUE_UUID';
		const AWARD_CEREMONY_UUID = '2008_2_AWARD_CEREMONY_UUID';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'LAURENCE_OLIVIER_AWARDS_1_AWARD_UUID';
		const STEVE_C_KENNEDY_PERSON_UUID = 'STEVE_C_KENNEDY_1_PERSON_UUID';
		const HAIRSPRAY_MATERIAL_UUID = 'HAIRSPRAY_1_MATERIAL_UUID';
		const SOUNDWAVES_LTD_COMPANY_UUID = 'SOUNDWAVES_LTD_1_COMPANY_UUID';
		const GARPLY_MATERIAL_UUID = 'GARPLY_1_MATERIAL_UUID';
		const PAUL_ARDITTI_PERSON_UUID = 'PAUL_ARDITTI_1_PERSON_UUID';
		const JOCELYN_POOK_PERSON_UUID = 'JOCELYN_POOK_1_PERSON_UUID';
		const SAINT_JOAN_MATERIAL_UUID = 'SAINT_JOAN_1_MATERIAL_UUID';
		const AUTOGRAPH_COMPANY_UUID = 'AUTOGRAPH_1_COMPANY_UUID';
		const TERRY_JARDINE_PERSON_UUID = 'TERRY_JARDINE_1_PERSON_UUID';
		const NICK_LIDSTER_PERSON_UUID ='NICK_LIDSTER_1_PERSON_UUID';
		const PARADE_MATERIAL_UUID = 'PARADE_1_MATERIAL_UUID';
		const AUDIO_CREATIVE_LTD_COMPANY_UUID = 'AUDIO_CREATIVE_LTD_1_COMPANY_UUID';
		const SIMON_BAKER_PERSON_UUID ='SIMON_BAKER_1_PERSON_UUID';
		const ROB_ASHFORD_PERSON_UUID = 'ROB_ASHFORD_1_PERSON_UUID';
		const MARIANNE_ELLIOTT_PERSON_UUID = 'MARIANNE_ELLIOTT_1_PERSON_UUID';
		const TOM_MORRIS_PERSON_UUID = 'TOM_MORRIS_1_PERSON_UUID';
		const RUPERT_GOOLD_PERSON_UUID = 'RUPERT_GOOLD_1_PERSON_UUID';
		const A_DISAPPEARING_NUMBER_MATERIAL_UUID = 'A_DISAPPEARING_NUMBER_1_MATERIAL_UUID';
		const THE_REPORTER_MATERIAL_UUID = 'THE_REPORTER_1_MATERIAL_UUID';
		const VERNON_GOD_LITTLE_MATERIAL_UUID = 'VERNON_GOD_LITTLE_1_MATERIAL_UUID';
		const THE_CHALK_GARDEN_DONMAR_PRODUCTION_UUID = 'THE_CHALK_GARDEN_PRODUCTION_UUID';
		const PIAF_DONMAR_PRODUCTION_UUID = 'PIAF_PRODUCTION_UUID';
		const PIAF_VAUDEVILLE_PRODUCTION_UUID = 'PIAF_2_PRODUCTION_UUID';
		const VAUDEVILLE_THEATRE_VENUE_UUID = 'VAUDEVILLE_THEATRE_VENUE_UUID';
		const IVANOV_WYNDHAMS_PRODUCTION_UUID = 'IVANOV_PRODUCTION_UUID';
		const WALDO_DORFMAN_PRODUCTION_UUID = 'WALDO_PRODUCTION_UUID';
		const DORFMAN_THEATRE_VENUE_UUID = 'DORFMAN_THEATRE_VENUE_UUID';
		const WALDO_NOËL_COWARD_PRODUCTION_UUID = 'WALDO_2_PRODUCTION_UUID';
		const NOËL_COWARD_THEATRE_VENUE_UUID = 'NOEL_COWARD_THEATRE_VENUE_UUID';
		const FRED_OLD_VIC_PRODUCTION_UUID = 'FRED_PRODUCTION_UUID';
		const OLD_VIC_THEATRE_VENUE_UUID = 'OLD_VIC_THEATRE_VENUE_UUID';
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'EVENING_STANDARD_THEATRE_AWARDS_2_AWARD_UUID';
		const PAULE_CONSTABLE_PERSON_UUID = 'PAULE_CONSTABLE_1_PERSON_UUID';
		const THE_CHALK_GARDEN_MATERIAL_UUID = 'THE_CHALK_GARDEN_1_MATERIAL_UUID';
		const ILLUMINATIONS_LTD_COMPANY_UUID = 'ILLUMINATIONS_LTD_1_COMPANY_UUID';
		const PIAF_MATERIAL_UUID = 'PIAF_1_MATERIAL_UUID';
		const NEIL_AUSTIN_PERSON_UUID = 'NEIL_AUSTIN_1_PERSON_UUID';
		const MARK_HENDERSON_PERSON_UUID = 'MARK_HENDERSON_1_PERSON_UUID';
		const IVANOV_MATERIAL_UUID = 'IVANOV_1_MATERIAL_UUID';
		const LIMELIGHT_LTD_COMPANY_UUID = 'LIMELIGHT_LTD_1_COMPANY_UUID';
		const KEVIN_ADAMS_PERSON_UUID = 'KEVIN_ADAMS_1_PERSON_UUID';
		const JON_CLARK_PERSON_UUID = 'JON_CLARK_1_PERSON_UUID';
		const WALDO_MATERIAL_UUID = 'WALDO_1_MATERIAL_UUID';
		const STAGE_SUN_LTD_COMPANY_UUID = 'STAGE_SUN_LTD_1_COMPANY_UUID';
		const HOWARD_HARRISON_PERSON_UUID = 'HOWARD_HARRISON_1_PERSON_UUID';
		const RAFAEL_AMARGO_PERSON_UUID = 'RAFAEL_AMARGO_1_PERSON_UUID';
		const STEVEN_HOGGETT_PERSON_UUID = 'STEVEN_HOGGETT_1_PERSON_UUID';
		const LYNNE_PAGE_PERSON_UUID = 'LYNNE_PAGE_1_PERSON_UUID';
		const KATE_PRINCE_PERSON_UUID = 'KATE_PRINCE_1_PERSON_UUID';
		const ENGLAND_PEOPLE_VERY_NICE_MATERIAL_UUID = 'ENGLAND_PEOPLE_VERY_NICE_1_MATERIAL_UUID';
		const JERUSALEM_MATERIAL_UUID = 'JERUSALEM_1_MATERIAL_UUID';
		const OUR_CLASS_MATERIAL_UUID = 'OUR_CLASS_1_MATERIAL_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hairspray',
					startDate: '2007-10-11',
					endDate: '2010-03-28',
					venue: {
						name: 'Shaftesbury Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Garply',
					startDate: '2007-10-01',
					endDate: '2007-10-31',
					venue: {
						name: 'Lyttelton Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Garply',
					startDate: '2007-11-01',
					endDate: '2007-11-30',
					venue: {
						name: 'Wyndham\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Saint Joan',
					startDate: '2007-07-04',
					endDate: '2007-09-25',
					venue: {
						name: 'Olivier Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Parade',
					startDate: '2007-09-14',
					endDate: '2007-11-24',
					venue: {
						name: 'Donmar Warehouse'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Grault',
					startDate: '2007-12-01',
					endDate: '2007-12-31',
					venue: {
						name: 'Almeida Theatre'
					}
				});

			const response = await chai.request(app)
				.post('/award-ceremonies')
				.send({
					name: '2008',
					award: {
						name: 'Laurence Olivier Awards',
						differentiator: '1'
					},
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Steve C Kennedy',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Hairspray',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Soundwaves Ltd',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
										},
										{
											uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Garply',
											differentiator: '1'
										}
									]
								},
								{
									isWinner: true,
									entities: [
										{
											name: 'Paul Arditti',
											differentiator: '1'
										},
										{
											name: 'Jocelyn Pook',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Saint Joan',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											differentiator: '1',
											members: [
												{
													name: 'Terry Jardine',
													differentiator: '1'
												},
												{
													name: 'Nick Lidster',
													differentiator: '1'
												}
											]
										}
									],
									productions: [
										{
											uuid: PARADE_DONMAR_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Parade',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Audio Creative Ltd',
											differentiator: '1',
											members: [
												{
													name: 'Terry Jardine',
													differentiator: '1'
												}
											]
										},
										{
											name: 'Simon Baker',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
										},
										{
											uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Garply',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best Director',
							nominations: [
								{
									entities: [
										{
											name: 'Rob Ashford',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											name: 'Marianne Elliott',
											differentiator: '1'
										},
										{
											name: 'Tom Morris',
											differentiator: '1'
										}
									]
								},
								{
									isWinner: true,
									entities: [
										{
											name: 'Rupert Goold',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best Revival',
							nominations: [
								{
									productions: [
										{
											uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
										},
										{
											uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
										}
									]
								},
								{
									isWinner: true,
									productions: [
										{
											uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
										}
									]
								},
								{
									productions: [
										{
											uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID
										}
									]
								}
							]
						},
						{
							name: 'Best New Play',
							nominations: [
								{
									isWinner: true,
									materials: [
										{
											name: 'A Disappearing Number',
											differentiator: '1'
										}
									]
								},
								{
									customType: 'Special Commendation',
									materials: [
										{
											name: 'The Reporter',
											differentiator: '1'
										}
									]
								},
								{
									customType: 'Finalist',
									materials: [
										{
											name: 'Vernon God Little',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best New Dance Production'
						}
					]
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2008',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Laurence Olivier Awards',
					differentiator: '1',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Sound Design',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Steve C Kennedy',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Hairspray',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Soundwaves Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Garply',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Paul Arditti',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Jocelyn Pook',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Saint Joan',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Autograph',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Terry Jardine',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: 'Nick Lidster',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PARADE_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Parade',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Audio Creative Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Terry Jardine',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: 'Simon Baker',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Garply',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Director',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rob Ashford',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Marianne Elliott',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Tom Morris',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Play',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'A Disappearing Number',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: 'Special Commendation',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'The Reporter',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: 'Finalist',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Vernon God Little',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Dance Production',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/award-ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2008',
				award: {
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Sound Design',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'PERSON',
										uuid: STEVE_C_KENNEDY_PERSON_UUID,
										name: 'Steve C Kennedy'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID,
										name: 'Hairspray',
										startDate: '2007-10-11',
										endDate: '2010-03-28',
										venue: {
											model: 'VENUE',
											uuid: SHAFTESBURY_THEATRE_VENUE_UUID,
											name: 'Shaftesbury Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										uuid: HAIRSPRAY_MATERIAL_UUID,
										name: 'Hairspray',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'COMPANY',
										uuid: SOUNDWAVES_LTD_COMPANY_UUID,
										name: 'Soundwaves Ltd',
										members: []
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-10-01',
										endDate: '2007-10-31',
										venue: {
											model: 'VENUE',
											uuid: LYTTELTON_THEATRE_VENUE_UUID,
											name: 'Lyttelton Theatre',
											surVenue: null
										},
										surProduction: null
									},
									{
										model: 'PRODUCTION',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-11-01',
										endDate: '2007-11-30',
										venue: {
											model: 'VENUE',
											uuid: WYNDHAMS_THEATRE_VENUE_UUID,
											name: 'Wyndham\'s Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										uuid: GARPLY_MATERIAL_UUID,
										name: 'Garply',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								type: 'Winner',
								entities: [
									{
										model: 'PERSON',
										uuid: PAUL_ARDITTI_PERSON_UUID,
										name: 'Paul Arditti'
									},
									{
										model: 'PERSON',
										uuid: JOCELYN_POOK_PERSON_UUID,
										name: 'Jocelyn Pook'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										name: 'Saint Joan',
										startDate: '2007-07-04',
										endDate: '2007-09-25',
										venue: {
											model: 'VENUE',
											uuid: OLIVIER_THEATRE_VENUE_UUID,
											name: 'Olivier Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										uuid: SAINT_JOAN_MATERIAL_UUID,
										name: 'Saint Joan',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'COMPANY',
										uuid: AUTOGRAPH_COMPANY_UUID,
										name: 'Autograph',
										members: [
											{
												model: 'PERSON',
												uuid: TERRY_JARDINE_PERSON_UUID,
												name: 'Terry Jardine'
											},
											{
												model: 'PERSON',
												uuid: NICK_LIDSTER_PERSON_UUID,
												name: 'Nick Lidster'
											}
										]
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: PARADE_DONMAR_PRODUCTION_UUID,
										name: 'Parade',
										startDate: '2007-09-14',
										endDate: '2007-11-24',
										venue: {
											model: 'VENUE',
											uuid: DONMAR_WAREHOUSE_VENUE_UUID,
											name: 'Donmar Warehouse',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										uuid: PARADE_MATERIAL_UUID,
										name: 'Parade',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'COMPANY',
										uuid: AUDIO_CREATIVE_LTD_COMPANY_UUID,
										name: 'Audio Creative Ltd',
										members: [
											{
												model: 'PERSON',
												uuid: TERRY_JARDINE_PERSON_UUID,
												name: 'Terry Jardine'
											}
										]
									},
									{
										model: 'PERSON',
										uuid: SIMON_BAKER_PERSON_UUID,
										name: 'Simon Baker'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-10-01',
										endDate: '2007-10-31',
										venue: {
											model: 'VENUE',
											uuid: LYTTELTON_THEATRE_VENUE_UUID,
											name: 'Lyttelton Theatre',
											surVenue: null
										},
										surProduction: null
									},
									{
										model: 'PRODUCTION',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-11-01',
										endDate: '2007-11-30',
										venue: {
											model: 'VENUE',
											uuid: WYNDHAMS_THEATRE_VENUE_UUID,
											name: 'Wyndham\'s Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										uuid: GARPLY_MATERIAL_UUID,
										name: 'Garply',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Director',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'PERSON',
										uuid: ROB_ASHFORD_PERSON_UUID,
										name: 'Rob Ashford'
									}
								],
								productions: [],
								materials: []
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'PERSON',
										uuid: MARIANNE_ELLIOTT_PERSON_UUID,
										name: 'Marianne Elliott'
									},
									{
										model: 'PERSON',
										uuid: TOM_MORRIS_PERSON_UUID,
										name: 'Tom Morris'
									}
								],
								productions: [],
								materials: []
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								type: 'Winner',
								entities: [
									{
										model: 'PERSON',
										uuid: RUPERT_GOOLD_PERSON_UUID,
										name: 'Rupert Goold'
									}
								],
								productions: [],
								materials: []
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-10-01',
										endDate: '2007-10-31',
										venue: {
											model: 'VENUE',
											uuid: LYTTELTON_THEATRE_VENUE_UUID,
											name: 'Lyttelton Theatre',
											surVenue: null
										},
										surProduction: null
									},
									{
										model: 'PRODUCTION',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-11-01',
										endDate: '2007-11-30',
										venue: {
											model: 'VENUE',
											uuid: WYNDHAMS_THEATRE_VENUE_UUID,
											name: 'Wyndham\'s Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: []
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								type: 'Winner',
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
										name: 'Grault',
										startDate: '2007-12-01',
										endDate: '2007-12-31',
										venue: {
											model: 'VENUE',
											uuid: ALMEIDA_THEATRE_VENUE_UUID,
											name: 'Almeida Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: []
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										name: 'Saint Joan',
										startDate: '2007-07-04',
										endDate: '2007-09-25',
										venue: {
											model: 'VENUE',
											uuid: OLIVIER_THEATRE_VENUE_UUID,
											name: 'Olivier Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: []
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Play',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: true,
								type: 'Winner',
								entities: [],
								productions: [],
								materials: [
									{
										model: 'MATERIAL',
										uuid: A_DISAPPEARING_NUMBER_MATERIAL_UUID,
										name: 'A Disappearing Number',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Special Commendation',
								entities: [],
								productions: [],
								materials: [
									{
										model: 'MATERIAL',
										uuid: THE_REPORTER_MATERIAL_UUID,
										name: 'The Reporter',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Finalist',
								entities: [],
								productions: [],
								materials: [
									{
										model: 'MATERIAL',
										uuid: VERNON_GOD_LITTLE_MATERIAL_UUID,
										name: 'Vernon God Little',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Dance Production',
						nominations: []
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/award-ceremonies/${AWARD_CEREMONY_UUID}/edit`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2008',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Laurence Olivier Awards',
					differentiator: '1',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Sound Design',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Steve C Kennedy',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Hairspray',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Soundwaves Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Garply',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Paul Arditti',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Jocelyn Pook',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Saint Joan',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Autograph',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Terry Jardine',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: 'Nick Lidster',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PARADE_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Parade',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Audio Creative Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Terry Jardine',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: 'Simon Baker',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Garply',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Director',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rob Ashford',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Marianne Elliott',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Tom Morris',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Play',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'A Disappearing Number',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: 'Special Commendation',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'The Reporter',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: 'Finalist',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Vernon God Little',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Dance Production',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates award ceremony (with existing data)', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2008',
					award: {
						name: 'Laurence Olivier Awards',
						differentiator: '1'
					},
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Steve C Kennedy',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Hairspray',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Soundwaves Ltd',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
										},
										{
											uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Garply',
											differentiator: '1'
										}
									]
								},
								{
									isWinner: true,
									entities: [
										{
											name: 'Paul Arditti',
											differentiator: '1'
										},
										{
											name: 'Jocelyn Pook',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Saint Joan',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											differentiator: '1',
											members: [
												{
													name: 'Terry Jardine',
													differentiator: '1'
												},
												{
													name: 'Nick Lidster',
													differentiator: '1'
												}
											]
										}
									],
									productions: [
										{
											uuid: PARADE_DONMAR_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Parade',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Audio Creative Ltd',
											differentiator: '1',
											members: [
												{
													name: 'Terry Jardine',
													differentiator: '1'
												}
											]
										},
										{
											name: 'Simon Baker',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
										},
										{
											uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Garply',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best Director',
							nominations: [
								{
									entities: [
										{
											name: 'Rob Ashford',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											name: 'Marianne Elliott',
											differentiator: '1'
										},
										{
											name: 'Tom Morris',
											differentiator: '1'
										}
									]
								},
								{
									isWinner: true,
									entities: [
										{
											name: 'Rupert Goold',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best Revival',
							nominations: [
								{
									productions: [
										{
											uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
										},
										{
											uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
										}
									]
								},
								{
									isWinner: true,
									productions: [
										{
											uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
										}
									]
								},
								{
									productions: [
										{
											uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID
										}
									]
								}
							]
						},
						{
							name: 'Best New Play',
							nominations: [
								{
									isWinner: true,
									materials: [
										{
											name: 'A Disappearing Number',
											differentiator: '1'
										}
									]
								},
								{
									customType: 'Special Commendation',
									materials: [
										{
											name: 'The Reporter',
											differentiator: '1'
										}
									]
								},
								{
									customType: 'Finalist',
									materials: [
										{
											name: 'Vernon God Little',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best New Dance Production'
						}
					]
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2008',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Laurence Olivier Awards',
					differentiator: '1',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Sound Design',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Steve C Kennedy',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Hairspray',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Soundwaves Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Garply',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Paul Arditti',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Jocelyn Pook',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Saint Joan',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Autograph',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Terry Jardine',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: 'Nick Lidster',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PARADE_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Parade',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Audio Creative Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Terry Jardine',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: 'Simon Baker',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Garply',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Director',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rob Ashford',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Marianne Elliott',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Tom Morris',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Play',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'A Disappearing Number',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: 'Special Commendation',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'The Reporter',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: 'Finalist',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Vernon God Little',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Dance Production',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('updates award ceremony (with new data)', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'The Chalk Garden',
					startDate: '2008-06-05',
					endDate: '2008-08-02',
					venue: {
						name: 'Donmar Warehouse'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Piaf',
					startDate: '2008-08-08',
					endDate: '2008-09-20',
					venue: {
						name: 'Donmar Warehouse'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Piaf',
					startDate: '2008-10-16',
					endDate: '2009-01-24',
					venue: {
						name: 'Vaudeville Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Ivanov',
					startDate: '2008-09-12',
					endDate: '2008-11-29',
					venue: {
						name: 'Wyndham\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Waldo',
					startDate: '2008-07-01',
					endDate: '2008-07-31',
					venue: {
						name: 'Dorfman Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Waldo',
					startDate: '2008-08-01',
					endDate: '2008-08-31',
					venue: {
						name: 'Noël Coward Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Fred',
					startDate: '2008-09-01',
					endDate: '2008-09-30',
					venue: {
						name: 'Old Vic Theatre'
					}
				});

			const response = await chai.request(app)
				.put(`/award-ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2009',
					award: {
						name: 'Evening Standard Theatre Awards',
						differentiator: '2'
					},
					categories: [
						{
							name: 'Best Lighting Design',
							nominations: [
								{
									isWinner: true,
									entities: [
										{
											name: 'Paule Constable',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: THE_CHALK_GARDEN_DONMAR_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'The Chalk Garden',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Illuminations Ltd',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: PIAF_DONMAR_PRODUCTION_UUID
										},
										{
											uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Piaf',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											name: 'Neil Austin',
											differentiator: '1'
										},
										{
											name: 'Mark Henderson',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: IVANOV_WYNDHAMS_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Ivanov',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Limelight Ltd',
											differentiator: '1',
											members: [
												{
													name: 'Kevin Adams',
													differentiator: '1'
												},
												{
													name: 'Jon Clark',
													differentiator: '1'
												}
											]
										}
									],
									productions: [
										{
											uuid: WALDO_DORFMAN_PRODUCTION_UUID
										},
										{
											uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Waldo',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Stage Sun Ltd',
											differentiator: '1',
											members: [
												{
													name: 'Kevin Adams',
													differentiator: '1'
												}
											]
										},
										{
											name: 'Howard Harrison',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: WALDO_DORFMAN_PRODUCTION_UUID
										},
										{
											uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID
										}
									],
									materials: [
										{
											name: 'Waldo',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best Theatre Choreographer',
							nominations: [
								{
									entities: [
										{
											name: 'Rafael Amargo',
											differentiator: '1'
										}
									]
								},
								{
									isWinner: true,
									entities: [
										{
											name: 'Steven Hoggett',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											name: 'Lynne Page',
											differentiator: '1'
										},
										{
											name: 'Kate Prince',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best Musical Revival',
							nominations: [
								{
									productions: [
										{
											uuid: FRED_OLD_VIC_PRODUCTION_UUID
										}
									]
								},
								{
									productions: [
										{
											uuid: PIAF_DONMAR_PRODUCTION_UUID
										},
										{
											uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID
										}
									]
								},
								{
									isWinner: true,
									productions: [
										{
											uuid: WALDO_DORFMAN_PRODUCTION_UUID
										},
										{
											uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID
										}
									]
								}
							]
						},
						{
							name: 'Best Play',
							nominations: [
								{
									customType: 'Shortlisted',
									materials: [
										{
											name: 'England People Very Nice',
											differentiator: '1'
										}
									]
								},
								{
									isWinner: true,
									materials: [
										{
											name: 'Jerusalem',
											differentiator: '1'
										}
									]
								},
								{
									customType: 'Longlisted',
									materials: [
										{
											name: 'Our Class',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best New Opera Production'
						}
					]
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2009',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Evening Standard Theatre Awards',
					differentiator: '2',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Lighting Design',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Paule Constable',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: THE_CHALK_GARDEN_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'The Chalk Garden',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Illuminations Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PIAF_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Piaf',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Neil Austin',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Mark Henderson',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: IVANOV_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Ivanov',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Limelight Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Kevin Adams',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: 'Jon Clark',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Waldo',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Stage Sun Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Kevin Adams',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: '',
												differentiator: '',
												errors: {}
											}
										]
									},
									{
										model: 'PERSON',
										name: 'Howard Harrison',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Waldo',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Theatre Choreographer',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rafael Amargo',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Steven Hoggett',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Lynne Page',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Kate Prince',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Musical Revival',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: FRED_OLD_VIC_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PIAF_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Play',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: 'Shortlisted',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'England People Very Nice',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Jerusalem',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: 'Longlisted',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: 'Our Class',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Opera Production',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/award-ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2009',
				award: {
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Lighting Design',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: true,
								type: 'Winner',
								entities: [
									{
										model: 'PERSON',
										uuid: PAULE_CONSTABLE_PERSON_UUID,
										name: 'Paule Constable'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: THE_CHALK_GARDEN_DONMAR_PRODUCTION_UUID,
										name: 'The Chalk Garden',
										startDate: '2008-06-05',
										endDate: '2008-08-02',
										venue: {
											model: 'VENUE',
											uuid: DONMAR_WAREHOUSE_VENUE_UUID,
											name: 'Donmar Warehouse',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										uuid: THE_CHALK_GARDEN_MATERIAL_UUID,
										name: 'The Chalk Garden',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'COMPANY',
										uuid: ILLUMINATIONS_LTD_COMPANY_UUID,
										name: 'Illuminations Ltd',
										members: []
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: PIAF_DONMAR_PRODUCTION_UUID,
										name: 'Piaf',
										startDate: '2008-08-08',
										endDate: '2008-09-20',
										venue: {
											model: 'VENUE',
											uuid: DONMAR_WAREHOUSE_VENUE_UUID,
											name: 'Donmar Warehouse',
											surVenue: null
										},
										surProduction: null
									},
									{
										model: 'PRODUCTION',
										uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID,
										name: 'Piaf',
										startDate: '2008-10-16',
										endDate: '2009-01-24',
										venue: {
											model: 'VENUE',
											uuid: VAUDEVILLE_THEATRE_VENUE_UUID,
											name: 'Vaudeville Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										uuid: PIAF_MATERIAL_UUID,
										name: 'Piaf',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'PERSON',
										uuid: NEIL_AUSTIN_PERSON_UUID,
										name: 'Neil Austin'
									},
									{
										model: 'PERSON',
										uuid: MARK_HENDERSON_PERSON_UUID,
										name: 'Mark Henderson'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: IVANOV_WYNDHAMS_PRODUCTION_UUID,
										name: 'Ivanov',
										startDate: '2008-09-12',
										endDate: '2008-11-29',
										venue: {
											model: 'VENUE',
											uuid: WYNDHAMS_THEATRE_VENUE_UUID,
											name: 'Wyndham\'s Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										uuid: IVANOV_MATERIAL_UUID,
										name: 'Ivanov',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'COMPANY',
										uuid: LIMELIGHT_LTD_COMPANY_UUID,
										name: 'Limelight Ltd',
										members: [
											{
												model: 'PERSON',
												uuid: KEVIN_ADAMS_PERSON_UUID,
												name: 'Kevin Adams'
											},
											{
												model: 'PERSON',
												uuid: JON_CLARK_PERSON_UUID,
												name: 'Jon Clark'
											}
										]
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-07-01',
										endDate: '2008-07-31',
										venue: {
											model: 'VENUE',
											uuid: DORFMAN_THEATRE_VENUE_UUID,
											name: 'Dorfman Theatre',
											surVenue: null
										},
										surProduction: null
									},
									{
										model: 'PRODUCTION',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-08-01',
										endDate: '2008-08-31',
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
										uuid: WALDO_MATERIAL_UUID,
										name: 'Waldo',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'COMPANY',
										uuid: STAGE_SUN_LTD_COMPANY_UUID,
										name: 'Stage Sun Ltd',
										members: [
											{
												model: 'PERSON',
												uuid: KEVIN_ADAMS_PERSON_UUID,
												name: 'Kevin Adams'
											}
										]
									},
									{
										model: 'PERSON',
										uuid: HOWARD_HARRISON_PERSON_UUID,
										name: 'Howard Harrison'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-07-01',
										endDate: '2008-07-31',
										venue: {
											model: 'VENUE',
											uuid: DORFMAN_THEATRE_VENUE_UUID,
											name: 'Dorfman Theatre',
											surVenue: null
										},
										surProduction: null
									},
									{
										model: 'PRODUCTION',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-08-01',
										endDate: '2008-08-31',
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
										uuid: WALDO_MATERIAL_UUID,
										name: 'Waldo',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Theatre Choreographer',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'PERSON',
										uuid: RAFAEL_AMARGO_PERSON_UUID,
										name: 'Rafael Amargo'
									}
								],
								productions: [],
								materials: []
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								type: 'Winner',
								entities: [
									{
										model: 'PERSON',
										uuid: STEVEN_HOGGETT_PERSON_UUID,
										name: 'Steven Hoggett'
									}
								],
								productions: [],
								materials: []
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [
									{
										model: 'PERSON',
										uuid: LYNNE_PAGE_PERSON_UUID,
										name: 'Lynne Page'
									},
									{
										model: 'PERSON',
										uuid: KATE_PRINCE_PERSON_UUID,
										name: 'Kate Prince'
									}
								],
								productions: [],
								materials: []
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Musical Revival',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: FRED_OLD_VIC_PRODUCTION_UUID,
										name: 'Fred',
										startDate: '2008-09-01',
										endDate: '2008-09-30',
										venue: {
											model: 'VENUE',
											uuid: OLD_VIC_THEATRE_VENUE_UUID,
											name: 'Old Vic Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: []
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Nomination',
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: PIAF_DONMAR_PRODUCTION_UUID,
										name: 'Piaf',
										startDate: '2008-08-08',
										endDate: '2008-09-20',
										venue: {
											model: 'VENUE',
											uuid: DONMAR_WAREHOUSE_VENUE_UUID,
											name: 'Donmar Warehouse',
											surVenue: null
										},
										surProduction: null
									},
									{
										model: 'PRODUCTION',
										uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID,
										name: 'Piaf',
										startDate: '2008-10-16',
										endDate: '2009-01-24',
										venue: {
											model: 'VENUE',
											uuid: VAUDEVILLE_THEATRE_VENUE_UUID,
											name: 'Vaudeville Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: []
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								type: 'Winner',
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-07-01',
										endDate: '2008-07-31',
										venue: {
											model: 'VENUE',
											uuid: DORFMAN_THEATRE_VENUE_UUID,
											name: 'Dorfman Theatre',
											surVenue: null
										},
										surProduction: null
									},
									{
										model: 'PRODUCTION',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-08-01',
										endDate: '2008-08-31',
										venue: {
											model: 'VENUE',
											uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
											name: 'Noël Coward Theatre',
											surVenue: null
										},
										surProduction: null
									}
								],
								materials: []
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Play',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Shortlisted',
								entities: [],
								productions: [],
								materials: [
									{
										model: 'MATERIAL',
										uuid: ENGLAND_PEOPLE_VERY_NICE_MATERIAL_UUID,
										name: 'England People Very Nice',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								type: 'Winner',
								entities: [],
								productions: [],
								materials: [
									{
										model: 'MATERIAL',
										uuid: JERUSALEM_MATERIAL_UUID,
										name: 'Jerusalem',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								type: 'Longlisted',
								entities: [],
								productions: [],
								materials: [
									{
										model: 'MATERIAL',
										uuid: OUR_CLASS_MATERIAL_UUID,
										name: 'Our Class',
										format: null,
										year: null,
										surMaterial: null,
										writingCredits: []
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Opera Production',
						nominations: []
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates award ceremony to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2009'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2009',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								customType: '',
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								],
								materials: [
									{
										model: 'MATERIAL',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('deletes awards ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/award-ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '2009',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const LAURENCE_OLIVIER_AWARDS_2019_AWARD_CEREMONY_UUID = '2019_2_AWARD_CEREMONY_UUID';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'LAURENCE_OLIVIER_AWARDS_AWARD_UUID';
		const LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID = '2020_2_AWARD_CEREMONY_UUID';
		const LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID = '2018_2_AWARD_CEREMONY_UUID';
		const EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID = '2019_4_AWARD_CEREMONY_UUID';
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID';
		const EVENING_STANDARD_THEATRE_AWARDS_2020_AWARD_CEREMONY_UUID = '2020_4_AWARD_CEREMONY_UUID';
		const EVENING_STANDARD_THEATRE_AWARDS_2018_AWARD_CEREMONY_UUID = '2018_4_AWARD_CEREMONY_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

			await purgeDatabase();

			await chai.request(app)
				.post('/award-ceremonies')
				.send({
					name: '2019',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/award-ceremonies')
				.send({
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/award-ceremonies')
				.send({
					name: '2018',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/award-ceremonies')
				.send({
					name: '2019',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

			await chai.request(app)
				.post('/award-ceremonies')
				.send({
					name: '2020',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

			await chai.request(app)
				.post('/award-ceremonies')
				.send({
					name: '2018',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all award ceremonies ordered by name then award name', async () => {

			const response = await chai.request(app)
				.get('/award-ceremonies');

			const expectedResponseBody = [
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_2020_AWARD_CEREMONY_UUID,
					name: '2020',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_2020_AWARD_CEREMONY_UUID,
					name: '2020',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_2019_AWARD_CEREMONY_UUID,
					name: '2019',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_2019_AWARD_CEREMONY_UUID,
					name: '2019',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_2018_AWARD_CEREMONY_UUID,
					name: '2018',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_2018_AWARD_CEREMONY_UUID,
					name: '2018',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
