import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const HENRY_IV_PART_1_MATERIAL_UUID = 'HENRY_IV_PART_1_MATERIAL_UUID';
const KING_HENRY_V_CHARACTER_UUID = 'HENRY_PRINCE_OF_WALES_CHARACTER_UUID';
const SIR_JOHN_FALSTAFF_CHARACTER_UUID = 'SIR_JOHN_FALSTAFF_CHARACTER_UUID';
const MESSENGER_CHARACTER_UUID = 'MESSENGER_CHARACTER_UUID';
const HENRY_IV_PART_2_MATERIAL_UUID = 'HENRY_IV_PART_2_MATERIAL_UUID';
const ATTENDANT_CHARACTER_UUID = 'ATTENDANT_CHARACTER_UUID';
const HENRY_V_MATERIAL_UUID = 'HENRY_V_MATERIAL_UUID';
const KING_OF_FRANCE_CHARACTER_UUID = 'KING_OF_FRANCE_CHARACTER_UUID';
const SOLDIER_CHARACTER_UUID = 'SOLDIER_CHARACTER_UUID';
const THE_MERRY_WIVES_OF_WINDSOR_MATERIAL_UUID = 'THE_MERRY_WIVES_OF_WINDSOR_MATERIAL_UUID';
const HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'HENRY_IV_PART_1_PRODUCTION_UUID';
const ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID = 'ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID';
const ALEX_HASSELL_PERSON_UUID = 'ALEX_HASSELL_PERSON_UUID';
const ANTONY_SHER_PERSON_UUID = 'ANTONY_SHER_PERSON_UUID';
const HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'HENRY_IV_PART_2_PRODUCTION_UUID';
const HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'HENRY_V_PRODUCTION_UUID';
const SIMON_THORP_PERSON_UUID = 'SIMON_THORP_PERSON_UUID';
const HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID = 'HENRY_IV_PART_1_2_PRODUCTION_UUID';
const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';
const MATTHEW_MACFADYEN_PERSON_UUID = 'MATTHEW_MACFADYEN_PERSON_UUID';
const MICHAEL_GAMBON_PERSON_UUID = 'MICHAEL_GAMBON_PERSON_UUID';
const HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID = 'HENRY_IV_PART_2_2_PRODUCTION_UUID';
const HENRY_V_NATIONAL_PRODUCTION_UUID = 'HENRY_V_2_PRODUCTION_UUID';
const ADRIAN_LESTER_PERSON_UUID = 'ADRIAN_LESTER_PERSON_UUID';
const IAN_HOGG_PERSON_UUID = 'IAN_HOGG_PERSON_UUID';

let kingHenryVCharacter;
let sirJohnFalstaffCharacter;
let messengerCharacter;
let attendantCharacter;
let soldierCharacter;
let henryIVPart1Material;
let henryIVPart2Material;
let henryVMaterial;
let henryIVPart1RoyalShakespeareProduction;
let henryIVPart2RoyalShakespeareProduction;
let henryVRoyalShakespeareProduction;
let henryIVPart1NationalProduction;
let henryIVPart2NationalProduction;
let henryVNationalProduction;
let alexHassellPerson;
let matthewMacfadyenPerson;
let adrianLesterPerson;

const sandbox = createSandbox();

describe('Character with variant depiction and portrayal names', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Henry IV, Part 1',
				format: 'play',
				year: '1597',
				characterGroups: [
					{
						characters: [
							{
								name: 'Henry, Prince of Wales',
								underlyingName: 'King Henry V'
							},
							{
								name: 'Sir John Falstaff'
							},
							{
								name: 'Messenger'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Henry IV, Part 2',
				format: 'play',
				year: '1599',
				characterGroups: [
					{
						characters: [
							{
								name: 'Prince Hal',
								underlyingName: 'King Henry V'
							},
							{
								name: 'Sir John Falstaff'
							},
							{
								name: 'Attendant'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Henry V',
				format: 'play',
				year: '1599',
				characterGroups: [
					{
						characters: [
							{
								name: 'King Henry V'
							},
							{
								name: 'King of France'
							},
							{
								name: 'Soldier'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Merry Wives of Windsor',
				format: 'play',
				year: '1597',
				characterGroups: [
					{
						characters: [
							{
								name: 'Prince Hal',
								underlyingName: 'King Henry V'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV, Part 1',
				startDate: '2014-03-18',
				pressDate: '2014-04-16',
				endDate: '2014-09-06',
				material: {
					name: 'Henry IV, Part 1'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Alex Hassell',
						roles: [
							{
								name: 'Henry, Prince of Wales'
							},
							{
								name: 'Messenger'
							}
						]
					},
					{
						name: 'Antony Sher',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV, Part 2',
				startDate: '2014-03-28',
				pressDate: '2014-04-16',
				endDate: '2014-09-06',
				material: {
					name: 'Henry IV, Part 2'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Alex Hassell',
						roles: [
							{
								name: 'Hal',
								characterName: 'Prince Hal'
							},
							{
								name: 'Attendant'
							}
						]
					},
					{
						name: 'Antony Sher',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry V',
				startDate: '2015-09-12',
				pressDate: '2015-09-22',
				endDate: '2015-10-25',
				material: {
					name: 'Henry V'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Alex Hassell',
						roles: [
							{
								name: 'Henry V',
								characterName: 'King Henry V'
							},
							{
								name: 'Soldier'
							}
						]
					},
					{
						name: 'Simon Thorp',
						roles: [
							{
								name: 'King of France'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV, Part 1',
				startDate: '2005-04-16',
				pressDate: '2005-05-04',
				endDate: '2005-08-31',
				material: {
					name: 'Henry IV, Part 1'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Matthew Macfadyen',
						roles: [
							{
								name: 'Prince Hal',
								characterName: 'Henry, Prince of Wales'
							},
							{
								name: 'Messenger'
							}
						]
					},
					{
						name: 'Michael Gambon',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV, Part 2',
				startDate: '2005-04-26',
				pressDate: '2005-05-04',
				endDate: '2005-08-31',
				material: {
					name: 'Henry IV, Part 2'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Matthew Macfadyen',
						roles: [
							{
								name: 'Hal, Prince of England',
								characterName: 'Prince Hal'
							},
							{
								name: 'Attendant'
							}
						]
					},
					{
						name: 'Michael Gambon',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry V',
				startDate: '2003-05-06',
				pressDate: '2003-05-13',
				endDate: '2003-08-20',
				material: {
					name: 'Henry V'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Adrian Lester',
						roles: [
							{
								name: 'Henry V',
								characterName: 'King Henry V'
							},
							{
								name: 'Soldier'
							}
						]
					},
					{
						name: 'Ian Hogg',
						roles: [
							{
								name: 'King of France'
							}
						]
					}
				]
			});

		kingHenryVCharacter = await chai.request(app)
			.get(`/characters/${KING_HENRY_V_CHARACTER_UUID}`);

		sirJohnFalstaffCharacter = await chai.request(app)
			.get(`/characters/${SIR_JOHN_FALSTAFF_CHARACTER_UUID}`);

		messengerCharacter = await chai.request(app)
			.get(`/characters/${MESSENGER_CHARACTER_UUID}`);

		attendantCharacter = await chai.request(app)
			.get(`/characters/${ATTENDANT_CHARACTER_UUID}`);

		soldierCharacter = await chai.request(app)
			.get(`/characters/${SOLDIER_CHARACTER_UUID}`);

		henryIVPart1Material = await chai.request(app)
			.get(`/materials/${HENRY_IV_PART_1_MATERIAL_UUID}`);

		henryIVPart2Material = await chai.request(app)
			.get(`/materials/${HENRY_IV_PART_2_MATERIAL_UUID}`);

		henryVMaterial = await chai.request(app)
			.get(`/materials/${HENRY_V_MATERIAL_UUID}`);

		henryIVPart1RoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		henryIVPart2RoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		henryVRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		henryIVPart1NationalProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID}`);

		henryIVPart2NationalProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID}`);

		henryVNationalProduction = await chai.request(app)
			.get(`/productions/${HENRY_V_NATIONAL_PRODUCTION_UUID}`);

		alexHassellPerson = await chai.request(app)
			.get(`/people/${ALEX_HASSELL_PERSON_UUID}`);

		matthewMacfadyenPerson = await chai.request(app)
			.get(`/people/${MATTHEW_MACFADYEN_PERSON_UUID}`);

		adrianLesterPerson = await chai.request(app)
			.get(`/people/${ADRIAN_LESTER_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('King Henry V (character)', () => {

		it('includes materials in which character is depicted', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: HENRY_IV_PART_2_MATERIAL_UUID,
					name: 'Henry IV, Part 2',
					format: 'play',
					year: 1599,
					surMaterial: null,
					writingCredits: [],
					depictions: [
						{
							displayName: 'Prince Hal',
							qualifier: null,
							group: null
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: HENRY_V_MATERIAL_UUID,
					name: 'Henry V',
					format: 'play',
					year: 1599,
					surMaterial: null,
					writingCredits: [],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: HENRY_IV_PART_1_MATERIAL_UUID,
					name: 'Henry IV, Part 1',
					format: 'play',
					year: 1597,
					surMaterial: null,
					writingCredits: [],
					depictions: [
						{
							displayName: 'Henry, Prince of Wales',
							qualifier: null,
							group: null
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_MATERIAL_UUID,
					name: 'The Merry Wives of Windsor',
					format: 'play',
					year: 1597,
					surMaterial: null,
					writingCredits: [],
					depictions: [
						{
							displayName: 'Prince Hal',
							qualifier: null,
							group: null
						}
					]
				}
			];

			const { materials } = kingHenryVCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes distinct variant-named depictions (i.e. depictions in materials with names different to the underlying character name)', () => {

			const expectedVariantNamedDepictions = [
				'Henry, Prince of Wales',
				'Prince Hal'
			];

			const { variantNamedDepictions } = kingHenryVCharacter.body;

			expect(variantNamedDepictions).to.deep.equal(expectedVariantNamedDepictions);

		});

		// Even though 'Prince Hal' already appears in the variant depiction names (i.e. variant names from materials),
		// it still appears here because the corresponding portrayal was of the character from a material (Henry IV, Part 1)
		// in which neither the underlying nor display name matches the role name used for the portrayal.
		// 'Henry, Prince of Wales' does not appear in this list because the portrayal
		// was in a production of the material that used this name as the display name for King Henry V,
		// and so this name instead only appears under variant depiction names.
		it('includes distinct variant-named portrayals (i.e. portrayals in productions with names different to that in material)', () => {

			const expectedVariantNamedPortrayals = [
				'Hal',
				'Hal, Prince of England',
				'Henry V',
				'Prince Hal'
			];

			const { variantNamedPortrayals } = kingHenryVCharacter.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry V',
					startDate: '2015-09-12',
					endDate: '2015-10-25',
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
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Henry V',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: SOLDIER_CHARACTER_UUID,
									name: 'Soldier',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2014-03-28',
					endDate: '2014-09-06',
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
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Hal',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: ATTENDANT_CHARACTER_UUID,
									name: 'Attendant',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2014-03-18',
					endDate: '2014-09-06',
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
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Henry, Prince of Wales',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: MESSENGER_CHARACTER_UUID,
									name: 'Messenger',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2005-04-26',
					endDate: '2005-08-31',
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
							uuid: MATTHEW_MACFADYEN_PERSON_UUID,
							name: 'Matthew Macfadyen',
							roleName: 'Hal, Prince of England',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: ATTENDANT_CHARACTER_UUID,
									name: 'Attendant',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2005-04-16',
					endDate: '2005-08-31',
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
							uuid: MATTHEW_MACFADYEN_PERSON_UUID,
							name: 'Matthew Macfadyen',
							roleName: 'Prince Hal',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: MESSENGER_CHARACTER_UUID,
									name: 'Messenger',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_V_NATIONAL_PRODUCTION_UUID,
					name: 'Henry V',
					startDate: '2003-05-06',
					endDate: '2003-08-20',
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
							uuid: ADRIAN_LESTER_PERSON_UUID,
							name: 'Adrian Lester',
							roleName: 'Henry V',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: SOLDIER_CHARACTER_UUID,
									name: 'Soldier',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = kingHenryVCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Sir John Falstaff (character)', () => {

		it('includes no variant-named depictions where none exist', () => {

			const expectedVariantNamedDepictions = [];

			const { variantNamedDepictions } = sirJohnFalstaffCharacter.body;

			expect(variantNamedDepictions).to.deep.equal(expectedVariantNamedDepictions);

		});

		it('includes no variant-named portrayals where none exist', () => {

			const expectedVariantNamedPortrayals = [];

			const { variantNamedPortrayals } = sirJohnFalstaffCharacter.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

	});

	describe('Messenger (character)', () => {

		it('includes productions in which character was portrayed (with portrayers\' other roles using uuid of King Henry V and specific display name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2014-03-18',
					endDate: '2014-09-06',
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
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Messenger',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Henry, Prince of Wales',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2005-04-16',
					endDate: '2005-08-31',
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
							uuid: MATTHEW_MACFADYEN_PERSON_UUID,
							name: 'Matthew Macfadyen',
							roleName: 'Messenger',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Prince Hal',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = messengerCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Attendant (character)', () => {

		it('includes productions in which character was portrayed (with portrayers\' other roles using uuid of King Henry V and specific display name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2014-03-28',
					endDate: '2014-09-06',
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
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Attendant',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Hal',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2005-04-26',
					endDate: '2005-08-31',
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
							uuid: MATTHEW_MACFADYEN_PERSON_UUID,
							name: 'Matthew Macfadyen',
							roleName: 'Attendant',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Hal, Prince of England',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = attendantCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Soldier (character)', () => {

		it('includes productions in which character was portrayed (with portrayers\' other roles using uuid of King Henry V and specific display name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry V',
					startDate: '2015-09-12',
					endDate: '2015-10-25',
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
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Soldier',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Henry V',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_V_NATIONAL_PRODUCTION_UUID,
					name: 'Henry V',
					startDate: '2003-05-06',
					endDate: '2003-08-20',
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
							uuid: ADRIAN_LESTER_PERSON_UUID,
							name: 'Adrian Lester',
							roleName: 'Soldier',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Henry V',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = soldierCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Henry IV, Part 1 (material)', () => {

		it('includes Henry, Prince of Wales in its characters using the uuid value of King Henry V', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: KING_HENRY_V_CHARACTER_UUID,
					name: 'Henry, Prince of Wales',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
					name: 'Sir John Falstaff',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: MESSENGER_CHARACTER_UUID,
					name: 'Messenger',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryIVPart1Material.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry IV, Part 2 (material)', () => {

		it('includes Prince Hal in its characters using the uuid value of King Henry V', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: KING_HENRY_V_CHARACTER_UUID,
					name: 'Prince Hal',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
					name: 'Sir John Falstaff',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: ATTENDANT_CHARACTER_UUID,
					name: 'Attendant',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryIVPart2Material.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry V (material)', () => {

		it('includes Henry V in its characters using the uuid value of King Henry V', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: KING_HENRY_V_CHARACTER_UUID,
					name: 'King Henry V',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: KING_OF_FRANCE_CHARACTER_UUID,
					name: 'King of France',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: SOLDIER_CHARACTER_UUID,
					name: 'Soldier',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryVMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry IV, Part 1 at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Alex Hassell as Henry, Prince of Wales using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: ALEX_HASSELL_PERSON_UUID,
					name: 'Alex Hassell',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry, Prince of Wales',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
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
							uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
							name: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = henryIVPart1RoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry IV, Part 2 at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Alex Hassell as Hal using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: ALEX_HASSELL_PERSON_UUID,
					name: 'Alex Hassell',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Hal',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: ATTENDANT_CHARACTER_UUID,
							name: 'Attendant',
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
							uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
							name: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = henryIVPart2RoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry V at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Alex Hassell as Henry V using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: ALEX_HASSELL_PERSON_UUID,
					name: 'Alex Hassell',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry V',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: SOLDIER_CHARACTER_UUID,
							name: 'Soldier',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: SIMON_THORP_PERSON_UUID,
					name: 'Simon Thorp',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_OF_FRANCE_CHARACTER_UUID,
							name: 'King of France',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = henryVRoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry IV, Part 1 at National Theatre (production)', () => {

		it('includes cast with Matthew Macfadyen as Prince Hal using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: MATTHEW_MACFADYEN_PERSON_UUID,
					name: 'Matthew Macfadyen',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Prince Hal',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: MICHAEL_GAMBON_PERSON_UUID,
					name: 'Michael Gambon',
					roles: [
						{
							model: 'CHARACTER',
							uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
							name: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = henryIVPart1NationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry IV, Part 2 at National Theatre (production)', () => {

		it('includes cast with Matthew Macfadyen as Hal, Prince of England using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: MATTHEW_MACFADYEN_PERSON_UUID,
					name: 'Matthew Macfadyen',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Hal, Prince of England',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: ATTENDANT_CHARACTER_UUID,
							name: 'Attendant',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: MICHAEL_GAMBON_PERSON_UUID,
					name: 'Michael Gambon',
					roles: [
						{
							model: 'CHARACTER',
							uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
							name: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = henryIVPart2NationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry V at National Theatre (production)', () => {

		it('includes cast with Adrian Lester as Henry V and using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: ADRIAN_LESTER_PERSON_UUID,
					name: 'Adrian Lester',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry V',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: SOLDIER_CHARACTER_UUID,
							name: 'Soldier',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: IAN_HOGG_PERSON_UUID,
					name: 'Ian Hogg',
					roles: [
						{
							model: 'CHARACTER',
							uuid: KING_OF_FRANCE_CHARACTER_UUID,
							name: 'King of France',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = henryVNationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Alex Hassell (person)', () => {

		it('includes productions of their portrayals of King Henry V under variant names (Henry, Prince of Wales; Hal; Henry V) but using its uuid value', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry V',
					startDate: '2015-09-12',
					endDate: '2015-10-25',
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
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry V',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: SOLDIER_CHARACTER_UUID,
							name: 'Soldier',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2014-03-28',
					endDate: '2014-09-06',
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
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Hal',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: ATTENDANT_CHARACTER_UUID,
							name: 'Attendant',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2014-03-18',
					endDate: '2014-09-06',
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
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry, Prince of Wales',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = alexHassellPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Matthew Macfadyen (person)', () => {

		it('includes productions of their portrayals of King Henry V under variant names (Prince Hal; Hal, Prince of England) but using its uuid value', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2005-04-26',
					endDate: '2005-08-31',
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
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Hal, Prince of England',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: ATTENDANT_CHARACTER_UUID,
							name: 'Attendant',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2005-04-16',
					endDate: '2005-08-31',
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
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Prince Hal',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = matthewMacfadyenPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Adrian Lester (person)', () => {

		it('includes productions of their portrayals of King Henry V under variant names (Henry V) but using its uuid value', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HENRY_V_NATIONAL_PRODUCTION_UUID,
					name: 'Henry V',
					startDate: '2003-05-06',
					endDate: '2003-08-20',
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
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry V',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: SOLDIER_CHARACTER_UUID,
							name: 'Soldier',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = adrianLesterPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
