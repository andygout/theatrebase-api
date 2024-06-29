import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const BARBICAN_CENTRE_VENUE_UUID = 'BARBICAN_CENTRE_VENUE_UUID';
const BARBICAN_THEATRE_VENUE_UUID = 'BARBICAN_THEATRE_VENUE_UUID';
const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';
const OLIVIER_THEATRE_VENUE_UUID = 'OLIVIER_THEATRE_VENUE_UUID';
const PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID = 'PEER_GYNT_1_MATERIAL_UUID';
const HENRIK_IBSEN_PERSON_UUID = 'HENRIK_IBSEN_PERSON_UUID';
const IBSEN_THEATRE_COMPANY_UUID = 'IBSEN_THEATRE_COMPANY_COMPANY_UUID';
const PEER_GYNT_CHARACTER_UUID = 'PEER_GYNT_CHARACTER_UUID';
const PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID = 'PEER_GYNT_2_MATERIAL_UUID';
const FRANK_MCGUINNESS_PERSON_UUID = 'FRANK_MCGUINNESS_PERSON_UUID';
const PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID = 'PEER_GYNT_3_MATERIAL_UUID';
const GERRY_BAMMAN_PERSON_UUID = 'GERRY_BAMMAN_PERSON_UUID';
const BAMMAN_THEATRE_COMPANY_UUID = 'BAMMAN_THEATRE_COMPANY_COMPANY_UUID';
const IRENE_B_BERMAN_PERSON_UUID = 'IRENE_B_BERMAN_PERSON_UUID';
const BALTASAR_KORMÁKUR_PERSON_UUID = 'BALTASAR_KORMAKUR_PERSON_UUID';
const GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID = 'GHOSTS_1_MATERIAL_UUID';
const GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID = 'GHOSTS_2_MATERIAL_UUID';
const PEER_GYNT_OLIVIER_PRODUCTION_UUID = 'PEER_GYNT_PRODUCTION_UUID';
const PEER_GYNT_BARBICAN_PRODUCTION_UUID = 'PEER_GYNT_2_PRODUCTION_UUID';
const GHOSTS_DUCHESS_PRODUCTION_UUID = 'GHOSTS_PRODUCTION_UUID';
const DUCHESS_THEATRE_VENUE_UUID = 'DUCHESS_THEATRE_VENUE_UUID';

let peerGyntOriginalVersionMaterial;
let peerGyntSubsequentVersion2Material;
let henrikIbsenPerson;
let gerryBammanPerson;
let ibsenTheatreCompany;
let bammanTheatreCompany;
let peerGyntCharacter;
let peerGyntBarbicanProduction;

const sandbox = createSandbox();

describe('Material with subsequent versions', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'Barbican Centre',
				subVenues: [
					{
						name: 'Barbican Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'National Theatre',
				subVenues: [
					{
						name: 'Olivier Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Peer Gynt',
				differentiator: '1',
				format: 'play',
				year: '1867',
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Peer Gynt'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Peer Gynt',
				differentiator: '2',
				format: 'play',
				year: '2000',
				originalVersionMaterial: {
					name: 'Peer Gynt',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Frank McGuinness'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Peer Gynt'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Peer Gynt',
				differentiator: '3',
				format: 'play',
				year: '2007',
				originalVersionMaterial: {
					name: 'Peer Gynt',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						name: 'translated by',
						entities: [
							{
								name: 'Gerry Bamman'
							},
							{
								model: 'COMPANY',
								name: 'Bamman Theatre Company'
							},
							{
								name: 'Irene B Berman'
							}
						]
					},
					{
						name: 'adapted by',
						entities: [
							{
								name: 'Baltasar Kormákur'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Peer Gynt'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Ghosts',
				differentiator: '1',
				format: 'play',
				year: '1881',
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Ghosts',
				differentiator: '2',
				format: 'play',
				year: '2008',
				originalVersionMaterial: {
					name: 'Ghosts',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						name: 'translated by',
						entities: [
							{
								name: 'Gerry Bamman'
							},
							{
								model: 'COMPANY',
								name: 'Bamman Theatre Company'
							},
							{
								name: 'Irene B Berman'
							}
						]
					},
					{
						name: 'adapted by',
						entities: [
							{
								name: 'Baltasar Kormákur'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Peer Gynt',
				startDate: '2000-10-16',
				pressDate: '2000-11-13',
				endDate: '2000-12-09',
				material: {
					name: 'Peer Gynt',
					differentiator: '2'
				},
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Peer Gynt',
				startDate: '2007-02-28',
				endDate: '2007-03-10',
				material: {
					name: 'Peer Gynt',
					differentiator: '3'
				},
				venue: {
					name: 'Barbican Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Ghosts',
				startDate: '2010-02-11',
				pressDate: '2010-02-23',
				endDate: '2010-03-27',
				material: {
					name: 'Ghosts',
					differentiator: '2'
				},
				venue: {
					name: 'Duchess Theatre'
				}
			});

		peerGyntOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID}`);

		peerGyntSubsequentVersion2Material = await chai.request(app)
			.get(`/materials/${PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID}`);

		henrikIbsenPerson = await chai.request(app)
			.get(`/people/${HENRIK_IBSEN_PERSON_UUID}`);

		gerryBammanPerson = await chai.request(app)
			.get(`/people/${GERRY_BAMMAN_PERSON_UUID}`);

		ibsenTheatreCompany = await chai.request(app)
			.get(`/companies/${IBSEN_THEATRE_COMPANY_UUID}`);

		bammanTheatreCompany = await chai.request(app)
			.get(`/companies/${BAMMAN_THEATRE_COMPANY_UUID}`);

		peerGyntCharacter = await chai.request(app)
			.get(`/characters/${PEER_GYNT_CHARACTER_UUID}`);

		peerGyntBarbicanProduction = await chai.request(app)
			.get(`/productions/${PEER_GYNT_BARBICAN_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Peer Gynt (original version) (material)', () => {

		it('includes subsequent versions of this material; will omit original version writers', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = peerGyntOriginalVersionMaterial.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

		it('includes writers of this material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: HENRIK_IBSEN_PERSON_UUID,
							name: 'Henrik Ibsen'
						},
						{
							model: 'COMPANY',
							uuid: IBSEN_THEATRE_COMPANY_UUID,
							name: 'Ibsen Theatre Company'
						}
					]
				}
			];

			const { writingCredits } = peerGyntOriginalVersionMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

		it('includes productions of material\'s subsequent versions', () => {

			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: PEER_GYNT_BARBICAN_PRODUCTION_UUID,
					name: 'Peer Gynt',
					startDate: '2007-02-28',
					endDate: '2007-03-10',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BARBICAN_CENTRE_VENUE_UUID,
							name: 'Barbican Centre'
						}
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: PEER_GYNT_OLIVIER_PRODUCTION_UUID,
					name: 'Peer Gynt',
					startDate: '2000-10-16',
					endDate: '2000-12-09',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null
				}
			];

			const { subsequentVersionMaterialProductions } = peerGyntOriginalVersionMaterial.body;

			expect(subsequentVersionMaterialProductions).to.deep.equal(expectedSubsequentVersionMaterialProductions);

		});

	});

	describe('Peer Gynt (subsequent version) (material)', () => {

		it('includes original version of this material, with corresponding writers', () => {

			const expectedOriginalVersionMaterial = {
				model: 'MATERIAL',
				uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
				name: 'Peer Gynt',
				format: 'play',
				year: 1867,
				surMaterial: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								uuid: IBSEN_THEATRE_COMPANY_UUID,
								name: 'Ibsen Theatre Company'
							}
						]
					}
				]
			};

			const { originalVersionMaterial } = peerGyntSubsequentVersion2Material.body;

			expect(originalVersionMaterial).to.deep.equal(expectedOriginalVersionMaterial);

		});

		it('includes writers of this material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: HENRIK_IBSEN_PERSON_UUID,
							name: 'Henrik Ibsen'
						},
						{
							model: 'COMPANY',
							uuid: IBSEN_THEATRE_COMPANY_UUID,
							name: 'Ibsen Theatre Company'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'translated by',
					entities: [
						{
							model: 'PERSON',
							uuid: GERRY_BAMMAN_PERSON_UUID,
							name: 'Gerry Bamman'
						},
						{
							model: 'COMPANY',
							uuid: BAMMAN_THEATRE_COMPANY_UUID,
							name: 'Bamman Theatre Company'
						},
						{
							model: 'PERSON',
							uuid: IRENE_B_BERMAN_PERSON_UUID,
							name: 'Irene B Berman'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'adapted by',
					entities: [
						{
							model: 'PERSON',
							uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
							name: 'Baltasar Kormákur'
						}
					]
				}
			];

			const { writingCredits } = peerGyntSubsequentVersion2Material.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Henrik Ibsen (person)', () => {

		it('includes materials they have written', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 1881,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 1867,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				}
			];

			const { materials } = henrikIbsenPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes subsequent versions of materials they originally wrote; will omit original version writers', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = henrikIbsenPerson.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

		it('includes productions of subsequent versions of materials they originally wrote', () => {

			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: GHOSTS_DUCHESS_PRODUCTION_UUID,
					name: 'Ghosts',
					startDate: '2010-02-11',
					endDate: '2010-03-27',
					venue: {
						model: 'VENUE',
						uuid: DUCHESS_THEATRE_VENUE_UUID,
						name: 'Duchess Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: PEER_GYNT_BARBICAN_PRODUCTION_UUID,
					name: 'Peer Gynt',
					startDate: '2007-02-28',
					endDate: '2007-03-10',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BARBICAN_CENTRE_VENUE_UUID,
							name: 'Barbican Centre'
						}
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: PEER_GYNT_OLIVIER_PRODUCTION_UUID,
					name: 'Peer Gynt',
					startDate: '2000-10-16',
					endDate: '2000-12-09',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null
				}
			];

			const { subsequentVersionMaterialProductions } = henrikIbsenPerson.body;

			expect(subsequentVersionMaterialProductions).to.deep.equal(expectedSubsequentVersionMaterialProductions);

		});

	});

	describe('Gerry Bamman (person)', () => {

		it('includes materials they have written', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				}
			];

			const { materials } = gerryBammanPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Ibsen Theatre Company (company)', () => {

		it('includes materials it has written', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 1881,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 1867,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				}
			];

			const { materials } = ibsenTheatreCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes subsequent versions of materials it originally wrote; will omit original version writers', () => {

			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = ibsenTheatreCompany.body;

			expect(subsequentVersionMaterials).to.deep.equal(expectedSubsequentVersionMaterials);

		});

		it('includes productions of subsequent versions of materials they originally wrote', () => {

			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: GHOSTS_DUCHESS_PRODUCTION_UUID,
					name: 'Ghosts',
					startDate: '2010-02-11',
					endDate: '2010-03-27',
					venue: {
						model: 'VENUE',
						uuid: DUCHESS_THEATRE_VENUE_UUID,
						name: 'Duchess Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: PEER_GYNT_BARBICAN_PRODUCTION_UUID,
					name: 'Peer Gynt',
					startDate: '2007-02-28',
					endDate: '2007-03-10',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: BARBICAN_CENTRE_VENUE_UUID,
							name: 'Barbican Centre'
						}
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: PEER_GYNT_OLIVIER_PRODUCTION_UUID,
					name: 'Peer Gynt',
					startDate: '2000-10-16',
					endDate: '2000-12-09',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null
				}
			];

			const { subsequentVersionMaterialProductions } = ibsenTheatreCompany.body;

			expect(subsequentVersionMaterialProductions).to.deep.equal(expectedSubsequentVersionMaterialProductions);

		});

	});

	describe('Bamman Theatre Company (company)', () => {

		it('includes materials it has written, with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				}
			];

			const { materials } = bammanTheatreCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Peer Gynt at Barbican (production)', () => {

		it('includes in its material data the writers of the material', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
				name: 'Peer Gynt',
				format: 'play',
				year: 2007,
				surMaterial: null,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								uuid: IBSEN_THEATRE_COMPANY_UUID,
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'translated by',
						entities: [
							{
								model: 'PERSON',
								uuid: GERRY_BAMMAN_PERSON_UUID,
								name: 'Gerry Bamman'
							},
							{
								model: 'COMPANY',
								uuid: BAMMAN_THEATRE_COMPANY_UUID,
								name: 'Bamman Theatre Company'
							},
							{
								model: 'PERSON',
								uuid: IRENE_B_BERMAN_PERSON_UUID,
								name: 'Irene B Berman'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adapted by',
						entities: [
							{
								model: 'PERSON',
								uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
								name: 'Baltasar Kormákur'
							}
						]
					}
				]
			};

			const { material } = peerGyntBarbicanProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Peer Gynt (character)', () => {

		it('includes in its material data the writers of the material', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 1867,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = peerGyntCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('materials list', () => {

		it('includes writers', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: GHOSTS_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 2008,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'translated by',
							entities: [
								{
									model: 'PERSON',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'COMPANY',
									uuid: BAMMAN_THEATRE_COMPANY_UUID,
									name: 'Bamman Theatre Company'
								},
								{
									model: 'PERSON',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted by',
							entities: [
								{
									model: 'PERSON',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 2000,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'version by',
							entities: [
								{
									model: 'PERSON',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GHOSTS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ghosts',
					format: 'play',
					year: 1881,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PEER_GYNT_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Peer Gynt',
					format: 'play',
					year: 1867,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								},
								{
									model: 'COMPANY',
									uuid: IBSEN_THEATRE_COMPANY_UUID,
									name: 'Ibsen Theatre Company'
								}
							]
						}
					]
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});
