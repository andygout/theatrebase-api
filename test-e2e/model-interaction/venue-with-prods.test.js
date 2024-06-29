import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const A_STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID = 'A_STREETCAR_NAMED_DESIRE_PRODUCTION_UUID';
const DONMAR_WAREHOUSE_VENUE_UUID = 'DONMAR_WAREHOUSE_VENUE_UUID';
const LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID = 'LIFE_IS_A_DREAM_PRODUCTION_UUID';
const RED_DONMAR_PRODUCTION_UUID = 'RED_PRODUCTION_UUID';

let donmarWarehouseVenue;
let streetcarNamedDesireDonmarProduction;
let lifeIsADreamDonmarProduction;
let redDonmarProduction;

const sandbox = createSandbox();

describe('Venue with multiple productions', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Streetcar Named Desire',
				startDate: '2009-07-23',
				pressDate: '2009-07-28',
				endDate: '2009-10-03',
				venue: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Life is a Dream',
				startDate: '2009-10-08',
				pressDate: '2009-10-13',
				endDate: '2009-11-28',
				venue: {
					name: 'Donmar Warehouse'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Red',
				startDate: '2009-12-03',
				pressDate: '2009-12-08',
				endDate: '2010-02-06',
				venue: {
					name: 'Donmar Warehouse'
				}
			});

		donmarWarehouseVenue = await chai.request(app)
			.get(`/venues/${DONMAR_WAREHOUSE_VENUE_UUID}`);

		streetcarNamedDesireDonmarProduction = await chai.request(app)
			.get(`/productions/${A_STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID}`);

		lifeIsADreamDonmarProduction = await chai.request(app)
			.get(`/productions/${LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID}`);

		redDonmarProduction = await chai.request(app)
			.get(`/productions/${RED_DONMAR_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Donmar Warehouse (venue)', () => {

		it('includes productions at this venue', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: RED_DONMAR_PRODUCTION_UUID,
					name: 'Red',
					startDate: '2009-12-03',
					endDate: '2010-02-06',
					subVenue: null,
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: LIFE_IS_A_DREAM_DONMAR_PRODUCTION_UUID,
					name: 'Life is a Dream',
					startDate: '2009-10-08',
					endDate: '2009-11-28',
					subVenue: null,
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: A_STREETCAR_NAMED_DESIRE_DONMAR_PRODUCTION_UUID,
					name: 'A Streetcar Named Desire',
					startDate: '2009-07-23',
					endDate: '2009-10-03',
					subVenue: null,
					surProduction: null
				}
			];

			const { productions } = donmarWarehouseVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('A Streetcar Named Desire at Donmar Warehouse (production)', () => {

		it('attributes venue as Donmar Warehouse', () => {

			const expectedVenue = {
				model: 'VENUE',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse',
				surVenue: null
			};

			const { venue } = streetcarNamedDesireDonmarProduction.body;

			expect(venue).to.deep.equal(expectedVenue);

		});

	});

	describe('Life is a Dream at Donmar Warehouse (production)', () => {

		it('attributes venue as Donmar Warehouse', () => {

			const expectedVenue = {
				model: 'VENUE',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse',
				surVenue: null
			};

			const { venue } = lifeIsADreamDonmarProduction.body;

			expect(venue).to.deep.equal(expectedVenue);

		});

	});

	describe('Red at Donmar Warehouse (production)', () => {

		it('attributes venue as Donmar Warehouse', () => {

			const expectedVenue = {
				model: 'VENUE',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse',
				surVenue: null
			};

			const { venue } = redDonmarProduction.body;

			expect(venue).to.deep.equal(expectedVenue);

		});

	});

});
