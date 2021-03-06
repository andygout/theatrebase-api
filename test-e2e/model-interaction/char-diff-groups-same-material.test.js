import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character with multiple appearances in the same material in different groups', () => {

	chai.use(chaiHttp);

	const THREE_WINTERS_MATERIAL_UUID = '6';
	const ALISA_KOS_CHARACTER_UUID = '8';
	const MAŠA_KOS_CHARACTER_UUID = '9';
	const ALEKSANDER_KING_CHARACTER_UUID = '10';
	const ROSE_KING_CHARACTER_UUID = '11';
	const THREE_WINTERS_NATIONAL_PRODUCTION_UUID = '12';
	const NATIONAL_THEATRE_VENUE_UUID = '14';
	const SIOBHAN_FINNERAN_PERSON_UUID = '15';
	const JO_HERBERT_PERSON_UUID = '16';
	const JAMES_LAURENSON_PERSON_UUID = '17';
	const JODIE_MCNEE_PERSON_UUID = '18';
	const ALEX_PRICE_PERSON_UUID = '19';
	const BEBE_SANDERS_PERSON_UUID = '20';

	let alisaKosCharacter;
	let mašaKosCharacter;
	let aleksanderKingCharacter;
	let roseKingCharacter;
	let threeWintersMaterial;
	let threeWintersNationalProduction;
	let siobhanFinneranPerson;
	let joHerbertPerson;
	let jamesLaurensonPerson;
	let jodieMcNeePerson;
	let alexPricePerson;
	let bebeSandersPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: '3 Winters',
				format: 'play',
				year: 2014,
				characterGroups: [
					{
						name: '2011',
						characters: [
							{
								name: 'Alisa Kos'
							},
							{
								name: 'Maša Kos'
							}
						]
					},
					{
						name: '1990',
						characters: [
							{
								name: 'Maša Kos'
							},
							{
								name: 'Aleksander King'
							},
							{
								name: 'Alisa Kos'
							}
						]
					},
					{
						name: '1945',
						characters: [
							{
								name: 'Rose King'
							},
							{
								name: 'Aleksander King'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: '3 Winters',
				startDate: '2014-11-26',
				pressDate: '2014-12-03',
				endDate: '2015-03-02',
				material: {
					name: '3 Winters'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Siobhan Finneran',
						roles: [
							{
								name: 'Maša Kos'
							}
						]
					},
					{
						name: 'Jo Herbert',
						roles: [
							{
								name: 'Rose King'
							}
						]
					},
					{
						name: 'James Laurenson',
						roles: [
							{
								name: 'Aleksander King',
								qualifier: '1990'
							}
						]
					},
					{
						name: 'Jodie McNee',
						roles: [
							{
								name: 'Alisa Kos',
								qualifier: '2011'
							}
						]
					},
					{
						name: 'Alex Price',
						roles: [
							{
								name: 'Aleksander King',
								qualifier: '1945'
							}
						]
					},
					{
						name: 'Bebe Sanders',
						roles: [
							{
								name: 'Alisa Kos',
								qualifier: '1990'
							}
						]
					}
				]
			});

		alisaKosCharacter = await chai.request(app)
			.get(`/characters/${ALISA_KOS_CHARACTER_UUID}`);

		mašaKosCharacter = await chai.request(app)
			.get(`/characters/${MAŠA_KOS_CHARACTER_UUID}`);

		aleksanderKingCharacter = await chai.request(app)
			.get(`/characters/${ALEKSANDER_KING_CHARACTER_UUID}`);

		roseKingCharacter = await chai.request(app)
			.get(`/characters/${ROSE_KING_CHARACTER_UUID}`);

		threeWintersMaterial = await chai.request(app)
			.get(`/materials/${THREE_WINTERS_MATERIAL_UUID}`);

		threeWintersNationalProduction = await chai.request(app)
			.get(`/productions/${THREE_WINTERS_NATIONAL_PRODUCTION_UUID}`);

		siobhanFinneranPerson = await chai.request(app)
			.get(`/people/${SIOBHAN_FINNERAN_PERSON_UUID}`);

		joHerbertPerson = await chai.request(app)
			.get(`/people/${JO_HERBERT_PERSON_UUID}`);

		jamesLaurensonPerson = await chai.request(app)
			.get(`/people/${JAMES_LAURENSON_PERSON_UUID}`);

		jodieMcNeePerson = await chai.request(app)
			.get(`/people/${JODIE_MCNEE_PERSON_UUID}`);

		alexPricePerson = await chai.request(app)
			.get(`/people/${ALEX_PRICE_PERSON_UUID}`);

		bebeSandersPerson = await chai.request(app)
			.get(`/people/${BEBE_SANDERS_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Alisa Kos (character)', () => {

		it('includes materials in which character is depicted, including the groups applied', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: THREE_WINTERS_MATERIAL_UUID,
					name: '3 Winters',
					format: 'play',
					year: 2014,
					writingCredits: [],
					depictions: [
						{
							displayName: null,
							qualifier: null,
							group: '2011'
						},
						{
							displayName: null,
							qualifier: null,
							group: '1990'
						}
					]
				}
			];

			const { materials } = alisaKosCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes productions in which character was portrayed, including by which performer and in which group', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'person',
							uuid: JODIE_MCNEE_PERSON_UUID,
							name: 'Jodie McNee',
							roleName: 'Alisa Kos',
							qualifier: '2011',
							isAlternate: null,
							otherRoles: []
						},
						{
							model: 'person',
							uuid: BEBE_SANDERS_PERSON_UUID,
							name: 'Bebe Sanders',
							roleName: 'Alisa Kos',
							qualifier: '1990',
							isAlternate: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = alisaKosCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Maša Kos (character)', () => {

		it('includes materials in which character is depicted, including the groups applied', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: THREE_WINTERS_MATERIAL_UUID,
					name: '3 Winters',
					format: 'play',
					year: 2014,
					writingCredits: [],
					depictions: [
						{
							displayName: null,
							qualifier: null,
							group: '2011'
						},
						{
							displayName: null,
							qualifier: null,
							group: '1990'
						}
					]
				}
			];

			const { materials } = mašaKosCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes productions in which character was portrayed, including by which performer and excluding group as not applied', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'person',
							uuid: SIOBHAN_FINNERAN_PERSON_UUID,
							name: 'Siobhan Finneran',
							roleName: 'Maša Kos',
							qualifier: null,
							isAlternate: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = mašaKosCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Aleksander King (character)', () => {

		it('includes materials in which character is depicted, including the groups applied', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: THREE_WINTERS_MATERIAL_UUID,
					name: '3 Winters',
					format: 'play',
					year: 2014,
					writingCredits: [],
					depictions: [
						{
							displayName: null,
							qualifier: null,
							group: '1990'
						},
						{
							displayName: null,
							qualifier: null,
							group: '1945'
						}
					]
				}
			];

			const { materials } = aleksanderKingCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes productions in which character was portrayed, including by which performer and in which group', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'person',
							uuid: JAMES_LAURENSON_PERSON_UUID,
							name: 'James Laurenson',
							roleName: 'Aleksander King',
							qualifier: '1990',
							isAlternate: null,
							otherRoles: []
						},
						{
							model: 'person',
							uuid: ALEX_PRICE_PERSON_UUID,
							name: 'Alex Price',
							roleName: 'Aleksander King',
							qualifier: '1945',
							isAlternate: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = aleksanderKingCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Rose King (character)', () => {

		it('includes materials in which character is depicted, including the groups applied', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: THREE_WINTERS_MATERIAL_UUID,
					name: '3 Winters',
					format: 'play',
					year: 2014,
					writingCredits: [],
					depictions: [
						{
							displayName: null,
							qualifier: null,
							group: '1945'
						}
					]
				}
			];

			const { materials } = roseKingCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes productions in which character was portrayed, including by which performer and excluding group as not applied', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'person',
							uuid: JO_HERBERT_PERSON_UUID,
							name: 'Jo Herbert',
							roleName: 'Rose King',
							qualifier: null,
							isAlternate: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = roseKingCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('3 Winters (material)', () => {

		it('includes characters in their respective groups', () => {

			const expectedCharacterGroups = [
				{
					model: 'characterGroup',
					name: '2011',
					position: 0,
					characters: [
						{
							model: 'character',
							uuid: ALISA_KOS_CHARACTER_UUID,
							name: 'Alisa Kos',
							qualifier: null
						},
						{
							model: 'character',
							uuid: MAŠA_KOS_CHARACTER_UUID,
							name: 'Maša Kos',
							qualifier: null
						}
					]
				},
				{
					model: 'characterGroup',
					name: '1990',
					position: 1,
					characters: [
						{
							model: 'character',
							uuid: MAŠA_KOS_CHARACTER_UUID,
							name: 'Maša Kos',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ALEKSANDER_KING_CHARACTER_UUID,
							name: 'Aleksander King',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ALISA_KOS_CHARACTER_UUID,
							name: 'Alisa Kos',
							qualifier: null
						}
					]
				},
				{
					model: 'characterGroup',
					name: '1945',
					position: 2,
					characters: [
						{
							model: 'character',
							uuid: ROSE_KING_CHARACTER_UUID,
							name: 'Rose King',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ALEKSANDER_KING_CHARACTER_UUID,
							name: 'Aleksander King',
							qualifier: null
						}
					]
				}
			];

			const { characterGroups } = threeWintersMaterial.body;

			expect(characterGroups).to.deep.equal(expectedCharacterGroups);

		});

	});

	describe('3 Winters at National Theatre (production)', () => {

		it('includes the portrayers of the characters in its cast with their corresponding qualifiers', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: SIOBHAN_FINNERAN_PERSON_UUID,
					name: 'Siobhan Finneran',
					roles: [
						{
							model: 'character',
							uuid: MAŠA_KOS_CHARACTER_UUID,
							name: 'Maša Kos',
							qualifier: null,
							isAlternate: null
						}
					]
				},
				{
					model: 'person',
					uuid: JO_HERBERT_PERSON_UUID,
					name: 'Jo Herbert',
					roles: [
						{
							model: 'character',
							uuid: ROSE_KING_CHARACTER_UUID,
							name: 'Rose King',
							qualifier: null,
							isAlternate: null
						}
					]
				},
				{
					model: 'person',
					uuid: JAMES_LAURENSON_PERSON_UUID,
					name: 'James Laurenson',
					roles: [
						{
							model: 'character',
							uuid: ALEKSANDER_KING_CHARACTER_UUID,
							name: 'Aleksander King',
							qualifier: '1990',
							isAlternate: null
						}
					]
				},
				{
					model: 'person',
					uuid: JODIE_MCNEE_PERSON_UUID,
					name: 'Jodie McNee',
					roles: [
						{
							model: 'character',
							uuid: ALISA_KOS_CHARACTER_UUID,
							name: 'Alisa Kos',
							qualifier: '2011',
							isAlternate: null
						}
					]
				},
				{
					model: 'person',
					uuid: ALEX_PRICE_PERSON_UUID,
					name: 'Alex Price',
					roles: [
						{
							model: 'character',
							uuid: ALEKSANDER_KING_CHARACTER_UUID,
							name: 'Aleksander King',
							qualifier: '1945',
							isAlternate: null
						}
					]
				},
				{
					model: 'person',
					uuid: BEBE_SANDERS_PERSON_UUID,
					name: 'Bebe Sanders',
					roles: [
						{
							model: 'character',
							uuid: ALISA_KOS_CHARACTER_UUID,
							name: 'Alisa Kos',
							qualifier: '1990',
							isAlternate: null
						}
					]
				}
			];

			const { cast } = threeWintersNationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Siobhan Finneran (person)', () => {

		it('includes in their production credits their portrayal of Maša Kos without a qualifier (as it is not required)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: MAŠA_KOS_CHARACTER_UUID,
							name: 'Maša Kos',
							qualifier: null,
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = siobhanFinneranPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Jo Herbert (person)', () => {

		it('includes in their production credits their portrayal of Rose King without a qualifier (as it is not required)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: ROSE_KING_CHARACTER_UUID,
							name: 'Rose King',
							qualifier: null,
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = joHerbertPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('James Laurenson (person)', () => {

		it('includes in their production credits their portrayal of Aleksander King with its corresponding qualifier (i.e. 1990)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: ALEKSANDER_KING_CHARACTER_UUID,
							name: 'Aleksander King',
							qualifier: '1990',
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = jamesLaurensonPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Jodie McNee (person)', () => {

		it('includes in their production credits their portrayal of Alisa Kos with its corresponding qualifier (i.e. 2011)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: ALISA_KOS_CHARACTER_UUID,
							name: 'Alisa Kos',
							qualifier: '2011',
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = jodieMcNeePerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Alex Price (person)', () => {

		it('includes in their production credits their portrayal of Aleksander King with its corresponding qualifier (i.e. 1945)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: ALEKSANDER_KING_CHARACTER_UUID,
							name: 'Aleksander King',
							qualifier: '1945',
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = alexPricePerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Bebe Sanders (person)', () => {

		it('includes in their production credits their portrayal of Alisa Kos with its corresponding qualifier (i.e. 1990)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
					name: '3 Winters',
					startDate: '2014-11-26',
					endDate: '2015-03-02',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: ALISA_KOS_CHARACTER_UUID,
							name: 'Alisa Kos',
							qualifier: '1990',
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = bebeSandersPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
