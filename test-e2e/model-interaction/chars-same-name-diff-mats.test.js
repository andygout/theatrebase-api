import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID = 'A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID';
const LYSANDER_CHARACTER_UUID = 'LYSANDER_CHARACTER_UUID';
const DEMETRIUS_CHARACTER_1_UUID = 'DEMETRIUS_1_CHARACTER_UUID';
const TITUS_ANDRONICUS_MATERIAL_UUID = 'TITUS_ANDRONICUS_MATERIAL_UUID';
const DEMETRIUS_CHARACTER_2_UUID = 'DEMETRIUS_2_CHARACTER_UUID';
const CHIRON_CHARACTER_UUID = 'CHIRON_CHARACTER_UUID';
const A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID = 'A_MIDSUMMER_NIGHTS_DREAM_PRODUCTION_UUID';
const NOVELLO_THEATRE_VENUE_UUID = 'NOVELLO_THEATRE_VENUE_UUID';
const OSCAR_PEARCE_PERSON_UUID = 'OSCAR_PEARCE_PERSON_UUID';
const TRYSTAN_GRAVELLE_PERSON_UUID = 'TRYSTAN_GRAVELLE_PERSON_UUID';
const TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID = 'TITUS_ANDRONICUS_PRODUCTION_UUID';
const SHAKESPEARES_GLOBE_VENUE_UUID = 'SHAKESPEARES_GLOBE_VENUE_UUID';
const RICHARD_RIDDELL_PERSON_UUID = 'RICHARD_RIDDELL_PERSON_UUID';
const SAM_ALEXANDER_PERSON_UUID = 'SAM_ALEXANDER_PERSON_UUID';

let demetriusCharacter1;
let demetriusCharacter2;
let aMidsummerNightsDreamMaterial;
let titusAndronicusMaterial;
let aMidsummerNightsDreamNovelloProduction;
let titusAndronicusGlobeProduction;
let oscarPearcePerson;
let samAlexanderPerson;

const sandbox = createSandbox();

describe('Different characters with the same name from different materials', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'A Midsummer Night\'s Dream',
				characterGroups: [
					{
						characters: [
							{
								name: 'Lysander'
							},
							{
								name: 'Demetrius',
								differentiator: '1'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Titus Andronicus',
				characterGroups: [
					{
						characters: [
							{
								name: 'Demetrius',
								differentiator: '2'
							},
							{
								name: 'Chiron'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Midsummer Night\'s Dream',
				startDate: '2006-02-02',
				pressDate: '2006-02-07',
				endDate: '2006-02-25',
				material: {
					name: 'A Midsummer Night\'s Dream'
				},
				venue: {
					name: 'Novello Theatre'
				},
				cast: [
					{
						name: 'Oscar Pearce',
						roles: [
							{
								name: 'Demetrius'
							}
						]
					},
					{
						name: 'Trystan Gravelle',
						roles: [
							{
								name: 'Lysander'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Titus Andronicus',
				startDate: '2006-05-20',
				pressDate: '2006-05-30',
				endDate: '2006-10-06',
				material: {
					name: 'Titus Andronicus'
				},
				venue: {
					name: 'Shakespeare\'s Globe'
				},
				cast: [
					{
						name: 'Richard Riddell',
						roles: [
							{
								name: 'Chiron'
							}
						]
					},
					{
						name: 'Sam Alexander',
						roles: [
							{
								name: 'Demetrius'
							}
						]
					}
				]
			});

		demetriusCharacter1 = await chai.request(app)
			.get(`/characters/${DEMETRIUS_CHARACTER_1_UUID}`);

		demetriusCharacter2 = await chai.request(app)
			.get(`/characters/${DEMETRIUS_CHARACTER_2_UUID}`);

		aMidsummerNightsDreamMaterial = await chai.request(app)
			.get(`/materials/${A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID}`);

		titusAndronicusMaterial = await chai.request(app)
			.get(`/materials/${TITUS_ANDRONICUS_MATERIAL_UUID}`);

		aMidsummerNightsDreamNovelloProduction = await chai.request(app)
			.get(`/productions/${A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID}`);

		titusAndronicusGlobeProduction = await chai.request(app)
			.get(`/productions/${TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID}`);

		oscarPearcePerson = await chai.request(app)
			.get(`/people/${OSCAR_PEARCE_PERSON_UUID}`);

		samAlexanderPerson = await chai.request(app)
			.get(`/people/${SAM_ALEXANDER_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Demetrius (character) (#1)', () => {

		it('includes productions in which character was portrayed (i.e. excludes productions of different character with same name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					startDate: '2006-02-02',
					endDate: '2006-02-25',
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
							uuid: OSCAR_PEARCE_PERSON_UUID,
							name: 'Oscar Pearce',
							roleName: 'Demetrius',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = demetriusCharacter1.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Demetrius (character) (#2)', () => {

		it('includes productions in which character was portrayed (i.e. excludes productions of different character with same name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID,
					name: 'Titus Andronicus',
					startDate: '2006-05-20',
					endDate: '2006-10-06',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: SAM_ALEXANDER_PERSON_UUID,
							name: 'Sam Alexander',
							roleName: 'Demetrius',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = demetriusCharacter2.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('A Midsummer Night\'s Dream (material)', () => {

		it('includes Demetrius (#1) in its characters (i.e. and not Demetrius (#2))', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: LYSANDER_CHARACTER_UUID,
					name: 'Lysander',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: DEMETRIUS_CHARACTER_1_UUID,
					name: 'Demetrius',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = aMidsummerNightsDreamMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Titus Andronicus (material)', () => {

		it('includes Demetrius (#2) in its characters (i.e. and not Demetrius (#1))', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: DEMETRIUS_CHARACTER_2_UUID,
					name: 'Demetrius',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: CHIRON_CHARACTER_UUID,
					name: 'Chiron',
					qualifier: null
				}

			];

			const { characterGroups: [{ characters }] } = titusAndronicusMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('A Midsummer Night\'s Dream at Novello Theatre (production)', () => {

		it('includes cast with Oscar Pearce as Demetrius (#1)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: OSCAR_PEARCE_PERSON_UUID,
					name: 'Oscar Pearce',
					roles: [
						{
							model: 'CHARACTER',
							uuid: DEMETRIUS_CHARACTER_1_UUID,
							name: 'Demetrius',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: TRYSTAN_GRAVELLE_PERSON_UUID,
					name: 'Trystan Gravelle',
					roles: [
						{
							model: 'CHARACTER',
							uuid: LYSANDER_CHARACTER_UUID,
							name: 'Lysander',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = aMidsummerNightsDreamNovelloProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Titus Andronicus at Shakespeare\'s Globe (production)', () => {

		it('includes cast with Sam Alexander as Demetrius (#2)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: RICHARD_RIDDELL_PERSON_UUID,
					name: 'Richard Riddell',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CHIRON_CHARACTER_UUID,
							name: 'Chiron',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: SAM_ALEXANDER_PERSON_UUID,
					name: 'Sam Alexander',
					roles: [
						{
							model: 'CHARACTER',
							uuid: DEMETRIUS_CHARACTER_2_UUID,
							name: 'Demetrius',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = titusAndronicusGlobeProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Oscar Pearce (person)', () => {

		it('includes in their production credits their portrayal of Demetrius (#1) (i.e. and not Demetrius (#2))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					startDate: '2006-02-02',
					endDate: '2006-02-25',
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
							uuid: DEMETRIUS_CHARACTER_1_UUID,
							name: 'Demetrius',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = oscarPearcePerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Sam Alexander (person)', () => {

		it('includes in their production credits their portrayal of Demetrius (#2) (i.e. and not Demetrius (#1))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID,
					name: 'Titus Andronicus',
					startDate: '2006-05-20',
					endDate: '2006-10-06',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: DEMETRIUS_CHARACTER_2_UUID,
							name: 'Demetrius',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = samAlexanderPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
