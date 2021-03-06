import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: Productions API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('Production material uniqueness in database', () => {

		const HOME_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedMaterialHome1 = {
			model: 'material',
			name: 'Home',
			differentiator: '',
			errors: {}
		};

		const expectedMaterialHome2 = {
			model: 'material',
			name: 'Home',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: HOME_PRODUCTION_UUID,
				name: 'Home'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates material that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					material: {
						name: 'Home'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.material).to.deep.equal(expectedMaterialHome1);
			expect(await countNodesWithLabel('Material')).to.equal(1);

		});

		it('updates production and creates material that has same name as existing material but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					material: {
						name: 'Home',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.material).to.deep.equal(expectedMaterialHome2);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

		it('updates production and uses existing material that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					material: {
						name: 'Home'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.material).to.deep.equal(expectedMaterialHome1);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

		it('updates production and uses existing material that has a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					material: {
						name: 'Home',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.material).to.deep.equal(expectedMaterialHome2);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

	});

	describe('Production venue uniqueness in database', () => {

		const DIAL_M_FOR_MURDER_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedVenueNewTheatre1 = {
			model: 'venue',
			name: 'New Theatre',
			differentiator: '',
			errors: {}
		};

		const expectedVenueNewTheatre2 = {
			model: 'venue',
			name: 'New Theatre',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: DIAL_M_FOR_MURDER_PRODUCTION_UUID,
				name: 'Dial M for Murder'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates venue that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					venue: {
						name: 'New Theatre'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.venue).to.deep.equal(expectedVenueNewTheatre1);
			expect(await countNodesWithLabel('Venue')).to.equal(1);

		});

		it('updates production and creates venue that has same name as existing venue but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					venue: {
						name: 'New Theatre',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.venue).to.deep.equal(expectedVenueNewTheatre2);
			expect(await countNodesWithLabel('Venue')).to.equal(2);

		});

		it('updates production and uses existing venue that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					venue: {
						name: 'New Theatre'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.venue).to.deep.equal(expectedVenueNewTheatre1);
			expect(await countNodesWithLabel('Venue')).to.equal(2);

		});

		it('updates production and uses existing venue that has a differentiator', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					venue: {
						name: 'New Theatre',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.venue).to.deep.equal(expectedVenueNewTheatre2);
			expect(await countNodesWithLabel('Venue')).to.equal(2);

		});

	});

	describe('Production producer entity (person) uniqueness in database', () => {

		const GIRL_NO_7_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonPaulHiggins1 = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		const expectedPersonPaulHiggins2 = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: GIRL_NO_7_PRODUCTION_UUID,
				name: 'Girl No 7'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates producer entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Higgins'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0]).to.deep.equal(expectedPersonPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates production and creates producer entity (person) that has same name as existing producer entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Higgins',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0]).to.deep.equal(expectedPersonPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing producer entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Higgins'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0]).to.deep.equal(expectedPersonPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing producer entity (person) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Higgins',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0]).to.deep.equal(expectedPersonPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Production producer entity (company) uniqueness in database', () => {

		const HAMLET_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyTheatreRoyalProductions1 = {
			model: 'company',
			name: 'Theatre Royal Productions',
			differentiator: '',
			errors: {},
			creditedMembers: [
				{
					model: 'person',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		const expectedCompanyTheatreRoyalProductions2 = {
			model: 'company',
			name: 'Theatre Royal Productions',
			differentiator: '1',
			errors: {},
			creditedMembers: [
				{
					model: 'person',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: HAMLET_PRODUCTION_UUID,
				name: 'Hamlet'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates producer entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'company',
									name: 'Theatre Royal Productions'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0]).to.deep.equal(expectedCompanyTheatreRoyalProductions1);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('updates production and creates producer entity (company) that has same name as existing producer entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'company',
									name: 'Theatre Royal Productions',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0]).to.deep.equal(expectedCompanyTheatreRoyalProductions2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates production and uses existing producer entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'company',
									name: 'Theatre Royal Productions'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0]).to.deep.equal(expectedCompanyTheatreRoyalProductions1);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates production and uses existing producer entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'company',
									name: 'Theatre Royal Productions',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0]).to.deep.equal(expectedCompanyTheatreRoyalProductions2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

	});

	describe('Production producer entity (company) credited member (person) uniqueness in database', () => {

		const GIRL_NO_7_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonPaulHiggins1 = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		const expectedPersonPaulHiggins2 = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: GIRL_NO_7_PRODUCTION_UUID,
				name: 'Girl No 7'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates producer entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'company',
									name: 'Theatre 503 Productions',
									creditedMembers: [
										{
											name: 'Paul Higgins'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates production and creates producer entity (company) that has same name as existing producer entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'company',
									name: 'Theatre 503 Productions',
									creditedMembers: [
										{
											name: 'Paul Higgins',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing producer entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'company',
									name: 'Theatre 503 Productions',
									creditedMembers: [
										{
											name: 'Paul Higgins'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing producer entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'company',
									name: 'Theatre 503 Productions',
									creditedMembers: [
										{
											name: 'Paul Higgins',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.producerCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Production cast member uniqueness in database', () => {

		const ARISTOCRATS_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCastMemberPaulHiggins1 = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '',
			errors: {},
			roles: [
				{
					model: 'role',
					name: '',
					characterName: '',
					characterDifferentiator: '',
					qualifier: '',
					isAlternate: null,
					errors: {}
				}
			]
		};

		const expectedCastMemberPaulHiggins2 = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {},
			roles: [
				{
					model: 'role',
					name: '',
					characterName: '',
					characterDifferentiator: '',
					qualifier: '',
					isAlternate: null,
					errors: {}
				}
			]
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: ARISTOCRATS_PRODUCTION_UUID,
				name: 'Aristocrats'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates cast member that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins'
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.cast[0]).to.deep.equal(expectedCastMemberPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates production and creates cast member that has same name as existing cast member but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins',
							differentiator: '1'
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.cast[0]).to.deep.equal(expectedCastMemberPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing cast member that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins'
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.cast[0]).to.deep.equal(expectedCastMemberPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing cast member that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins',
							differentiator: '1'
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.cast[0]).to.deep.equal(expectedCastMemberPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Production creative entity (person) uniqueness in database', () => {

		const GIRL_NO_7_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonPaulHiggins1 = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		const expectedPersonPaulHiggins2 = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: GIRL_NO_7_PRODUCTION_UUID,
				name: 'Girl No 7'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates creative entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Paul Higgins'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0]).to.deep.equal(expectedPersonPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates production and creates creative entity (person) that has same name as existing creative entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Paul Higgins',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0]).to.deep.equal(expectedPersonPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing creative entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Paul Higgins'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0]).to.deep.equal(expectedPersonPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing creative entity (person) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Paul Higgins',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0]).to.deep.equal(expectedPersonPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Production creative entity (company) uniqueness in database', () => {

		const MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyAutograph1 = {
			model: 'company',
			name: 'Autograph',
			differentiator: '',
			errors: {},
			creditedMembers: [
				{
					model: 'person',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		const expectedCompanyAutograph2 = {
			model: 'company',
			name: 'Autograph',
			differentiator: '1',
			errors: {},
			creditedMembers: [
				{
					model: 'person',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID,
				name: 'Mother Courage and Her Children'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates creative entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'company',
									name: 'Autograph'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0]).to.deep.equal(expectedCompanyAutograph1);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('updates production and creates creative entity (company) that has same name as existing creative entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0]).to.deep.equal(expectedCompanyAutograph2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates production and uses existing creative entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'company',
									name: 'Autograph'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0]).to.deep.equal(expectedCompanyAutograph1);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates production and uses existing creative entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0]).to.deep.equal(expectedCompanyAutograph2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

	});

	describe('Production creative entity (company) credited member (person) uniqueness in database', () => {

		const MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonAndrewBruce1 = {
			model: 'person',
			name: 'Andrew Bruce',
			differentiator: '',
			errors: {}
		};

		const expectedPersonAndrewBruce2 = {
			model: 'person',
			name: 'Andrew Bruce',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID,
				name: 'Mother Courage and Her Children'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates creative entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									creditedMembers: [
										{
											name: 'Andrew Bruce'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonAndrewBruce1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates production and creates creative entity (company) that has same name as existing creative entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									creditedMembers: [
										{
											name: 'Andrew Bruce',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonAndrewBruce2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing creative entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									creditedMembers: [
										{
											name: 'Andrew Bruce'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonAndrewBruce1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing creative entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									creditedMembers: [
										{
											name: 'Andrew Bruce',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.creativeCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonAndrewBruce2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Production crew entity (person) uniqueness in database', () => {

		const MRS_AFFLECK_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonTariqHussain1 = {
			model: 'person',
			name: 'Tariq Hussain',
			differentiator: '',
			errors: {}
		};

		const expectedPersonTariqHussain2 = {
			model: 'person',
			name: 'Tariq Hussain',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: MRS_AFFLECK_PRODUCTION_UUID,
				name: 'Mrs Affleck'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates crew entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${MRS_AFFLECK_PRODUCTION_UUID}`)
				.send({
					name: 'Mrs Affleck',
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Tariq Hussain'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0]).to.deep.equal(expectedPersonTariqHussain1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates production and creates crew entity (person) that has same name as existing crew entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${MRS_AFFLECK_PRODUCTION_UUID}`)
				.send({
					name: 'Mrs Affleck',
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Tariq Hussain',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0]).to.deep.equal(expectedPersonTariqHussain2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing crew entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${MRS_AFFLECK_PRODUCTION_UUID}`)
				.send({
					name: 'Mrs Affleck',
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Tariq Hussain'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0]).to.deep.equal(expectedPersonTariqHussain1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing crew entity (person) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${MRS_AFFLECK_PRODUCTION_UUID}`)
				.send({
					name: 'Mrs Affleck',
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Tariq Hussain',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0]).to.deep.equal(expectedPersonTariqHussain2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Production crew entity (company) uniqueness in database', () => {

		const THREE_SISTERS_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyCrewDeputiesLtd1 = {
			model: 'company',
			name: 'Crew Deputies Ltd',
			differentiator: '',
			errors: {},
			creditedMembers: [
				{
					model: 'person',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		const expectedCompanyCrewDeputiesLtd2 = {
			model: 'company',
			name: 'Crew Deputies Ltd',
			differentiator: '1',
			errors: {},
			creditedMembers: [
				{
					model: 'person',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: THREE_SISTERS_PRODUCTION_UUID,
				name: 'Three Sisters'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates crew entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${THREE_SISTERS_PRODUCTION_UUID}`)
				.send({
					name: 'Three Sisters',
					crewCredits: [
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'company',
									name: 'Crew Deputies Ltd'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0]).to.deep.equal(expectedCompanyCrewDeputiesLtd1);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('updates production and creates crew entity (company) that has same name as existing crew entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${THREE_SISTERS_PRODUCTION_UUID}`)
				.send({
					name: 'Three Sisters',
					crewCredits: [
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'company',
									name: 'Crew Deputies Ltd',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0]).to.deep.equal(expectedCompanyCrewDeputiesLtd2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates production and uses existing crew entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${THREE_SISTERS_PRODUCTION_UUID}`)
				.send({
					name: 'Three Sisters',
					crewCredits: [
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'company',
									name: 'Crew Deputies Ltd'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0]).to.deep.equal(expectedCompanyCrewDeputiesLtd1);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates production and uses existing crew entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${THREE_SISTERS_PRODUCTION_UUID}`)
				.send({
					name: 'Three Sisters',
					crewCredits: [
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'company',
									name: 'Crew Deputies Ltd',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0]).to.deep.equal(expectedCompanyCrewDeputiesLtd2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

	});

	describe('Production crew entity (company) credited member (person) uniqueness in database', () => {

		const HAMLET_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonMollyEinchcomb1 = {
			model: 'person',
			name: 'Molly Einchcomb',
			differentiator: '',
			errors: {}
		};

		const expectedPersonMollyEinchcomb2 = {
			model: 'person',
			name: 'Molly Einchcomb',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: HAMLET_PRODUCTION_UUID,
				name: 'Hamlet'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates crew entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'company',
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											name: 'Molly Einchcomb'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonMollyEinchcomb1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates production and creates crew entity (company) that has same name as existing crew entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'company',
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonMollyEinchcomb2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing crew entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'company',
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											name: 'Molly Einchcomb'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonMollyEinchcomb1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing crew entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'company',
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.crewCredits[0].entities[0].creditedMembers[0]).to.deep.equal(expectedPersonMollyEinchcomb2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

});
