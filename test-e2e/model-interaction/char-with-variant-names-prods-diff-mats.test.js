import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const HAMLET_MATERIAL_UUID = 'HAMLET_MATERIAL_UUID';
const HAMLET_CHARACTER_UUID = 'HAMLET_CHARACTER_UUID';
const CLAUDIUS_CHARACTER_UUID = 'CLAUDIUS_CHARACTER_UUID';
const ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_MATERIAL_UUID = 'ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_MATERIAL_UUID';
const FORTINBRAS_MATERIAL_UUID = 'FORTINBRAS_MATERIAL_UUID';
const HAMLETMACHINE_MATERIAL_UUID = 'HAMLETMACHINE_MATERIAL_UUID';
const HAMLET_NATIONAL_PRODUCTION_UUID = 'HAMLET_PRODUCTION_UUID';
const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';
const RORY_KINNEAR_PERSON_UUID = 'RORY_KINNEAR_PERSON_UUID';
const PATRICK_MALAHIDE_PERSON_UUID = 'PATRICK_MALAHIDE_PERSON_UUID';
const ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_HAYMARKET_PRODUCTION_UUID = 'ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_PRODUCTION_UUID';
const THEATRE_ROYAL_HAYMARKET_VENUE_UUID = 'THEATRE_ROYAL_HAYMARKET_VENUE_UUID';
const JACK_HAWKINS_PERSON_UUID = 'JACK_HAWKINS_PERSON_UUID';
const JAMES_SIMMONS_PERSON_UUID = 'JAMES_SIMMONS_PERSON_UUID';
const FORTINBRAS_LA_JOLLA_PRODUCTION_UUID = 'FORTINBRAS_PRODUCTION_UUID';
const LA_JOLLA_PLAYHOUSE_VENUE_UUID = 'LA_JOLLA_PLAYHOUSE_VENUE_UUID';
const DON_REILLY_PERSON_UUID = 'DON_REILLY_PERSON_UUID';
const JONATHAN_FREEMAN_PERSON_UUID = 'JONATHAN_FREEMAN_PERSON_UUID';
const HAMLETMACHINE_TEATRO_SAN_NICOLÒ_PRODUCTION_UUID = 'HAMLETMACHINE_PRODUCTION_UUID';
const TEATRO_SAN_NICOLÒ_VENUE_UUID = 'TEATRO_SAN_NICOLO_VENUE_UUID';
const GABRIELE_CICIRELLO_PERSON_UUID = 'GABRIELE_CICIRELLO_PERSON_UUID';
const RENATO_CIVELLO_PERSON_UUID = 'RENATO_CIVELLO_PERSON_UUID';

let hamletCharacter;
let hamletNationalProduction;
let rosencrantzAndGuildensternAreDeadHaymarketProduction;
let fortinbrasLaJollaProduction;
let hamletmachineTetroSanNicolòProduction;
let roryKinnearPerson;
let jackHawkinsPerson;
let donReillyPerson;
let gabrieleCicirelloPerson;

const sandbox = createSandbox();

describe('Character with variant names from productions of different materials', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hamlet',
				format: 'play',
				year: '1601',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Rosencrantz and Guildenstern Are Dead',
				format: 'play',
				year: '1966',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Fortinbras',
				format: 'play',
				year: '1991',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hamletmachine',
				format: 'play',
				year: '1977',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				material: {
					name: 'Hamlet'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Rory Kinnear',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Patrick Malahide',
						roles: [
							{
								name: 'Claudius, King of Denmark',
								characterName: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Rosencrantz and Guildenstern Are Dead',
				startDate: '2011-06-16',
				pressDate: '2011-06-21',
				endDate: '2011-08-20',
				material: {
					name: 'Rosencrantz and Guildenstern Are Dead'
				},
				venue: {
					name: 'Theatre Royal Haymarket'
				},
				cast: [
					{
						name: 'Jack Hawkins',
						roles: [
							{
								name: 'Prince Hamlet',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'James Simmons',
						roles: [
							{
								name: 'King Claudius',
								characterName: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fortinbras',
				startDate: '1991-06-18',
				pressDate: '1991-06-25',
				endDate: '1991-07-28',
				material: {
					name: 'Fortinbras'
				},
				venue: {
					name: 'La Jolla Playhouse'
				},
				cast: [
					{
						name: 'Don Reilly',
						roles: [
							{
								name: 'Spirit of Hamlet',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Jonathan Freeman',
						roles: [
							{
								name: 'Spirit of Claudius',
								characterName: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamletmachine',
				startDate: '2017-07-07',
				endDate: '2017-07-28',
				material: {
					name: 'Hamletmachine'
				},
				venue: {
					name: 'Teatro San Nicolò'
				},
				cast: [
					{
						name: 'Gabriele Cicirello',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Renato Civello',
						roles: [
							{
								name: 'Claudius, King of Denmark',
								characterName: 'Claudius'
							}
						]
					}
				]
			});

		hamletCharacter = await chai.request(app)
			.get(`/characters/${HAMLET_CHARACTER_UUID}`);

		hamletNationalProduction = await chai.request(app)
			.get(`/productions/${HAMLET_NATIONAL_PRODUCTION_UUID}`);

		rosencrantzAndGuildensternAreDeadHaymarketProduction = await chai.request(app)
			.get(`/productions/${ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_HAYMARKET_PRODUCTION_UUID}`);

		fortinbrasLaJollaProduction = await chai.request(app)
			.get(`/productions/${FORTINBRAS_LA_JOLLA_PRODUCTION_UUID}`);

		hamletmachineTetroSanNicolòProduction = await chai.request(app)
			.get(`/productions/${HAMLETMACHINE_TEATRO_SAN_NICOLÒ_PRODUCTION_UUID}`);

		roryKinnearPerson = await chai.request(app)
			.get(`/people/${RORY_KINNEAR_PERSON_UUID}`);

		jackHawkinsPerson = await chai.request(app)
			.get(`/people/${JACK_HAWKINS_PERSON_UUID}`);

		donReillyPerson = await chai.request(app)
			.get(`/people/${DON_REILLY_PERSON_UUID}`);

		gabrieleCicirelloPerson = await chai.request(app)
			.get(`/people/${GABRIELE_CICIRELLO_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Hamlet (character)', () => {

		it('includes materials in which character is depicted', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: FORTINBRAS_MATERIAL_UUID,
					name: 'Fortinbras',
					format: 'play',
					year: 1991,
					surMaterial: null,
					writingCredits: [],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: HAMLETMACHINE_MATERIAL_UUID,
					name: 'Hamletmachine',
					format: 'play',
					year: 1977,
					surMaterial: null,
					writingCredits: [],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_MATERIAL_UUID,
					name: 'Rosencrantz and Guildenstern Are Dead',
					format: 'play',
					year: 1966,
					surMaterial: null,
					writingCredits: [],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: HAMLET_MATERIAL_UUID,
					name: 'Hamlet',
					format: 'play',
					year: 1601,
					surMaterial: null,
					writingCredits: [],
					depictions: []
				}
			];

			const { materials } = hamletCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes distinct variant-named portrayals (i.e. portrayals in productions with names different to that in material)', () => {

			const expectedVariantNamedPortrayals = [
				'Hamlet, Prince of Denmark',
				'Prince Hamlet',
				'Spirit of Hamlet'
			];

			const { variantNamedPortrayals } = hamletCharacter.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HAMLETMACHINE_TEATRO_SAN_NICOLÒ_PRODUCTION_UUID,
					name: 'Hamletmachine',
					startDate: '2017-07-07',
					endDate: '2017-07-28',
					venue: {
						model: 'VENUE',
						uuid: TEATRO_SAN_NICOLÒ_VENUE_UUID,
						name: 'Teatro San Nicolò',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: GABRIELE_CICIRELLO_PERSON_UUID,
							name: 'Gabriele Cicirello',
							roleName: 'Hamlet, Prince of Denmark',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_HAYMARKET_PRODUCTION_UUID,
					name: 'Rosencrantz and Guildenstern Are Dead',
					startDate: '2011-06-16',
					endDate: '2011-08-20',
					venue: {
						model: 'VENUE',
						uuid: THEATRE_ROYAL_HAYMARKET_VENUE_UUID,
						name: 'Theatre Royal Haymarket',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: JACK_HAWKINS_PERSON_UUID,
							name: 'Jack Hawkins',
							roleName: 'Prince Hamlet',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAMLET_NATIONAL_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: RORY_KINNEAR_PERSON_UUID,
							name: 'Rory Kinnear',
							roleName: 'Hamlet, Prince of Denmark',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: FORTINBRAS_LA_JOLLA_PRODUCTION_UUID,
					name: 'Fortinbras',
					startDate: '1991-06-18',
					endDate: '1991-07-28',
					venue: {
						model: 'VENUE',
						uuid: LA_JOLLA_PLAYHOUSE_VENUE_UUID,
						name: 'La Jolla Playhouse',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: DON_REILLY_PERSON_UUID,
							name: 'Don Reilly',
							roleName: 'Spirit of Hamlet',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = hamletCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Hamlet at National Theatre (production)', () => {

		it('includes cast with Rory Kinnear as Hamlet and Patrick Malahide as Claudius under variant names', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: RORY_KINNEAR_PERSON_UUID,
					name: 'Rory Kinnear',
					roles: [
						{
							model: 'CHARACTER',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: PATRICK_MALAHIDE_PERSON_UUID,
					name: 'Patrick Malahide',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Claudius, King of Denmark',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = hamletNationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Rosencrantz and Guildenstern Are Dead at Theatre Royal Haymarket (production)', () => {

		it('includes cast with Jack Hawkins as Hamlet and James Simmons as Claudius under variant names', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: JACK_HAWKINS_PERSON_UUID,
					name: 'Jack Hawkins',
					roles: [
						{
							model: 'CHARACTER',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Prince Hamlet',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: JAMES_SIMMONS_PERSON_UUID,
					name: 'James Simmons',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'King Claudius',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = rosencrantzAndGuildensternAreDeadHaymarketProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Fortinbras at La Jolla Playhouse (production)', () => {

		it('includes cast with Don Reilly as Hamlet and Jonathan Freeman as Claudius under variant names', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: DON_REILLY_PERSON_UUID,
					name: 'Don Reilly',
					roles: [
						{
							model: 'CHARACTER',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Spirit of Hamlet',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: JONATHAN_FREEMAN_PERSON_UUID,
					name: 'Jonathan Freeman',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Spirit of Claudius',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = fortinbrasLaJollaProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Hamletmachine at Teatro San Nicolò (production)', () => {

		it('includes cast with Gabriele Cicirello as Hamlet and Renato Civello as Claudius under variant names', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: GABRIELE_CICIRELLO_PERSON_UUID,
					name: 'Gabriele Cicirello',
					roles: [
						{
							model: 'CHARACTER',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: RENATO_CIVELLO_PERSON_UUID,
					name: 'Renato Civello',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Claudius, King of Denmark',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = hamletmachineTetroSanNicolòProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Rory Kinnear (person)', () => {

		it('includes production with their portrayal of Hamlet under a variant name (Hamlet, Prince of Denmark)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HAMLET_NATIONAL_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = roryKinnearPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Jack Hawkins (person)', () => {

		it('includes production with their portrayal of Hamlet under a variant name (Prince Hamlet)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_HAYMARKET_PRODUCTION_UUID,
					name: 'Rosencrantz and Guildenstern Are Dead',
					startDate: '2011-06-16',
					endDate: '2011-08-20',
					venue: {
						model: 'VENUE',
						uuid: THEATRE_ROYAL_HAYMARKET_VENUE_UUID,
						name: 'Theatre Royal Haymarket',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Prince Hamlet',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = jackHawkinsPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Don Reilly (person)', () => {

		it('includes production with their portrayal of Hamlet under a variant name (Spirit of Hamlet)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: FORTINBRAS_LA_JOLLA_PRODUCTION_UUID,
					name: 'Fortinbras',
					startDate: '1991-06-18',
					endDate: '1991-07-28',
					venue: {
						model: 'VENUE',
						uuid: LA_JOLLA_PLAYHOUSE_VENUE_UUID,
						name: 'La Jolla Playhouse',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Spirit of Hamlet',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = donReillyPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Gabriele Cicirello (person)', () => {

		it('includes production with their portrayal of Hamlet under a variant name (Hamlet, Prince of Denmark)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HAMLETMACHINE_TEATRO_SAN_NICOLÒ_PRODUCTION_UUID,
					name: 'Hamletmachine',
					startDate: '2017-07-07',
					endDate: '2017-07-28',
					venue: {
						model: 'VENUE',
						uuid: TEATRO_SAN_NICOLÒ_VENUE_UUID,
						name: 'Teatro San Nicolò',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = gabrieleCicirelloPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
