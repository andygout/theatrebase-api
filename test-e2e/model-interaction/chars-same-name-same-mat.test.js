import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const JULIUS_CAESAR_MATERIAL_UUID = 'JULIUS_CAESAR_MATERIAL_UUID';
const CINNA_CHARACTER_1_UUID = 'CINNA_1_CHARACTER_UUID';
const VOLUMNIUS_CHARACTER_UUID = 'VOLUMNIUS_CHARACTER_UUID';
const CINNA_CHARACTER_2_UUID = 'CINNA_2_CHARACTER_UUID';
const JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID = 'JULIUS_CAESAR_PRODUCTION_UUID';
const BARBICAN_THEATRE_VENUE_UUID = 'BARBICAN_THEATRE_VENUE_UUID';
const PAUL_SHEARER_PERSON_UUID = 'PAUL_SHEARER_PERSON_UUID';
const LEO_WRINGER_PERSON_UUID = 'LEO_WRINGER_PERSON_UUID';
const JULIUS_CAESAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'JULIUS_CAESAR_2_PRODUCTION_UUID';
const ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID = 'ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID';
const PAUL_BARNHILL_PERSON_UUID = 'PAUL_BARNHILL_PERSON_UUID';
const EDMUND_KINGSLEY_PERSON_UUID = 'EDMUND_KINGSLEY_PERSON_UUID';
const HENRY_VI_PART_2_MATERIAL_UUID = 'HENRY_VI_PART_2_MATERIAL_UUID';
const RICHARD_PLANTAGENET_DUKE_OF_YORK_CHARACTER_UUID = 'RICHARD_PLANTAGENET_DUKE_OF_YORK_CHARACTER_UUID';
const JACK_CADE_CHARACTER_UUID = 'JACK_CADE_CHARACTER_UUID';
const RICHARD_PLANTAGENET_CHARACTER_UUID = 'RICHARD_PLANTAGENET_CHARACTER_UUID';
const HENRY_VI_PART_2_COURTYARD_PRODUCTION_UUID = 'HENRY_VI_PART_2_PRODUCTION_UUID';
const COURTYARD_THEATRE_VENUE_UUID = 'COURTYARD_THEATRE_VENUE_UUID';
const CLIVE_WOOD_PERSON_UUID = 'CLIVE_WOOD_PERSON_UUID';
const JONATHAN_SLINGER_PERSON_UUID = 'JONATHAN_SLINGER_PERSON_UUID';

let cinnaCharacter1;
let cinnaCharacter2;
let volumniusCharacter;
let juliusCaesarMaterial;
let juliusCaesarBarbicanProduction;
let paulShearerPerson;
let leoWringerPerson;
let richardPlantagenetDukeOfYorkCharacter;
let richardPlantagenetCharacter;
let jackCadeCharacter;
let henryVIPart2Material;
let henryVIPart2CourtyardProduction;
let cliveWoodPerson;
let jonathanSlingerPerson;

const sandbox = createSandbox();

describe('Different characters with the same name from the same material', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Julius Caesar',
				characterGroups: [
					{
						characters: [
							{
								name: 'Cinna',
								differentiator: '1'
							},
							{
								name: 'Volumnius'
							},
							{
								name: 'Cinna',
								differentiator: '2'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Shakespeare\'s Romans',
				characterGroups: [
					{
						characters: [
							{
								name: 'Lucius Cinna',
								underlyingName: 'Cinna',
								differentiator: '1'
							},
							{
								name: 'Gaius Helvius Cinna',
								underlyingName: 'Cinna',
								differentiator: '2'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Julius Caesar',
				startDate: '2005-04-14',
				pressDate: '2005-04-20',
				endDate: '2005-05-14',
				material: {
					name: 'Julius Caesar'
				},
				venue: {
					name: 'Barbican Theatre'
				},
				cast: [
					{
						name: 'Paul Shearer',
						roles: [
							{
								name: 'Cinna',
								characterDifferentiator: '1'
							},
							{
								name: 'Volumnius'
							}
						]
					},
					{
						name: 'Leo Wringer',
						roles: [
							{
								name: 'Cinna',
								characterDifferentiator: '2'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Julius Caesar',
				startDate: '2006-05-06',
				pressDate: '2006-05-16',
				endDate: '2006-10-10',
				material: {
					name: 'Julius Caesar'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Paul Barnhill',
						roles: [
							{
								name: 'Lucius Cornelius Cinna',
								characterName: 'Cinna',
								characterDifferentiator: '1'
							}
						]
					},
					{
						name: 'Edmund Kingsley',
						roles: [
							{
								name: 'Cinna the poet',
								characterName: 'Cinna',
								characterDifferentiator: '2'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Henry VI, Part 2',
				characterGroups: [
					{
						characters: [
							{
								name: 'Richard Plantagenet, Duke of York',
								underlyingName: 'Richard Plantagenet, 3rd Duke of York'
							},
							{
								name: 'Jack Cade'
							},
							{
								name: 'Richard Plantagenet',
								underlyingName: 'King Richard III'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry VI, Part 2',
				startDate: '2006-07-14',
				pressDate: '2006-08-09',
				endDate: '2006-10-21',
				material: {
					name: 'Henry VI, Part 2'
				},
				venue: {
					name: 'Courtyard Theatre'
				},
				cast: [
					{
						name: 'Clive Wood',
						roles: [
							{
								name: 'Richard Plantagenet',
								characterName: 'Richard Plantagenet, Duke of York'
							},
							{
								name: 'Jack Cade'
							}
						]
					},
					{
						name: 'Jonathan Slinger',
						roles: [
							{
								name: 'Richard',
								characterName: 'Richard Plantagenet'
							}
						]
					}
				]
			});

		cinnaCharacter1 = await chai.request(app)
			.get(`/characters/${CINNA_CHARACTER_1_UUID}`);

		cinnaCharacter2 = await chai.request(app)
			.get(`/characters/${CINNA_CHARACTER_2_UUID}`);

		volumniusCharacter = await chai.request(app)
			.get(`/characters/${VOLUMNIUS_CHARACTER_UUID}`);

		juliusCaesarMaterial = await chai.request(app)
			.get(`/materials/${JULIUS_CAESAR_MATERIAL_UUID}`);

		juliusCaesarBarbicanProduction = await chai.request(app)
			.get(`/productions/${JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID}`);

		paulShearerPerson = await chai.request(app)
			.get(`/people/${PAUL_SHEARER_PERSON_UUID}`);

		leoWringerPerson = await chai.request(app)
			.get(`/people/${LEO_WRINGER_PERSON_UUID}`);

		richardPlantagenetDukeOfYorkCharacter = await chai.request(app)
			.get(`/characters/${RICHARD_PLANTAGENET_DUKE_OF_YORK_CHARACTER_UUID}`);

		richardPlantagenetCharacter = await chai.request(app)
			.get(`/characters/${RICHARD_PLANTAGENET_CHARACTER_UUID}`);

		jackCadeCharacter = await chai.request(app)
			.get(`/characters/${JACK_CADE_CHARACTER_UUID}`);

		henryVIPart2Material = await chai.request(app)
			.get(`/materials/${HENRY_VI_PART_2_MATERIAL_UUID}`);

		henryVIPart2CourtyardProduction = await chai.request(app)
			.get(`/productions/${HENRY_VI_PART_2_COURTYARD_PRODUCTION_UUID}`);

		cliveWoodPerson = await chai.request(app)
			.get(`/people/${CLIVE_WOOD_PERSON_UUID}`);

		jonathanSlingerPerson = await chai.request(app)
			.get(`/people/${JONATHAN_SLINGER_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Cinna (character) (#1)', () => {

		it('includes productions in which character was portrayed including performers who portrayed them (i.e. excludes portrayers of different character with same name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2006-05-06',
					endDate: '2006-10-10',
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
							uuid: PAUL_BARNHILL_PERSON_UUID,
							name: 'Paul Barnhill',
							roleName: 'Lucius Cornelius Cinna',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
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
							uuid: PAUL_SHEARER_PERSON_UUID,
							name: 'Paul Shearer',
							roleName: 'Cinna',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: VOLUMNIUS_CHARACTER_UUID,
									name: 'Volumnius',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = cinnaCharacter1.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

		it('includes distinct variant-named depictions (i.e. depictions in materials with names different to the underlying character name)', () => {

			const expectedVariantNamedDepictions = [
				'Lucius Cinna'
			];

			const { variantNamedDepictions } = cinnaCharacter1.body;

			expect(variantNamedDepictions).to.deep.equal(expectedVariantNamedDepictions);

		});

		it('includes distinct variant-named portrayals (i.e. portrayals in productions with names different to that in material)', () => {

			const expectedVariantNamedPortrayals = [
				'Lucius Cornelius Cinna'
			];

			const { variantNamedPortrayals } = cinnaCharacter1.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

	});

	describe('Cinna (character) (#2)', () => {

		it('includes productions in which character was portrayed including performers who portrayed them (i.e. excludes portrayers of different character with same name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2006-05-06',
					endDate: '2006-10-10',
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
							uuid: EDMUND_KINGSLEY_PERSON_UUID,
							name: 'Edmund Kingsley',
							roleName: 'Cinna the poet',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
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
							uuid: LEO_WRINGER_PERSON_UUID,
							name: 'Leo Wringer',
							roleName: 'Cinna',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = cinnaCharacter2.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

		it('includes distinct variant-named depictions (i.e. depictions in materials with names different to the underlying character name)', () => {

			const expectedVariantNamedDepictions = [
				'Gaius Helvius Cinna'
			];

			const { variantNamedDepictions } = cinnaCharacter2.body;

			expect(variantNamedDepictions).to.deep.equal(expectedVariantNamedDepictions);

		});

		it('includes distinct variant-named portrayals (i.e. portrayals in productions with names different to that in material)', () => {

			const expectedVariantNamedPortrayals = [
				'Cinna the poet'
			];

			const { variantNamedPortrayals } = cinnaCharacter2.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

	});

	describe('Volumnius (character)', () => {

		it('includes productions in which character was portrayed including in portrayer\'s other roles the correct duplicate-named character', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
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
							uuid: PAUL_SHEARER_PERSON_UUID,
							name: 'Paul Shearer',
							roleName: 'Volumnius',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: CINNA_CHARACTER_1_UUID,
									name: 'Cinna',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = volumniusCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Julius Caesar (material)', () => {

		it('includes Cinna (#1) and Cinna (#2) in its characters', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: CINNA_CHARACTER_1_UUID,
					name: 'Cinna',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: VOLUMNIUS_CHARACTER_UUID,
					name: 'Volumnius',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: CINNA_CHARACTER_2_UUID,
					name: 'Cinna',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = juliusCaesarMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Julius Caesar at Barbican (production)', () => {

		it('includes cast with Paul Shearer as Cinna (#1) and Leo Wringer as Cinna (#2)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: PAUL_SHEARER_PERSON_UUID,
					name: 'Paul Shearer',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CINNA_CHARACTER_1_UUID,
							name: 'Cinna',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: VOLUMNIUS_CHARACTER_UUID,
							name: 'Volumnius',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: LEO_WRINGER_PERSON_UUID,
					name: 'Leo Wringer',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CINNA_CHARACTER_2_UUID,
							name: 'Cinna',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = juliusCaesarBarbicanProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Paul Shearer (person)', () => {

		it('includes in their production credits their portrayal of Cinna (#1) (i.e. and not Cinna (#2))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
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
							uuid: CINNA_CHARACTER_1_UUID,
							name: 'Cinna',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: VOLUMNIUS_CHARACTER_UUID,
							name: 'Volumnius',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = paulShearerPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Leo Wringer (person)', () => {

		it('includes in their production credits their portrayal of Cinna (#2) (i.e. and not Cinna (#1))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
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
							uuid: CINNA_CHARACTER_2_UUID,
							name: 'Cinna',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = leoWringerPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Richard Plantagenet, Duke of York (i.e. 3rd Duke of York) (character)', () => {

		it('includes productions in which character was portrayed including performers who portrayed them (i.e. excludes portrayers of different character with matching portrayal role name but different portrayal characterName)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_VI_PART_2_COURTYARD_PRODUCTION_UUID,
					name: 'Henry VI, Part 2',
					startDate: '2006-07-14',
					endDate: '2006-10-21',
					venue: {
						model: 'VENUE',
						uuid: COURTYARD_THEATRE_VENUE_UUID,
						name: 'Courtyard Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: CLIVE_WOOD_PERSON_UUID,
							name: 'Clive Wood',
							roleName: 'Richard Plantagenet',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: JACK_CADE_CHARACTER_UUID,
									name: 'Jack Cade',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = richardPlantagenetDukeOfYorkCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Richard Plantagenet (i.e. later Duke of Gloucester and King Richard III) (character)', () => {

		it('includes productions in which character was portrayed including performers who portrayed them (i.e. excludes portrayers of different character with same name as portrayal role name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_VI_PART_2_COURTYARD_PRODUCTION_UUID,
					name: 'Henry VI, Part 2',
					startDate: '2006-07-14',
					endDate: '2006-10-21',
					venue: {
						model: 'VENUE',
						uuid: COURTYARD_THEATRE_VENUE_UUID,
						name: 'Courtyard Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: JONATHAN_SLINGER_PERSON_UUID,
							name: 'Jonathan Slinger',
							roleName: 'Richard',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = richardPlantagenetCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Jack Cade (character)', () => {

		it('includes productions in which character was portrayed including in portrayer\'s other roles the correct duplicate-named character', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_VI_PART_2_COURTYARD_PRODUCTION_UUID,
					name: 'Henry VI, Part 2',
					startDate: '2006-07-14',
					endDate: '2006-10-21',
					venue: {
						model: 'VENUE',
						uuid: COURTYARD_THEATRE_VENUE_UUID,
						name: 'Courtyard Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: CLIVE_WOOD_PERSON_UUID,
							name: 'Clive Wood',
							roleName: 'Jack Cade',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: RICHARD_PLANTAGENET_DUKE_OF_YORK_CHARACTER_UUID,
									name: 'Richard Plantagenet',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = jackCadeCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Henry VI, Part 2 (material)', () => {

		it('includes Richard Plantagenet, Duke of York (i.e. 3rd Duke of York) and Richard Plantagenet (i.e. later Duke of Gloucester and King Richard III) in its characters', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: RICHARD_PLANTAGENET_DUKE_OF_YORK_CHARACTER_UUID,
					name: 'Richard Plantagenet, Duke of York',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: JACK_CADE_CHARACTER_UUID,
					name: 'Jack Cade',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: RICHARD_PLANTAGENET_CHARACTER_UUID,
					name: 'Richard Plantagenet',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryVIPart2Material.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry VI, Part 2 at Courtyard Theatre (production)', () => {

		it('includes cast with Clive Wood as Richard Plantagenet, Duke of York (i.e. 3rd Duke of York) and Jonathan Slinger as Richard Plantagenet (i.e. later Duke of Gloucester and King Richard III)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: CLIVE_WOOD_PERSON_UUID,
					name: 'Clive Wood',
					roles: [
						{
							model: 'CHARACTER',
							uuid: RICHARD_PLANTAGENET_DUKE_OF_YORK_CHARACTER_UUID,
							name: 'Richard Plantagenet',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: JACK_CADE_CHARACTER_UUID,
							name: 'Jack Cade',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: JONATHAN_SLINGER_PERSON_UUID,
					name: 'Jonathan Slinger',
					roles: [
						{
							model: 'CHARACTER',
							uuid: RICHARD_PLANTAGENET_CHARACTER_UUID,
							name: 'Richard',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = henryVIPart2CourtyardProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Clive Wood (person)', () => {

		it('includes in their production credits their portrayal of Richard Plantagenet, Duke of York (i.e. 3rd Duke of York) (i.e. and not Richard Plantagenet (i.e. later Duke of Gloucester and King Richard III))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_VI_PART_2_COURTYARD_PRODUCTION_UUID,
					name: 'Henry VI, Part 2',
					startDate: '2006-07-14',
					endDate: '2006-10-21',
					venue: {
						model: 'VENUE',
						uuid: COURTYARD_THEATRE_VENUE_UUID,
						name: 'Courtyard Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: RICHARD_PLANTAGENET_DUKE_OF_YORK_CHARACTER_UUID,
							name: 'Richard Plantagenet',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: JACK_CADE_CHARACTER_UUID,
							name: 'Jack Cade',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = cliveWoodPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Jonathan Slinger (person)', () => {

		it('includes in their production credits their portrayal of Richard Plantagenet (i.e. later Duke of Gloucester and King Richard III) (i.e. and not Richard Plantagenet, Duke of York (i.e. 3rd Duke of York))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_VI_PART_2_COURTYARD_PRODUCTION_UUID,
					name: 'Henry VI, Part 2',
					startDate: '2006-07-14',
					endDate: '2006-10-21',
					venue: {
						model: 'VENUE',
						uuid: COURTYARD_THEATRE_VENUE_UUID,
						name: 'Courtyard Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: RICHARD_PLANTAGENET_CHARACTER_UUID,
							name: 'Richard',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = jonathanSlingerPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
