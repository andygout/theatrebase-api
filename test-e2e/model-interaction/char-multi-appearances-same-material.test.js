import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character with multiple appearances in the same material under different qualifiers', () => {

	chai.use(chaiHttp);

	const ROCK_N_ROLL_MATERIAL_UUID = '6';
	const ESME_CHARACTER_UUID = '8';
	const MAX_CHARACTER_UUID = '9';
	const ELEANOR_CHARACTER_UUID = '10';
	const ALICE_CHARACTER_UUID = '11';
	const ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID = '12';
	const ROYAL_COURT_THEATRE_VENUE_UUID = '14';
	const ALICE_EVE_PERSON_UUID = '15';
	const BRIAN_COX_PERSON_UUID = '16';
	const SINEAD_CUSACK_PERSON_UUID = '17';

	let esmeCharacter;
	let aliceCharacter;
	let eleanorCharacter;
	let rockNRollMaterial;
	let rockNRollRoyalCourtProduction;
	let aliceEvePerson;
	let sineadCusackPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Rock \'n\' Roll',
				format: 'play',
				year: 2006,
				characterGroups: [
					{
						characters: [
							{
								name: 'Esme',
								qualifier: 'younger'
							},
							{
								name: 'Max',
								qualifier: ''
							},
							{
								name: 'Eleanor',
								qualifier: ''
							},
							{
								name: 'Esme',
								qualifier: 'older'
							},
							{
								name: 'Alice',
								qualifier: ''
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Rock \'n\' Roll',
				startDate: '2006-06-03',
				pressDate: '2006-06-14',
				endDate: '2006-07-15',
				material: {
					name: 'Rock \'n\' Roll'
				},
				venue: {
					name: 'Royal Court Theatre'
				},
				cast: [
					{
						name: 'Alice Eve',
						roles: [
							{
								name: 'Esme',
								qualifier: 'younger'
							},
							{
								name: 'Alice',
								qualifier: ''
							}
						]
					},
					{
						name: 'Brian Cox',
						roles: [
							{
								name: 'Max',
								qualifier: ''
							}
						]
					},
					{
						name: 'Sinead Cusack',
						roles: [
							{
								name: 'Eleanor',
								qualifier: ''
							},
							{
								name: 'Esme',
								qualifier: 'older'
							}
						]
					}
				]
			});

		esmeCharacter = await chai.request(app)
			.get(`/characters/${ESME_CHARACTER_UUID}`);

		aliceCharacter = await chai.request(app)
			.get(`/characters/${ALICE_CHARACTER_UUID}`);

		eleanorCharacter = await chai.request(app)
			.get(`/characters/${ELEANOR_CHARACTER_UUID}`);

		rockNRollMaterial = await chai.request(app)
			.get(`/materials/${ROCK_N_ROLL_MATERIAL_UUID}`);

		rockNRollRoyalCourtProduction = await chai.request(app)
			.get(`/productions/${ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID}`);

		aliceEvePerson = await chai.request(app)
			.get(`/people/${ALICE_EVE_PERSON_UUID}`);

		sineadCusackPerson = await chai.request(app)
			.get(`/people/${SINEAD_CUSACK_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Esme (character)', () => {

		it('includes materials in which character is depicted, including the qualifiers used', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: ROCK_N_ROLL_MATERIAL_UUID,
					name: 'Rock \'n\' Roll',
					format: 'play',
					year: 2006,
					writingCredits: [],
					depictions: [
						{
							displayName: null,
							qualifier: 'younger',
							group: null
						},
						{
							displayName: null,
							qualifier: 'older',
							group: null
						}
					]
				}
			];

			const { materials } = esmeCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes productions in which character was portrayed, including by which performer and under which qualifier', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'venue',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'person',
							uuid: ALICE_EVE_PERSON_UUID,
							name: 'Alice Eve',
							roleName: 'Esme',
							qualifier: 'younger',
							isAlternate: null,
							otherRoles: [
								{
									model: 'character',
									uuid: ALICE_CHARACTER_UUID,
									name: 'Alice',
									qualifier: null,
									isAlternate: null
								}
							]
						},
						{
							model: 'person',
							uuid: SINEAD_CUSACK_PERSON_UUID,
							name: 'Sinead Cusack',
							roleName: 'Esme',
							qualifier: 'older',
							isAlternate: null,
							otherRoles: [
								{
									model: 'character',
									uuid: ELEANOR_CHARACTER_UUID,
									name: 'Eleanor',
									qualifier: null,
									isAlternate: null
								}
							]
						}
					]
				}
			];

			const { productions } = esmeCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Alice (character)', () => {

		it('includes productions in which character was portrayed, including performer\'s other roles with qualifiers', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'venue',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'person',
							uuid: ALICE_EVE_PERSON_UUID,
							name: 'Alice Eve',
							roleName: 'Alice',
							qualifier: null,
							isAlternate: null,
							otherRoles: [
								{
									model: 'character',
									uuid: ESME_CHARACTER_UUID,
									name: 'Esme',
									qualifier: 'younger',
									isAlternate: null
								}
							]
						}
					]
				}
			];

			const { productions } = aliceCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Eleanor (character)', () => {

		it('includes productions in which character was portrayed, including performer\'s other roles with qualifiers', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'venue',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'person',
							uuid: SINEAD_CUSACK_PERSON_UUID,
							name: 'Sinead Cusack',
							roleName: 'Eleanor',
							qualifier: null,
							isAlternate: null,
							otherRoles: [
								{
									model: 'character',
									uuid: ESME_CHARACTER_UUID,
									name: 'Esme',
									qualifier: 'older',
									isAlternate: null
								}
							]
						}
					]
				}
			];

			const { productions } = eleanorCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Rock \'n\' Roll (material)', () => {

		it('includes Esme in its characters with an entry for each qualifier', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: ESME_CHARACTER_UUID,
					name: 'Esme',
					qualifier: 'younger'
				},
				{
					model: 'character',
					uuid: MAX_CHARACTER_UUID,
					name: 'Max',
					qualifier: null
				},
				{
					model: 'character',
					uuid: ELEANOR_CHARACTER_UUID,
					name: 'Eleanor',
					qualifier: null
				},
				{
					model: 'character',
					uuid: ESME_CHARACTER_UUID,
					name: 'Esme',
					qualifier: 'older'
				},
				{
					model: 'character',
					uuid: ALICE_CHARACTER_UUID,
					name: 'Alice',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = rockNRollMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Rock \'n\' Roll at Royal Court Theatre (production)', () => {

		it('includes the portrayers of Esme in its cast with their corresponding qualifiers', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: ALICE_EVE_PERSON_UUID,
					name: 'Alice Eve',
					roles: [
						{
							model: 'character',
							uuid: ESME_CHARACTER_UUID,
							name: 'Esme',
							qualifier: 'younger',
							isAlternate: null
						},
						{
							model: 'character',
							uuid: ALICE_CHARACTER_UUID,
							name: 'Alice',
							qualifier: null,
							isAlternate: null
						}
					]
				},
				{
					model: 'person',
					uuid: BRIAN_COX_PERSON_UUID,
					name: 'Brian Cox',
					roles: [
						{
							model: 'character',
							uuid: MAX_CHARACTER_UUID,
							name: 'Max',
							qualifier: null,
							isAlternate: null
						}
					]
				},
				{
					model: 'person',
					uuid: SINEAD_CUSACK_PERSON_UUID,
					name: 'Sinead Cusack',
					roles: [
						{
							model: 'character',
							uuid: ELEANOR_CHARACTER_UUID,
							name: 'Eleanor',
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: ESME_CHARACTER_UUID,
							name: 'Esme',
							qualifier: 'older',
							isAlternate: null
						}
					]
				}
			];

			const { cast } = rockNRollRoyalCourtProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Alice Eve (person)', () => {

		it('includes in their production credits their portrayal of Esme with its corresponding qualifier (i.e. younger)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'venue',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: ESME_CHARACTER_UUID,
							name: 'Esme',
							qualifier: 'younger',
							isAlternate: null
						},
						{
							model: 'character',
							uuid: ALICE_CHARACTER_UUID,
							name: 'Alice',
							qualifier: null,
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = aliceEvePerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Sinead Cusack (person)', () => {

		it('includes in their production credits their portrayal of Esme with its corresponding qualifier (i.e. older)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'venue',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: ELEANOR_CHARACTER_UUID,
							name: 'Eleanor',
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: ESME_CHARACTER_UUID,
							name: 'Esme',
							qualifier: 'older',
							isAlternate: null
						}
					]
				}
			];

			const { castMemberProductions } = sineadCusackPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
