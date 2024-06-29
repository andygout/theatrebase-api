import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const TWELFTH_NIGHT_MATERIAL_UUID = 'TWELFTH_NIGHT_MATERIAL_UUID';
const WILLIAM_SHAKESPEARE_PERSON_UUID = 'WILLIAM_SHAKESPEARE_PERSON_UUID';
const THE_KINGS_MEN_COMPANY_UUID = 'THE_KINGS_MEN_COMPANY_UUID';
const TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID = 'TWELFTH_NIGHT_PRODUCTION_UUID';
const SHAKESPEARES_GLOBE_VENUE_UUID = 'SHAKESPEARES_GLOBE_VENUE_UUID';
const TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID = 'TWELFTH_NIGHT_OR_WHAT_YOU_WILL_PRODUCTION_UUID';
const DONMAR_WAREHOUSE_VENUE_UUID = 'DONMAR_WAREHOUSE_VENUE_UUID';
const TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID = 'TWELFTH_NIGHT_2_PRODUCTION_UUID';
const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';

let twelfthNightMaterial;
let williamShakespearePerson;
let theKingsMenCompany;
let twelfthNightGlobeProduction;
let twelfthNightDonmarProduction;
let twelfthNightNationalProduction;

const sandbox = createSandbox();

describe('Material with multiple productions', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Twelfth Night',
				format: 'play',
				year: '1602',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: 'The King\'s Men'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night',
				startDate: '2012-09-22',
				endDate: '2012-10-14',
				material: {
					name: 'Twelfth Night'
				},
				venue: {
					name: 'Shakespeare\'s Globe'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night, or What You Will',
				startDate: '2002-10-11',
				pressDate: '2002-10-22',
				endDate: '2002-11-30',
				material: {
					name: 'Twelfth Night'
				},
				venue: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Twelfth Night',
				startDate: '2011-01-11',
				pressDate: '2011-01-18',
				endDate: '2011-03-02',
				material: {
					name: 'Twelfth Night'
				},
				venue: {
					name: 'National Theatre'
				}
			});

		twelfthNightMaterial = await chai.request(app)
			.get(`/materials/${TWELFTH_NIGHT_MATERIAL_UUID}`);

		williamShakespearePerson = await chai.request(app)
			.get(`/people/${WILLIAM_SHAKESPEARE_PERSON_UUID}`);

		theKingsMenCompany = await chai.request(app)
			.get(`/companies/${THE_KINGS_MEN_COMPANY_UUID}`);

		twelfthNightGlobeProduction = await chai.request(app)
			.get(`/productions/${TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID}`);

		twelfthNightDonmarProduction = await chai.request(app)
			.get(`/productions/${TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID}`);

		twelfthNightNationalProduction = await chai.request(app)
			.get(`/productions/${TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Twelfth Night (material)', () => {

		it('includes productions of material ordered by production name then venue name', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2012-09-22',
					endDate: '2012-10-14',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2011-01-11',
					endDate: '2011-03-02',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID,
					name: 'Twelfth Night, or What You Will',
					startDate: '2002-10-11',
					endDate: '2002-11-30',
					venue: {
						model: 'VENUE',
						uuid: DONMAR_WAREHOUSE_VENUE_UUID,
						name: 'Donmar Warehouse',
						surVenue: null
					},
					surProduction: null
				}
			];

			const { productions } = twelfthNightMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('William Shakespeare (person)', () => {

		it('includes productions of materials they have written', () => {

			const expectedMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2012-09-22',
					endDate: '2012-10-14',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2011-01-11',
					endDate: '2011-03-02',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID,
					name: 'Twelfth Night, or What You Will',
					startDate: '2002-10-11',
					endDate: '2002-11-30',
					venue: {
						model: 'VENUE',
						uuid: DONMAR_WAREHOUSE_VENUE_UUID,
						name: 'Donmar Warehouse',
						surVenue: null
					},
					surProduction: null
				}
			];

			const { materialProductions } = williamShakespearePerson.body;

			expect(materialProductions).to.deep.equal(expectedMaterialProductions);

		});

	});

	describe('The King\'s Men (company)', () => {

		it('includes productions of materials they have written', () => {

			const expectedMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_GLOBE_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2012-09-22',
					endDate: '2012-10-14',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_NATIONAL_PRODUCTION_UUID,
					name: 'Twelfth Night',
					startDate: '2011-01-11',
					endDate: '2011-03-02',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: TWELFTH_NIGHT_OR_WHAT_YOU_WILL_DONMAR_PRODUCTION_UUID,
					name: 'Twelfth Night, or What You Will',
					startDate: '2002-10-11',
					endDate: '2002-11-30',
					venue: {
						model: 'VENUE',
						uuid: DONMAR_WAREHOUSE_VENUE_UUID,
						name: 'Donmar Warehouse',
						surVenue: null
					},
					surProduction: null
				}
			];

			const { materialProductions } = theKingsMenCompany.body;

			expect(materialProductions).to.deep.equal(expectedMaterialProductions);

		});

	});

	describe('Twelfth Night at Shakespeare\'s Globe (production)', () => {

		it('attributes material as Twelfth Night', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				year: 1602,
				surMaterial: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								uuid: THE_KINGS_MEN_COMPANY_UUID,
								name: 'The King\'s Men'
							}
						]
					}
				]
			};

			const { material } = twelfthNightGlobeProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Twelfth Night at Donmar Warehouse (production)', () => {

		it('attributes material as Twelfth Night', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				year: 1602,
				surMaterial: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								uuid: THE_KINGS_MEN_COMPANY_UUID,
								name: 'The King\'s Men'
							}
						]
					}
				]
			};

			const { material } = twelfthNightDonmarProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Twelfth Night at National Theatre (production)', () => {

		it('attributes material as Twelfth Night', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night',
				format: 'play',
				year: 1602,
				surMaterial: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								uuid: THE_KINGS_MEN_COMPANY_UUID,
								name: 'The King\'s Men'
							}
						]
					}
				]
			};

			const { material } = twelfthNightNationalProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

});
