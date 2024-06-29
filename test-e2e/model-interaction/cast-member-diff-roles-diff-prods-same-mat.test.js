import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const KING_LEAR_CHARACTER_UUID = 'KING_LEAR_CHARACTER_UUID';
const FOOL_CHARACTER_UUID = 'FOOL_CHARACTER_UUID';
const KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'KING_LEAR_PRODUCTION_UUID';
const ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID = 'ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID';
const MICHAEL_GAMBON_PERSON_UUID = 'MICHAEL_GAMBON_PERSON_UUID';
const ANTONY_SHER_PERSON_UUID = 'ANTONY_SHER_PERSON_UUID';
const KING_LEAR_BARBICAN_PRODUCTION_UUID = 'KING_LEAR_2_PRODUCTION_UUID';
const BARBICAN_THEATRE_VENUE_UUID = 'BARBICAN_THEATRE_VENUE_UUID';
const GRAHAM_TURNER_PERSON_UUID = 'GRAHAM_TURNER_PERSON_UUID';

let kingLearCharacter;
let foolCharacter;
let kingLearRoyalShakespeareProduction;
let kingLearBarbicanProduction;
let michaelGambonPerson;
let antonySherPerson;
let grahamTurnerPerson;

const sandbox = createSandbox();

describe('Cast member performing different roles in different productions of same material', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Tragedy of King Lear',
				characterGroups: [
					{
						characters: [
							{
								name: 'King Lear'
							},
							{
								name: 'Fool'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'King Lear',
				startDate: '1982-06-20',
				pressDate: '1982-06-28',
				endDate: '1982-08-28',
				material: {
					name: 'The Tragedy of King Lear'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Michael Gambon',
						roles: [
							{
								name: 'King Lear'
							}
						]
					},
					{
						name: 'Antony Sher',
						roles: [
							{
								name: 'Fool'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'King Lear',
				startDate: '2016-11-10',
				pressDate: '2016-11-15',
				endDate: '2016-12-23',
				material: {
					name: 'The Tragedy of King Lear'
				},
				venue: {
					name: 'Barbican Theatre'
				},
				cast: [
					{
						name: 'Antony Sher',
						roles: [
							{
								name: 'King Lear'
							}
						]
					},
					{
						name: 'Graham Turner',
						roles: [
							{
								name: 'Fool'
							}
						]
					}
				]
			});

		kingLearCharacter = await chai.request(app)
			.get(`/characters/${KING_LEAR_CHARACTER_UUID}`);

		foolCharacter = await chai.request(app)
			.get(`/characters/${FOOL_CHARACTER_UUID}`);

		kingLearRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		kingLearBarbicanProduction = await chai.request(app)
			.get(`/productions/${KING_LEAR_BARBICAN_PRODUCTION_UUID}`);

		michaelGambonPerson = await chai.request(app)
			.get(`/people/${MICHAEL_GAMBON_PERSON_UUID}`);

		antonySherPerson = await chai.request(app)
			.get(`/people/${ANTONY_SHER_PERSON_UUID}`);

		grahamTurnerPerson = await chai.request(app)
			.get(`/people/${GRAHAM_TURNER_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('King Lear (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
					name: 'King Lear',
					startDate: '2016-11-10',
					endDate: '2016-12-23',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: ANTONY_SHER_PERSON_UUID,
							name: 'Antony Sher',
							roleName: 'King Lear',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'King Lear',
					startDate: '1982-06-20',
					endDate: '1982-08-28',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'King Lear',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = kingLearCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Fool (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
					name: 'King Lear',
					startDate: '2016-11-10',
					endDate: '2016-12-23',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: GRAHAM_TURNER_PERSON_UUID,
							name: 'Graham Turner',
							roleName: 'Fool',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'King Lear',
					startDate: '1982-06-20',
					endDate: '1982-08-28',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: ANTONY_SHER_PERSON_UUID,
							name: 'Antony Sher',
							roleName: 'Fool',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = foolCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('King Lear at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Michael Gambon as King Lear and Antony Sher as Fool', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: MICHAEL_GAMBON_PERSON_UUID,
					name: 'Michael Gambon',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_LEAR_CHARACTER_UUID,
							name: 'King Lear',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: ANTONY_SHER_PERSON_UUID,
					name: 'Antony Sher',
					roles: [
						{
							model: 'CHARACTER',
							uuid: FOOL_CHARACTER_UUID,
							name: 'Fool',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = kingLearRoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('King Lear at Barbican (production)', () => {

		it('includes cast with Antony Sher as King Lear and Graham Turner as Fool', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: ANTONY_SHER_PERSON_UUID,
					name: 'Antony Sher',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_LEAR_CHARACTER_UUID,
							name: 'King Lear',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: GRAHAM_TURNER_PERSON_UUID,
					name: 'Graham Turner',
					roles: [
						{
							model: 'CHARACTER',
							uuid: FOOL_CHARACTER_UUID,
							name: 'Fool',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = kingLearBarbicanProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Michael Gambon (person)', () => {

		it('includes production with his portrayal of King Lear', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'King Lear',
					startDate: '1982-06-20',
					endDate: '1982-08-28',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_LEAR_CHARACTER_UUID,
							name: 'King Lear',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = michaelGambonPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Antony Sher (person)', () => {

		it('includes production with his respective portrayals of King Lear and the Fool', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
					name: 'King Lear',
					startDate: '2016-11-10',
					endDate: '2016-12-23',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_LEAR_CHARACTER_UUID,
							name: 'King Lear',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'King Lear',
					startDate: '1982-06-20',
					endDate: '1982-08-28',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: FOOL_CHARACTER_UUID,
							name: 'Fool',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = antonySherPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Graham Turner (person)', () => {

		it('includes production with his portrayal of the Fool', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
					name: 'King Lear',
					startDate: '2016-11-10',
					endDate: '2016-12-23',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: FOOL_CHARACTER_UUID,
							name: 'Fool',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = grahamTurnerPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
