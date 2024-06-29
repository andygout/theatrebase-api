import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const ROCK_N_ROLL_MATERIAL_UUID = 'ROCK_N_ROLL_MATERIAL_UUID';
const ESME_CHARACTER_UUID = 'ESME_CHARACTER_UUID';
const MAX_CHARACTER_UUID = 'MAX_CHARACTER_UUID';
const ELEANOR_CHARACTER_UUID = 'ELEANOR_CHARACTER_UUID';
const ALICE_CHARACTER_UUID = 'ALICE_CHARACTER_UUID';
const ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID = 'ROCK_N_ROLL_PRODUCTION_UUID';
const ROYAL_COURT_THEATRE_VENUE_UUID = 'ROYAL_COURT_THEATRE_VENUE_UUID';
const ALICE_EVE_PERSON_UUID = 'ALICE_EVE_PERSON_UUID';
const BRIAN_COX_PERSON_UUID = 'BRIAN_COX_PERSON_UUID';
const SINEAD_CUSACK_PERSON_UUID = 'SINEAD_CUSACK_PERSON_UUID';
const HANDBAGGED_MATERIAL_UUID = 'HANDBAGGED_MATERIAL_UUID';
const MARGARET_THATCHER_CHARACTER_UUID = 'T_CHARACTER_UUID';
const QUEEN_ELIZABETH_II_CHARACTER_UUID = 'Q_CHARACTER_UUID';
const RONALD_REAGAN_CHARACTER_UUID = 'RON_CHARACTER_UUID';
const HANDBAGGED_TRICYCLE_PRODUCTION_UUID = 'HANDBAGGED_PRODUCTION_UUID';
const TRICYCLE_THEATRE_VENUE_UUID = 'TRICYCLE_THEATRE_VENUE_UUID';
const STELLA_GONET_PERSON_UUID = 'STELLA_GONET_PERSON_UUID';
const KIKA_MARKHAM_PERSON_UUID = 'KIKA_MARKHAM_PERSON_UUID';
const HEATHER_CRANEY_PERSON_UUID = 'HEATHER_CRANEY_PERSON_UUID';
const CLAIRE_COX_PERSON_UUID = 'CLAIRE_COX_PERSON_UUID';
const TOM_MANNION_PERSON_UUID = 'TOM_MANNION_PERSON_UUID';

let esmeCharacter;
let aliceCharacter;
let eleanorCharacter;
let rockNRollMaterial;
let rockNRollRoyalCourtProduction;
let aliceEvePerson;
let sineadCusackPerson;
let queenElizabethIICharacter;
let handbaggedMaterial;
let handbaggedTricycleProduction;
let kikaMarkhamPerson;
let claireCoxPerson;

const sandbox = createSandbox();

describe('Character with multiple appearances in the same material under different qualifiers', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Rock \'n\' Roll',
				format: 'play',
				year: '2006',
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

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Handbagged',
				format: 'play',
				year: '2010',
				characterGroups: [
					{
						characters: [
							{
								name: 'T',
								underlyingName: 'Margaret Thatcher',
								qualifier: 'older'
							},
							{
								name: 'Q',
								underlyingName: 'Queen Elizabeth II',
								qualifier: 'older'
							},
							{
								name: 'Mags',
								underlyingName: 'Margaret Thatcher',
								qualifier: 'younger'
							},
							{
								name: 'Liz',
								underlyingName: 'Queen Elizabeth II',
								qualifier: 'younger'
							},
							{
								name: 'Ron',
								underlyingName: 'Ronald Reagan'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Handbagged',
				startDate: '2010-06-04',
				pressDate: '2010-06-11',
				endDate: '2010-07-17',
				material: {
					name: 'Handbagged'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				cast: [
					{
						name: 'Stella Gonet',
						roles: [
							{
								name: 'T'
							}
						]
					},
					{
						name: 'Kika Markham',
						roles: [
							{
								name: 'Q'
							}
						]
					},
					{
						name: 'Heather Craney',
						roles: [
							{
								name: 'Mags'
							}
						]
					},
					{
						name: 'Claire Cox',
						roles: [
							{
								name: 'Liz'
							}
						]
					},
					{
						name: 'Tom Mannion',
						roles: [
							{
								name: 'Ron'
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

		queenElizabethIICharacter = await chai.request(app)
			.get(`/characters/${QUEEN_ELIZABETH_II_CHARACTER_UUID}`);

		handbaggedMaterial = await chai.request(app)
			.get(`/materials/${HANDBAGGED_MATERIAL_UUID}`);

		handbaggedTricycleProduction = await chai.request(app)
			.get(`/productions/${HANDBAGGED_TRICYCLE_PRODUCTION_UUID}`);

		kikaMarkhamPerson = await chai.request(app)
			.get(`/people/${KIKA_MARKHAM_PERSON_UUID}`);

		claireCoxPerson = await chai.request(app)
			.get(`/people/${CLAIRE_COX_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Esme (character)', () => {

		it('includes materials in which character is depicted, including the qualifiers used', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: ROCK_N_ROLL_MATERIAL_UUID,
					name: 'Rock \'n\' Roll',
					format: 'play',
					year: 2006,
					surMaterial: null,
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
					model: 'PRODUCTION',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: ALICE_EVE_PERSON_UUID,
							name: 'Alice Eve',
							roleName: 'Esme',
							qualifier: 'younger',
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: ALICE_CHARACTER_UUID,
									name: 'Alice',
									qualifier: null,
									isAlternate: false
								}
							]
						},
						{
							model: 'PERSON',
							uuid: SINEAD_CUSACK_PERSON_UUID,
							name: 'Sinead Cusack',
							roleName: 'Esme',
							qualifier: 'older',
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: ELEANOR_CHARACTER_UUID,
									name: 'Eleanor',
									qualifier: null,
									isAlternate: false
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
					model: 'PRODUCTION',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: ALICE_EVE_PERSON_UUID,
							name: 'Alice Eve',
							roleName: 'Alice',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: ESME_CHARACTER_UUID,
									name: 'Esme',
									qualifier: 'younger',
									isAlternate: false
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
					model: 'PRODUCTION',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: SINEAD_CUSACK_PERSON_UUID,
							name: 'Sinead Cusack',
							roleName: 'Eleanor',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: ESME_CHARACTER_UUID,
									name: 'Esme',
									qualifier: 'older',
									isAlternate: false
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
					model: 'CHARACTER',
					uuid: ESME_CHARACTER_UUID,
					name: 'Esme',
					qualifier: 'younger'
				},
				{
					model: 'CHARACTER',
					uuid: MAX_CHARACTER_UUID,
					name: 'Max',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: ELEANOR_CHARACTER_UUID,
					name: 'Eleanor',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: ESME_CHARACTER_UUID,
					name: 'Esme',
					qualifier: 'older'
				},
				{
					model: 'CHARACTER',
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
					model: 'PERSON',
					uuid: ALICE_EVE_PERSON_UUID,
					name: 'Alice Eve',
					roles: [
						{
							model: 'CHARACTER',
							uuid: ESME_CHARACTER_UUID,
							name: 'Esme',
							qualifier: 'younger',
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: ALICE_CHARACTER_UUID,
							name: 'Alice',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: BRIAN_COX_PERSON_UUID,
					name: 'Brian Cox',
					roles: [
						{
							model: 'CHARACTER',
							uuid: MAX_CHARACTER_UUID,
							name: 'Max',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: SINEAD_CUSACK_PERSON_UUID,
					name: 'Sinead Cusack',
					roles: [
						{
							model: 'CHARACTER',
							uuid: ELEANOR_CHARACTER_UUID,
							name: 'Eleanor',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: ESME_CHARACTER_UUID,
							name: 'Esme',
							qualifier: 'older',
							isAlternate: false
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
					model: 'PRODUCTION',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: ESME_CHARACTER_UUID,
							name: 'Esme',
							qualifier: 'younger',
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: ALICE_CHARACTER_UUID,
							name: 'Alice',
							qualifier: null,
							isAlternate: false
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
					model: 'PRODUCTION',
					uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
					name: 'Rock \'n\' Roll',
					startDate: '2006-06-03',
					endDate: '2006-07-15',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
						name: 'Royal Court Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: ELEANOR_CHARACTER_UUID,
							name: 'Eleanor',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: ESME_CHARACTER_UUID,
							name: 'Esme',
							qualifier: 'older',
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = sineadCusackPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Queen Elizabeth II (character)', () => {

		it('includes materials in which character is depicted, including the qualifiers used', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: HANDBAGGED_MATERIAL_UUID,
					name: 'Handbagged',
					format: 'play',
					year: 2010,
					surMaterial: null,
					writingCredits: [],
					depictions: [
						{
							displayName: 'Q',
							qualifier: 'older',
							group: null
						},
						{
							displayName: 'Liz',
							qualifier: 'younger',
							group: null
						}
					]
				}
			];

			const { materials } = queenElizabethIICharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes productions in which character was portrayed, including by which performer', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: HANDBAGGED_TRICYCLE_PRODUCTION_UUID,
					name: 'Handbagged',
					startDate: '2010-06-04',
					endDate: '2010-07-17',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: KIKA_MARKHAM_PERSON_UUID,
							name: 'Kika Markham',
							roleName: 'Q',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						},
						{
							model: 'PERSON',
							uuid: CLAIRE_COX_PERSON_UUID,
							name: 'Claire Cox',
							roleName: 'Liz',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = queenElizabethIICharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Handbagged (material)', () => {

		it('includes Queen Elizabeth II in its characters with an entry for each qualifier', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: MARGARET_THATCHER_CHARACTER_UUID,
					name: 'T',
					qualifier: 'older'
				},
				{
					model: 'CHARACTER',
					uuid: QUEEN_ELIZABETH_II_CHARACTER_UUID,
					name: 'Q',
					qualifier: 'older'
				},
				{
					model: 'CHARACTER',
					uuid: MARGARET_THATCHER_CHARACTER_UUID,
					name: 'Mags',
					qualifier: 'younger'
				},
				{
					model: 'CHARACTER',
					uuid: QUEEN_ELIZABETH_II_CHARACTER_UUID,
					name: 'Liz',
					qualifier: 'younger'
				},
				{
					model: 'CHARACTER',
					uuid: RONALD_REAGAN_CHARACTER_UUID,
					name: 'Ron',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = handbaggedMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Handbagged at Tricycle Theatre (production)', () => {

		it('includes the portrayers of Queen Elizabeth II in its cast with their corresponding display names', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: STELLA_GONET_PERSON_UUID,
					name: 'Stella Gonet',
					roles: [
						{
							model: 'CHARACTER',
							uuid: MARGARET_THATCHER_CHARACTER_UUID,
							name: 'T',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: KIKA_MARKHAM_PERSON_UUID,
					name: 'Kika Markham',
					roles: [
						{
							model: 'CHARACTER',
							uuid: QUEEN_ELIZABETH_II_CHARACTER_UUID,
							name: 'Q',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: HEATHER_CRANEY_PERSON_UUID,
					name: 'Heather Craney',
					roles: [
						{
							model: 'CHARACTER',
							uuid: MARGARET_THATCHER_CHARACTER_UUID,
							name: 'Mags',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: CLAIRE_COX_PERSON_UUID,
					name: 'Claire Cox',
					roles: [
						{
							model: 'CHARACTER',
							uuid: QUEEN_ELIZABETH_II_CHARACTER_UUID,
							name: 'Liz',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: TOM_MANNION_PERSON_UUID,
					name: 'Tom Mannion',
					roles: [
						{
							model: 'CHARACTER',
							uuid: RONALD_REAGAN_CHARACTER_UUID,
							name: 'Ron',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = handbaggedTricycleProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Kika Markham (person)', () => {

		it('includes in their production credits their portrayal of Queen Elizabeth II with its corresponding display name (i.e. Q)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HANDBAGGED_TRICYCLE_PRODUCTION_UUID,
					name: 'Handbagged',
					startDate: '2010-06-04',
					endDate: '2010-07-17',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: QUEEN_ELIZABETH_II_CHARACTER_UUID,
							name: 'Q',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = kikaMarkhamPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Claire Cox (person)', () => {

		it('includes in their production credits their portrayal of Queen Elizabeth II with its corresponding display name (i.e. Liz)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: HANDBAGGED_TRICYCLE_PRODUCTION_UUID,
					name: 'Handbagged',
					startDate: '2010-06-04',
					endDate: '2010-07-17',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: QUEEN_ELIZABETH_II_CHARACTER_UUID,
							name: 'Liz',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = claireCoxPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});
