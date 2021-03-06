import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Venue with sub-venues', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_VENUE_UUID = '4';
	const OLIVIER_THEATRE_VENUE_UUID = '5';
	const LYTTELTON_THEATRE_VENUE_UUID = '6';
	const DORFMAN_THEATRE_VENUE_UUID = '7';
	const MOTHER_COURAGE_AND_HER_CHILDREN_MATERIAL_UUID = '11';
	const MOTHER_COURAGE_CHARACTER_UUID = '13';
	const RICHARD_II_MATERIAL_UUID = '17';
	const KING_RICHARD_II_CHARACTER_UUID = '19';
	const MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID = '20';
	const FIONA_SHAW_PERSON_UUID = '23';
	const RICHARD_II_NATIONAL_PRODUCTION_UUID = '24';

	let nationalTheatreVenue;
	let olivierTheatreVenue;
	let motherCourageCharacter;
	let kingRichardIICharacter;
	let motherCourageAndHerChildrenMaterial;
	let richardIIMaterial;
	let motherCourageAndHerChildrenOlivierProduction;
	let richardIINationalProduction;
	let fionaShawPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'National Theatre',
				subVenues: [
					{
						name: 'Olivier Theatre'
					},
					{
						name: 'Lyttelton Theatre'
					},
					{
						name: 'Dorfman Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mother Courage and Her Children',
				characterGroups: [
					{
						characters: [
							{
								name: 'Mother Courage'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Richard II',
				characterGroups: [
					{
						characters: [
							{
								name: 'King Richard II'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mother Courage and Her Children',
				startDate: '2009-09-16',
				pressDate: '2009-09-25',
				endDate: '2009-12-08',
				material: {
					name: 'Mother Courage and Her Children'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				cast: [
					{
						name: 'Fiona Shaw',
						roles: [
							{
								name: 'Mother Courage'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Richard II',
				startDate: '1995-05-26',
				pressDate: '1995-06-02',
				endDate: '1996-02-17',
				material: {
					name: 'Richard II'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Fiona Shaw',
						roles: [
							{
								name: 'King Richard II'
							}
						]
					}
				]
			});

		nationalTheatreVenue = await chai.request(app)
			.get(`/venues/${NATIONAL_THEATRE_VENUE_UUID}`);

		olivierTheatreVenue = await chai.request(app)
			.get(`/venues/${OLIVIER_THEATRE_VENUE_UUID}`);

		motherCourageCharacter = await chai.request(app)
			.get(`/characters/${MOTHER_COURAGE_CHARACTER_UUID}`);

		kingRichardIICharacter = await chai.request(app)
			.get(`/characters/${KING_RICHARD_II_CHARACTER_UUID}`);

		motherCourageAndHerChildrenMaterial = await chai.request(app)
			.get(`/materials/${MOTHER_COURAGE_AND_HER_CHILDREN_MATERIAL_UUID}`);

		richardIIMaterial = await chai.request(app)
			.get(`/materials/${RICHARD_II_MATERIAL_UUID}`);

		motherCourageAndHerChildrenOlivierProduction = await chai.request(app)
			.get(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID}`);

		richardIINationalProduction = await chai.request(app)
			.get(`/productions/${RICHARD_II_NATIONAL_PRODUCTION_UUID}`);

		fionaShawPerson = await chai.request(app)
			.get(`/people/${FIONA_SHAW_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('National Theatre (venue)', () => {

		it('includes its sub-venues', () => {

			const expectedSubVenues = [
				{
					model: 'venue',
					uuid: OLIVIER_THEATRE_VENUE_UUID,
					name: 'Olivier Theatre'
				},
				{
					model: 'venue',
					uuid: LYTTELTON_THEATRE_VENUE_UUID,
					name: 'Lyttelton Theatre'
				},
				{
					model: 'venue',
					uuid: DORFMAN_THEATRE_VENUE_UUID,
					name: 'Dorfman Theatre'
				}
			];

			const { subVenues } = nationalTheatreVenue.body;

			expect(subVenues).to.deep.equal(expectedSubVenues);

		});

		it('includes productions at this venue and, where applicable, the specific sub-venue', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
					subVenue: {
						model: 'venue',
						name: 'Olivier Theatre',
						uuid: OLIVIER_THEATRE_VENUE_UUID
					}
				},
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					subVenue: null
				}
			];

			const { productions } = nationalTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Olivier Theatre (venue)', () => {

		it('includes National Theatre as its sur-venue', () => {

			const expectedSurVenue = {
				model: 'venue',
				uuid: NATIONAL_THEATRE_VENUE_UUID,
				name: 'National Theatre'
			};

			const { surVenue } = olivierTheatreVenue.body;

			expect(surVenue).to.deep.equal(expectedSurVenue);

		});

		it('includes productions at this venue', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
					subVenue: null
				}
			];

			const { productions } = olivierTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Mother Courage (character)', () => {

		it('includes productions in which character was portrayed, including the venue and its sur-venue', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
					venue: {
						model: 'venue',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'venue',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					performers: [
						{
							model: 'person',
							uuid: FIONA_SHAW_PERSON_UUID,
							name: 'Fiona Shaw',
							roleName: 'Mother Courage',
							qualifier: null,
							isAlternate: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = motherCourageCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('King Richard II (character)', () => {

		it('includes productions in which character was portrayed, including the venue (but with no sur-venue as does not apply)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'person',
							uuid: FIONA_SHAW_PERSON_UUID,
							name: 'Fiona Shaw',
							roleName: 'King Richard II',
							qualifier: null,
							isAlternate: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = kingRichardIICharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Mother Courage and Her Children (material)', () => {

		it('includes productions of material, including the venue and its sur-venue', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
					venue: {
						model: 'venue',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'venue',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					}
				}
			];

			const { productions } = motherCourageAndHerChildrenMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Richard II (material)', () => {

		it('includes productions of material, including the venue (but with no sur-venue as does not apply)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					}
				}
			];

			const { productions } = richardIIMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Mother Courage and Her Children at Olivier Theatre (production)', () => {

		it('includes the venue and its sur-venue', () => {

			const expectedVenue = {
				model: 'venue',
				uuid: OLIVIER_THEATRE_VENUE_UUID,
				name: 'Olivier Theatre',
				surVenue: {
					model: 'venue',
					uuid: NATIONAL_THEATRE_VENUE_UUID,
					name: 'National Theatre'
				}
			};

			const { venue } = motherCourageAndHerChildrenOlivierProduction.body;

			expect(venue).to.deep.equal(expectedVenue);

		});

	});

	describe('Richard II at National Theatre (production)', () => {

		it('includes the venue (but with no sur-venue as does not apply)', () => {

			const expectedVenue = {
				model: 'venue',
				uuid: NATIONAL_THEATRE_VENUE_UUID,
				name: 'National Theatre',
				surVenue: null
			};

			const { venue } = richardIINationalProduction.body;

			expect(venue).to.deep.equal(expectedVenue);

		});

	});

	describe('Fiona Shaw (person)', () => {

		it('includes in their production credits the venue and, where applicable, its sur-venue', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
					venue: {
						model: 'venue',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'venue',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					roles: [
						{
							model: 'character',
							uuid: MOTHER_COURAGE_CHARACTER_UUID,
							name: 'Mother Courage',
							qualifier: null,
							isAlternate: null
						}
					]
				},
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_RICHARD_II_CHARACTER_UUID,
							name: 'King Richard II',
							qualifier: null,
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = fionaShawPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('venues list', () => {

		it('includes venue and corresponding sub-venues', async () => {

			const response = await chai.request(app)
				.get('/venues');

			const expectedResponseBody = [
				{
					model: 'venue',
					uuid: NATIONAL_THEATRE_VENUE_UUID,
					name: 'National Theatre',
					subVenues: [
						{
							model: 'venue',
							uuid: OLIVIER_THEATRE_VENUE_UUID,
							name: 'Olivier Theatre'
						},
						{
							model: 'venue',
							uuid: LYTTELTON_THEATRE_VENUE_UUID,
							name: 'Lyttelton Theatre'
						},
						{
							model: 'venue',
							uuid: DORFMAN_THEATRE_VENUE_UUID,
							name: 'Dorfman Theatre'
						}
					]
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('productions list', () => {

		it('includes venue and (if applicable) corresponding sur-venue', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
					venue: {
						model: 'venue',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'venue',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					}
				},
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
