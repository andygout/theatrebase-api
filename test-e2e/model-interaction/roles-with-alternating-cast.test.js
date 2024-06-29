import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const AUSTIN_CHARACTER_UUID = 'AUSTIN_CHARACTER_UUID';
const LEE_CHARACTER_UUID = 'LEE_CHARACTER_UUID';
const TRUE_WEST_CRUCIBLE_PRODUCTION_UUID = 'TRUE_WEST_PRODUCTION_UUID';
const CRUCIBLE_THEATRE_VENUE_UUID = 'CRUCIBLE_THEATRE_VENUE_UUID';
const NIGEL_HARMAN_PERSON_UUID = 'NIGEL_HARMAN_PERSON_UUID';
const JOHN_LIGHT_PERSON_UUID = 'JOHN_LIGHT_PERSON_UUID';
const TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID = 'TRUE_WEST_2_PRODUCTION_UUID';
const VAUDEVILLE_THEATRE_VENUE_UUID = 'VAUDEVILLE_THEATRE_VENUE_UUID';
const KIT_HARINGTON_PERSON_UUID = 'KIT_HARINGTON_PERSON_UUID';
const JOHNNY_FLYNN_PERSON_UUID = 'JOHNNY_FLYNN_PERSON_UUID';

let austinCharacter;
let leeCharacter;
let trueWestCrucibleProduction;
let trueWestVaudevilleProduction;
let nigelHarmanPerson;
let johnLightPerson;
let kitHaringtonPerson;
let johnnyFlynnPerson;

const sandbox = createSandbox();

describe('Roles with alternating cast', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'True West',
				characterGroups: [
					{
						characters: [
							{
								name: 'Austin'
							},
							{
								name: 'Lee'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'True West',
				startDate: '2010-05-13',
				pressDate: '2010-05-18',
				endDate: '2010-06-05',
				material: {
					name: 'True West'
				},
				venue: {
					name: 'Crucible Theatre'
				},
				cast: [
					{
						name: 'Nigel Harman',
						roles: [
							{
								name: 'Austin',
								isAlternate: true
							},
							{
								name: 'Lee',
								isAlternate: true
							}
						]
					},
					{
						name: 'John Light',
						roles: [
							{
								name: 'Lee',
								isAlternate: true
							},
							{
								name: 'Austin',
								isAlternate: true
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'True West',
				startDate: '2018-11-23',
				pressDate: '2018-12-04',
				endDate: '2019-02-23',
				material: {
					name: 'True West'
				},
				venue: {
					name: 'Vaudeville Theatre'
				},
				cast: [
					{
						name: 'Kit Harington',
						roles: [
							{
								name: 'Austin',
								isAlternate: true
							},
							{
								name: 'Lee',
								isAlternate: true
							}
						]
					},
					{
						name: 'Johnny Flynn',
						roles: [
							{
								name: 'Lee',
								isAlternate: true
							},
							{
								name: 'Austin',
								isAlternate: true
							}
						]
					}
				]
			});

		austinCharacter = await chai.request(app)
			.get(`/characters/${AUSTIN_CHARACTER_UUID}`);

		leeCharacter = await chai.request(app)
			.get(`/characters/${LEE_CHARACTER_UUID}`);

		trueWestCrucibleProduction = await chai.request(app)
			.get(`/productions/${TRUE_WEST_CRUCIBLE_PRODUCTION_UUID}`);

		trueWestVaudevilleProduction = await chai.request(app)
			.get(`/productions/${TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID}`);

		nigelHarmanPerson = await chai.request(app)
			.get(`/people/${NIGEL_HARMAN_PERSON_UUID}`);

		johnLightPerson = await chai.request(app)
			.get(`/people/${JOHN_LIGHT_PERSON_UUID}`);

		kitHaringtonPerson = await chai.request(app)
			.get(`/people/${KIT_HARINGTON_PERSON_UUID}`);

		johnnyFlynnPerson = await chai.request(app)
			.get(`/people/${JOHNNY_FLYNN_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Austin (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID,
					name: 'True West',
					startDate: '2018-11-23',
					endDate: '2019-02-23',
					venue: {
						model: 'VENUE',
						uuid: VAUDEVILLE_THEATRE_VENUE_UUID,
						name: 'Vaudeville Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: KIT_HARINGTON_PERSON_UUID,
							name: 'Kit Harington',
							roleName: 'Austin',
							qualifier: null,
							isAlternate: true,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: LEE_CHARACTER_UUID,
									name: 'Lee',
									qualifier: null,
									isAlternate: true
								}
							]
						},
						{
							model: 'PERSON',
							uuid: JOHNNY_FLYNN_PERSON_UUID,
							name: 'Johnny Flynn',
							roleName: 'Austin',
							qualifier: null,
							isAlternate: true,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: LEE_CHARACTER_UUID,
									name: 'Lee',
									qualifier: null,
									isAlternate: true
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: TRUE_WEST_CRUCIBLE_PRODUCTION_UUID,
					name: 'True West',
					startDate: '2010-05-13',
					endDate: '2010-06-05',
					venue: {
						model: 'VENUE',
						uuid: CRUCIBLE_THEATRE_VENUE_UUID,
						name: 'Crucible Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: NIGEL_HARMAN_PERSON_UUID,
							name: 'Nigel Harman',
							roleName: 'Austin',
							qualifier: null,
							isAlternate: true,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: LEE_CHARACTER_UUID,
									name: 'Lee',
									qualifier: null,
									isAlternate: true
								}
							]
						},
						{
							model: 'PERSON',
							uuid: JOHN_LIGHT_PERSON_UUID,
							name: 'John Light',
							roleName: 'Austin',
							qualifier: null,
							isAlternate: true,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: LEE_CHARACTER_UUID,
									name: 'Lee',
									qualifier: null,
									isAlternate: true
								}
							]
						}
					]
				}
			];

			const { productions } = austinCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Lee (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID,
					name: 'True West',
					startDate: '2018-11-23',
					endDate: '2019-02-23',
					venue: {
						model: 'VENUE',
						uuid: VAUDEVILLE_THEATRE_VENUE_UUID,
						name: 'Vaudeville Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: KIT_HARINGTON_PERSON_UUID,
							name: 'Kit Harington',
							roleName: 'Lee',
							qualifier: null,
							isAlternate: true,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: AUSTIN_CHARACTER_UUID,
									name: 'Austin',
									qualifier: null,
									isAlternate: true
								}
							]
						},
						{
							model: 'PERSON',
							uuid: JOHNNY_FLYNN_PERSON_UUID,
							name: 'Johnny Flynn',
							roleName: 'Lee',
							qualifier: null,
							isAlternate: true,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: AUSTIN_CHARACTER_UUID,
									name: 'Austin',
									qualifier: null,
									isAlternate: true
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: TRUE_WEST_CRUCIBLE_PRODUCTION_UUID,
					name: 'True West',
					startDate: '2010-05-13',
					endDate: '2010-06-05',
					venue: {
						model: 'VENUE',
						uuid: CRUCIBLE_THEATRE_VENUE_UUID,
						name: 'Crucible Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: NIGEL_HARMAN_PERSON_UUID,
							name: 'Nigel Harman',
							roleName: 'Lee',
							qualifier: null,
							isAlternate: true,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: AUSTIN_CHARACTER_UUID,
									name: 'Austin',
									qualifier: null,
									isAlternate: true
								}
							]
						},
						{
							model: 'PERSON',
							uuid: JOHN_LIGHT_PERSON_UUID,
							name: 'John Light',
							roleName: 'Lee',
							qualifier: null,
							isAlternate: true,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: AUSTIN_CHARACTER_UUID,
									name: 'Austin',
									qualifier: null,
									isAlternate: true
								}
							]
						}
					]
				}
			];

			const { productions } = leeCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('True West at Crucible Theatre (production)', () => {

		it('includes cast with Nigel Harman as Austin and Lee, and John Light as Lee and Austin', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: NIGEL_HARMAN_PERSON_UUID,
					name: 'Nigel Harman',
					roles: [
						{
							model: 'CHARACTER',
							uuid: AUSTIN_CHARACTER_UUID,
							name: 'Austin',
							qualifier: null,
							isAlternate: true
						},
						{
							model: 'CHARACTER',
							uuid: LEE_CHARACTER_UUID,
							name: 'Lee',
							qualifier: null,
							isAlternate: true
						}
					]
				},
				{
					model: 'PERSON',
					uuid: JOHN_LIGHT_PERSON_UUID,
					name: 'John Light',
					roles: [
						{
							model: 'CHARACTER',
							uuid: LEE_CHARACTER_UUID,
							name: 'Lee',
							qualifier: null,
							isAlternate: true
						},
						{
							model: 'CHARACTER',
							uuid: AUSTIN_CHARACTER_UUID,
							name: 'Austin',
							qualifier: null,
							isAlternate: true
						}
					]
				}
			];

			const { cast } = trueWestCrucibleProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('True West at Vaudeville Theatre (production)', () => {

		it('includes cast with Kit Harington as Austin and Lee, and Johnny Flynn as Lee and Austin', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: KIT_HARINGTON_PERSON_UUID,
					name: 'Kit Harington',
					roles: [
						{
							model: 'CHARACTER',
							uuid: AUSTIN_CHARACTER_UUID,
							name: 'Austin',
							qualifier: null,
							isAlternate: true
						},
						{
							model: 'CHARACTER',
							uuid: LEE_CHARACTER_UUID,
							name: 'Lee',
							qualifier: null,
							isAlternate: true
						}
					]
				},
				{
					model: 'PERSON',
					uuid: JOHNNY_FLYNN_PERSON_UUID,
					name: 'Johnny Flynn',
					roles: [
						{
							model: 'CHARACTER',
							uuid: LEE_CHARACTER_UUID,
							name: 'Lee',
							qualifier: null,
							isAlternate: true
						},
						{
							model: 'CHARACTER',
							uuid: AUSTIN_CHARACTER_UUID,
							name: 'Austin',
							qualifier: null,
							isAlternate: true
						}
					]
				}
			];

			const { cast } = trueWestVaudevilleProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Nigel Harman (person)', () => {

		it('includes production with his portrayals of Austin and Lee', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: TRUE_WEST_CRUCIBLE_PRODUCTION_UUID,
					name: 'True West',
					startDate: '2010-05-13',
					endDate: '2010-06-05',
					venue: {
						model: 'VENUE',
						uuid: CRUCIBLE_THEATRE_VENUE_UUID,
						name: 'Crucible Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: AUSTIN_CHARACTER_UUID,
							name: 'Austin',
							qualifier: null,
							isAlternate: true
						},
						{
							model: 'CHARACTER',
							uuid: LEE_CHARACTER_UUID,
							name: 'Lee',
							qualifier: null,
							isAlternate: true
						}
					]
				}
			];

			const { castMemberProductions } = nigelHarmanPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('John Light (person)', () => {

		it('includes production with his portrayals of Lee and Austin', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: TRUE_WEST_CRUCIBLE_PRODUCTION_UUID,
					name: 'True West',
					startDate: '2010-05-13',
					endDate: '2010-06-05',
					venue: {
						model: 'VENUE',
						uuid: CRUCIBLE_THEATRE_VENUE_UUID,
						name: 'Crucible Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: LEE_CHARACTER_UUID,
							name: 'Lee',
							qualifier: null,
							isAlternate: true
						},
						{
							model: 'CHARACTER',
							uuid: AUSTIN_CHARACTER_UUID,
							name: 'Austin',
							qualifier: null,
							isAlternate: true
						}
					]
				}
			];

			const { castMemberProductions } = johnLightPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Kit Harington (person)', () => {

		it('includes production with his portrayals of Austin and Lee', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID,
					name: 'True West',
					startDate: '2018-11-23',
					endDate: '2019-02-23',
					venue: {
						model: 'VENUE',
						uuid: VAUDEVILLE_THEATRE_VENUE_UUID,
						name: 'Vaudeville Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: AUSTIN_CHARACTER_UUID,
							name: 'Austin',
							qualifier: null,
							isAlternate: true
						},
						{
							model: 'CHARACTER',
							uuid: LEE_CHARACTER_UUID,
							name: 'Lee',
							qualifier: null,
							isAlternate: true
						}
					]
				}
			];

			const { castMemberProductions } = kitHaringtonPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Johnny Flynn (person)', () => {

		it('includes production with his portrayals of Lee and Austin', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: TRUE_WEST_VAUDEVILLE_PRODUCTION_UUID,
					name: 'True West',
					startDate: '2018-11-23',
					endDate: '2019-02-23',
					venue: {
						model: 'VENUE',
						uuid: VAUDEVILLE_THEATRE_VENUE_UUID,
						name: 'Vaudeville Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: LEE_CHARACTER_UUID,
							name: 'Lee',
							qualifier: null,
							isAlternate: true
						},
						{
							model: 'CHARACTER',
							uuid: AUSTIN_CHARACTER_UUID,
							name: 'Austin',
							qualifier: null,
							isAlternate: true
						}
					]
				}
			];

			const { castMemberProductions } = johnnyFlynnPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
