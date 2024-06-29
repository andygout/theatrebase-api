import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const HAMLET_CHARACTER_UUID = 'HAMLET_CHARACTER_UUID';
const CLAUDIUS_CHARACTER_UUID = 'CLAUDIUS_CHARACTER_UUID';
const GHOST_CHARACTER_UUID = 'GHOST_CHARACTER_UUID';
const FIRST_PLAYER_CHARACTER_UUID = 'FIRST_PLAYER_CHARACTER_UUID';
const HAMLET_ALMEIDA_PRODUCTION_UUID = 'HAMLET_PRODUCTION_UUID';
const ALMEIDA_THEATRE_VENUE_UUID = 'ALMEIDA_THEATRE_VENUE_UUID';
const ANDREW_SCOTT_PERSON_UUID = 'ANDREW_SCOTT_PERSON_UUID';
const DAVID_RINTOUL_PERSON_UUID = 'DAVID_RINTOUL_PERSON_UUID';
const HAMLET_NOVELLO_PRODUCTION_UUID = 'HAMLET_2_PRODUCTION_UUID';
const NOVELLO_THEATRE_VENUE_UUID = 'NOVELLO_THEATRE_VENUE_UUID';
const DAVID_TENNANT_PERSON_UUID = 'DAVID_TENNANT_PERSON_UUID';
const PATRICK_STEWART_PERSON_UUID = 'PATRICK_STEWART_PERSON_UUID';
const HAMLET_WYNDHAMS_PRODUCTION_UUID = 'HAMLET_3_PRODUCTION_UUID';
const WYNDHAMS_THEATRE_VENUE_UUID = 'WYNDHAMS_THEATRE_VENUE_UUID';
const JUDE_LAW_PERSON_UUID = 'JUDE_LAW_PERSON_UUID';
const PETER_EYRE_PERSON_UUID = 'PETER_EYRE_PERSON_UUID';

let ghostCharacter;
let hamletAlmeidaProduction;
let hamletNovelloProduction;
let hamletWyndhamsProduction;
let davidRintoulPerson;
let patrickStewartPerson;
let peterEyrePerson;

const sandbox = createSandbox();

describe('Character with variant names from productions of the same material', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hamlet',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							},
							{
								name: 'Ghost'
							},
							{
								name: 'First Player'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				startDate: '2017-06-09',
				pressDate: '2017-06-15',
				endDate: '2017-09-02',
				material: {
					name: 'Hamlet'
				},
				venue: {
					name: 'Almeida Theatre'
				},
				cast: [
					{
						name: 'Andrew Scott',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'David Rintoul',
						roles: [
							{
								name: 'Ghost of King Hamlet',
								characterName: 'Ghost'
							},
							{
								name: 'Player King',
								characterName: 'First Player'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				startDate: '2008-12-03',
				pressDate: '2008-12-09',
				endDate: '2009-01-10',
				material: {
					name: 'Hamlet'
				},
				venue: {
					name: 'Novello Theatre'
				},
				cast: [
					{
						name: 'David Tennant',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Patrick Stewart',
						roles: [
							{
								name: 'Claudius, King of Denmark',
								characterName: 'Claudius'
							},
							{
								name: 'Ghost'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				startDate: '2009-05-29',
				pressDate: '2009-06-03',
				endDate: '2009-08-22',
				material: {
					name: 'Hamlet'
				},
				venue: {
					name: 'Wyndham\'s Theatre'
				},
				cast: [
					{
						name: 'Jude Law',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Peter Eyre',
						roles: [
							{
								name: 'King Hamlet',
								characterName: 'Ghost'
							},
							{
								name: 'First Player'
							}
						]
					}
				]
			});

		ghostCharacter = await chai.request(app)
			.get(`/characters/${GHOST_CHARACTER_UUID}`);

		hamletAlmeidaProduction = await chai.request(app)
			.get(`/productions/${HAMLET_ALMEIDA_PRODUCTION_UUID}`);

		hamletNovelloProduction = await chai.request(app)
			.get(`/productions/${HAMLET_NOVELLO_PRODUCTION_UUID}`);

		hamletWyndhamsProduction = await chai.request(app)
			.get(`/productions/${HAMLET_WYNDHAMS_PRODUCTION_UUID}`);

		davidRintoulPerson = await chai.request(app)
			.get(`/people/${DAVID_RINTOUL_PERSON_UUID}`);

		patrickStewartPerson = await chai.request(app)
			.get(`/people/${PATRICK_STEWART_PERSON_UUID}`);

		peterEyrePerson = await chai.request(app)
			.get(`/people/${PETER_EYRE_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Ghost (character)', () => {

		it('includes variant-named portrayals (i.e. portrayals in productions with names different to that in material)', () => {

			const expectedVariantNamedPortrayals = [
				'Ghost of King Hamlet',
				'King Hamlet'
			];

			const { variantNamedPortrayals } = ghostCharacter.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2017-06-09',
					endDate: '2017-09-02',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: DAVID_RINTOUL_PERSON_UUID,
							name: 'David Rintoul',
							roleName: 'Ghost of King Hamlet',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: FIRST_PLAYER_CHARACTER_UUID,
									name: 'Player King',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAMLET_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2009-05-29',
					endDate: '2009-08-22',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: PETER_EYRE_PERSON_UUID,
							name: 'Peter Eyre',
							roleName: 'King Hamlet',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: FIRST_PLAYER_CHARACTER_UUID,
									name: 'First Player',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAMLET_NOVELLO_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2008-12-03',
					endDate: '2009-01-10',
					venue: {
						model: 'VENUE',
						uuid: NOVELLO_THEATRE_VENUE_UUID,
						name: 'Novello Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: PATRICK_STEWART_PERSON_UUID,
							name: 'Patrick Stewart',
							roleName: 'Ghost',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: CLAUDIUS_CHARACTER_UUID,
									name: 'Claudius, King of Denmark',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = ghostCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Hamlet at Almeida Theatre (production)', () => {

		it('includes cast with David Rintoul as Ghost of King Hamlet under a variant name (Ghost)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: ANDREW_SCOTT_PERSON_UUID,
					name: 'Andrew Scott',
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
					uuid: DAVID_RINTOUL_PERSON_UUID,
					name: 'David Rintoul',
					roles: [
						{
							model: 'CHARACTER',
							uuid: GHOST_CHARACTER_UUID,
							name: 'Ghost of King Hamlet',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: FIRST_PLAYER_CHARACTER_UUID,
							name: 'Player King',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = hamletAlmeidaProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Hamlet at Novello Theatre (production)', () => {

		it('includes cast with Patrick Stewart as Ghost of King Hamlet under same name as in material (Ghost of King Hamlet)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: DAVID_TENNANT_PERSON_UUID,
					name: 'David Tennant',
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
					uuid: PATRICK_STEWART_PERSON_UUID,
					name: 'Patrick Stewart',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Claudius, King of Denmark',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: GHOST_CHARACTER_UUID,
							name: 'Ghost',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = hamletNovelloProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Hamlet at Wyndham\'s Theatre (production)', () => {

		it('includes cast with Peter Eyre as Ghost of King Hamlet under a variant name (King Hamlet)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: JUDE_LAW_PERSON_UUID,
					name: 'Jude Law',
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
					uuid: PETER_EYRE_PERSON_UUID,
					name: 'Peter Eyre',
					roles: [
						{
							model: 'CHARACTER',
							uuid: GHOST_CHARACTER_UUID,
							name: 'King Hamlet',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: FIRST_PLAYER_CHARACTER_UUID,
							name: 'First Player',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = hamletWyndhamsProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('David Rintoul (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under a variant name (Ghost)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2017-06-09',
					endDate: '2017-09-02',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: GHOST_CHARACTER_UUID,
							name: 'Ghost of King Hamlet',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: FIRST_PLAYER_CHARACTER_UUID,
							name: 'Player King',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = davidRintoulPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Patrick Stewart (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under same name as in material (Ghost of King Hamlet)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HAMLET_NOVELLO_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2008-12-03',
					endDate: '2009-01-10',
					venue: {
						model: 'VENUE',
						uuid: NOVELLO_THEATRE_VENUE_UUID,
						name: 'Novello Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Claudius, King of Denmark',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: GHOST_CHARACTER_UUID,
							name: 'Ghost',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = patrickStewartPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Peter Eyre (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under a variant name (King Hamlet)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HAMLET_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2009-05-29',
					endDate: '2009-08-22',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: GHOST_CHARACTER_UUID,
							name: 'King Hamlet',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: FIRST_PLAYER_CHARACTER_UUID,
							name: 'First Player',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = peterEyrePerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
