import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character in multiple productions of multiple playtexts', () => {

	chai.use(chaiHttp);

	const HENRY_IV_PART_1_PLAYTEXT_UUID = '2';
	const SIR_JOHN_FALSTAFF_CHARACTER_UUID = '3';
	const HENRY_IV_PART_2_PLAYTEXT_UUID = '6';
	const THE_MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID = '10';
	const HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID = '12';
	const NATIONAL_THEATRE_UUID = '13';
	const MICHAEL_GAMBON_PERSON_UUID = '15';
	const HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID = '16';
	const THE_MERRY_WIVES_OF_WINDSOR_NATIONAL_PRODUCTION_UUID = '20';
	const HENRY_IV_PART_1_GLOBE_PRODUCTION_UUID = '24';
	const SHAKESPEARES_GLOBE_THEATRE_UUID = '25';
	const ROGER_ALLAM_PERSON_UUID = '27';
	const HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID = '28';
	const THE_MERRY_WIVES_OF_WINDSOR_GLOBE_PRODUCTION_UUID = '32';
	const HENRY_IV_PART_1_SWAN_PRODUCTION_UUID = '36';
	const SWAN_THEATRE_UUID = '37';
	const RICHARD_CORDERY_PERSON_UUID = '39';
	const HENRY_IV_PART_2_SWAN_PRODUCTION_UUID = '40';
	const THE_MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID = '44';

	let sirJohnFalstaffCharacter;
	let henryIVPart1Playtext;
	let henryIVPart2Playtext;
	let merryWivesOfWindsorPlaytext;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Henry IV: Part 1',
				characters: [
					{
						name: 'Sir John Falstaff'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Henry IV: Part 2',
				characters: [
					{
						name: 'Sir John Falstaff'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'The Merry Wives of Windsor',
				characters: [
					{
						name: 'Sir John Falstaff'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV: Part 1',
				theatre: {
					name: 'National Theatre'
				},
				playtext: {
					name: 'Henry IV: Part 1'
				},
				cast: [
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
				name: 'Henry IV: Part 2',
				theatre: {
					name: 'National Theatre'
				},
				playtext: {
					name: 'Henry IV: Part 2'
				},
				cast: [
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
				name: 'The Merry Wives of Windsor',
				theatre: {
					name: 'National Theatre'
				},
				playtext: {
					name: 'The Merry Wives of Windsor'
				},
				cast: [
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
				name: 'Henry IV: Part 1',
				theatre: {
					name: 'Shakespeare\'s Globe'
				},
				playtext: {
					name: 'Henry IV: Part 1'
				},
				cast: [
					{
						name: 'Roger Allam',
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
				name: 'Henry IV: Part 2',
				theatre: {
					name: 'Shakespeare\'s Globe'
				},
				playtext: {
					name: 'Henry IV: Part 2'
				},
				cast: [
					{
						name: 'Roger Allam',
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
				name: 'The Merry Wives of Windsor',
				theatre: {
					name: 'Shakespeare\'s Globe'
				},
				playtext: {
					name: 'The Merry Wives of Windsor'
				},
				cast: [
					{
						name: 'Roger Allam',
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
				name: 'Henry IV: Part 1',
				theatre: {
					name: 'Swan Theatre'
				},
				playtext: {
					name: 'Henry IV: Part 1'
				},
				cast: [
					{
						name: 'Richard Cordery',
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
				name: 'Henry IV: Part 2',
				theatre: {
					name: 'Swan Theatre'
				},
				playtext: {
					name: 'Henry IV: Part 2'
				},
				cast: [
					{
						name: 'Richard Cordery',
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
				name: 'The Merry Wives of Windsor',
				theatre: {
					name: 'Swan Theatre'
				},
				playtext: {
					name: 'The Merry Wives of Windsor'
				},
				cast: [
					{
						name: 'Richard Cordery',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		sirJohnFalstaffCharacter = await chai.request(app)
			.get(`/characters/${SIR_JOHN_FALSTAFF_CHARACTER_UUID}`);

		henryIVPart1Playtext = await chai.request(app)
			.get(`/playtexts/${HENRY_IV_PART_1_PLAYTEXT_UUID}`);

		henryIVPart2Playtext = await chai.request(app)
			.get(`/playtexts/${HENRY_IV_PART_2_PLAYTEXT_UUID}`);

		merryWivesOfWindsorPlaytext = await chai.request(app)
			.get(`/playtexts/${THE_MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Sir John Falstaff (character)', () => {

		it('includes playtexts in which character appears', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: HENRY_IV_PART_1_PLAYTEXT_UUID,
					name: 'Henry IV: Part 1',
					qualifiers: [],
					groups: []
				},
				{
					model: 'playtext',
					uuid: HENRY_IV_PART_2_PLAYTEXT_UUID,
					name: 'Henry IV: Part 2',
					qualifiers: [],
					groups: []
				},
				{
					model: 'playtext',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID,
					name: 'The Merry Wives of Windsor',
					qualifiers: [],
					groups: []
				}
			];

			const { playtexts } = sirJohnFalstaffCharacter.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

		it('includes productions of playtexts in which character appears (including cast member who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV: Part 1',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre'
					},
					performers: [
						{
							model: 'person',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_GLOBE_PRODUCTION_UUID,
					name: 'Henry IV: Part 1',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe'
					},
					performers: [
						{
							model: 'person',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_SWAN_PRODUCTION_UUID,
					name: 'Henry IV: Part 1',
					theatre: {
						model: 'theatre',
						uuid: SWAN_THEATRE_UUID,
						name: 'Swan Theatre'
					},
					performers: [
						{
							model: 'person',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV: Part 2',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre'
					},
					performers: [
						{
							model: 'person',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID,
					name: 'Henry IV: Part 2',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe'
					},
					performers: [
						{
							model: 'person',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_SWAN_PRODUCTION_UUID,
					name: 'Henry IV: Part 2',
					theatre: {
						model: 'theatre',
						uuid: SWAN_THEATRE_UUID,
						name: 'Swan Theatre'
					},
					performers: [
						{
							model: 'person',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_NATIONAL_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre'
					},
					performers: [
						{
							model: 'person',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_GLOBE_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe'
					},
					performers: [
						{
							model: 'person',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					theatre: {
						model: 'theatre',
						uuid: SWAN_THEATRE_UUID,
						name: 'Swan Theatre'
					},
					performers: [
						{
							model: 'person',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = sirJohnFalstaffCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Henry IV: Part 1 (playtext)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedSirJohnFalstaffCharacter = {
				model: 'character',
				uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
				name: 'Sir John Falstaff',
				qualifier: null
			};

			const { characterGroups: [{ characters }] } = henryIVPart1Playtext.body;

			const sirJohnFalstaffCharacter =
				characters.find(character => character.uuid === SIR_JOHN_FALSTAFF_CHARACTER_UUID);

			expect(characters.length).to.equal(1);
			expect(sirJohnFalstaffCharacter).to.deep.equal(expectedSirJohnFalstaffCharacter);

		});

	});

	describe('Henry IV: Part 2 (playtext)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedSirJohnFalstaffCharacter = {
				model: 'character',
				uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
				name: 'Sir John Falstaff',
				qualifier: null
			};

			const { characterGroups: [{ characters }] } = henryIVPart2Playtext.body;

			const sirJohnFalstaffCharacter =
				characters.find(character => character.uuid === SIR_JOHN_FALSTAFF_CHARACTER_UUID);

			expect(characters.length).to.equal(1);
			expect(sirJohnFalstaffCharacter).to.deep.equal(expectedSirJohnFalstaffCharacter);

		});

	});

	describe('The Merry Wives of Windsor (playtext)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedSirJohnFalstaffCharacter = {
				model: 'character',
				uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
				name: 'Sir John Falstaff',
				qualifier: null
			};

			const { characterGroups: [{ characters }] } = merryWivesOfWindsorPlaytext.body;

			const sirJohnFalstaffCharacter =
				characters.find(character => character.uuid === SIR_JOHN_FALSTAFF_CHARACTER_UUID);

			expect(characters.length).to.equal(1);
			expect(sirJohnFalstaffCharacter).to.deep.equal(expectedSirJohnFalstaffCharacter);

		});

	});

});
