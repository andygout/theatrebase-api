import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const JOEYS_MOTHER_CHARACTER_UUID = 'JOEYS_MOTHER_CHARACTER_UUID';
const DR_SCHWEYK_CHARACTER_UUID = 'DR_SCHWEYK_CHARACTER_UUID';
const COCO_CHARACTER_UUID = 'COCO_CHARACTER_UUID';
const GEORDIE_CHARACTER_UUID = 'GEORDIE_CHARACTER_UUID';
const WAR_HORSE_NATIONAL_PRODUCTION_UUID = 'WAR_HORSE_PRODUCTION_UUID';
const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';
const STEPHEN_HARPER_PERSON_UUID = 'STEPHEN_HARPER_PERSON_UUID';

let joeysMotherCharacter;
let drSchweykCharacter;
let cocoCharacter;
let geordieCharacter;

const sandbox = createSandbox();

describe('Character portrayed with other roles', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'War Horse',
				characterGroups: [
					{
						characters: [
							{
								name: 'Major Nicholls'
							},
							{
								name: 'Joey\'s mother'
							},
							{
								name: 'Dr Schweyk'
							},
							{
								name: 'Coco'
							},
							{
								name: 'Geordie'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'War Horse',
				startDate: '2007-10-09',
				pressDate: '2007-10-17',
				endDate: '2008-02-14',
				material: {
					name: 'War Horse'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Jamie Ballard',
						roles: [
							{
								name: 'Major Nicholls'
							}
						]
					},
					{
						name: 'Stephen Harper',
						roles: [
							{
								name: 'Joey\'s mother'
							},
							{
								name: 'Dr Schweyk'
							},
							{
								name: 'Coco'
							},
							{
								name: 'Geordie'
							}
						]
					}
				]
			});

		joeysMotherCharacter = await chai.request(app)
			.get(`/characters/${JOEYS_MOTHER_CHARACTER_UUID}`);

		drSchweykCharacter = await chai.request(app)
			.get(`/characters/${DR_SCHWEYK_CHARACTER_UUID}`);

		cocoCharacter = await chai.request(app)
			.get(`/characters/${COCO_CHARACTER_UUID}`);

		geordieCharacter = await chai.request(app)
			.get(`/characters/${GEORDIE_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Joey\'s mother (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
					name: 'War Horse',
					startDate: '2007-10-09',
					endDate: '2008-02-14',
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
							uuid: STEPHEN_HARPER_PERSON_UUID,
							name: 'Stephen Harper',
							roleName: 'Joey\'s mother',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: DR_SCHWEYK_CHARACTER_UUID,
									name: 'Dr Schweyk',
									qualifier: null,
									isAlternate: false
								},
								{
									model: 'CHARACTER',
									uuid: COCO_CHARACTER_UUID,
									name: 'Coco',
									qualifier: null,
									isAlternate: false
								},
								{
									model: 'CHARACTER',
									uuid: GEORDIE_CHARACTER_UUID,
									name: 'Geordie',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = joeysMotherCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Dr Schweyk (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
					name: 'War Horse',
					startDate: '2007-10-09',
					endDate: '2008-02-14',
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
							uuid: STEPHEN_HARPER_PERSON_UUID,
							name: 'Stephen Harper',
							roleName: 'Dr Schweyk',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: JOEYS_MOTHER_CHARACTER_UUID,
									name: 'Joey\'s mother',
									qualifier: null,
									isAlternate: false
								},
								{
									model: 'CHARACTER',
									uuid: COCO_CHARACTER_UUID,
									name: 'Coco',
									qualifier: null,
									isAlternate: false
								},
								{
									model: 'CHARACTER',
									uuid: GEORDIE_CHARACTER_UUID,
									name: 'Geordie',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = drSchweykCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Coco (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
					name: 'War Horse',
					startDate: '2007-10-09',
					endDate: '2008-02-14',
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
							uuid: STEPHEN_HARPER_PERSON_UUID,
							name: 'Stephen Harper',
							roleName: 'Coco',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: JOEYS_MOTHER_CHARACTER_UUID,
									name: 'Joey\'s mother',
									qualifier: null,
									isAlternate: false
								},
								{
									model: 'CHARACTER',
									uuid: DR_SCHWEYK_CHARACTER_UUID,
									name: 'Dr Schweyk',
									qualifier: null,
									isAlternate: false
								},
								{
									model: 'CHARACTER',
									uuid: GEORDIE_CHARACTER_UUID,
									name: 'Geordie',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = cocoCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Geordie (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
					name: 'War Horse',
					startDate: '2007-10-09',
					endDate: '2008-02-14',
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
							uuid: STEPHEN_HARPER_PERSON_UUID,
							name: 'Stephen Harper',
							roleName: 'Geordie',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: JOEYS_MOTHER_CHARACTER_UUID,
									name: 'Joey\'s mother',
									qualifier: null,
									isAlternate: false
								},
								{
									model: 'CHARACTER',
									uuid: DR_SCHWEYK_CHARACTER_UUID,
									name: 'Dr Schweyk',
									qualifier: null,
									isAlternate: false
								},
								{
									model: 'CHARACTER',
									uuid: COCO_CHARACTER_UUID,
									name: 'Coco',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = geordieCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

});
