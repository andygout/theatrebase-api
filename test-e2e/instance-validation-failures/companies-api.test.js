import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app.js';
import {
	countNodesWithLabel,
	createNode,
	createRelationship,
	isNodeExistent,
	purgeDatabase
} from '../test-helpers/neo4j/index.js';

chai.use(chaiHttp);

describe('Instance validation failures: Companies API', () => {

	describe('attempt to create instance', () => {

		const DONMAR_WAREHOUSE_PROJECTS_COMPANY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Company',
				uuid: DONMAR_WAREHOUSE_PROJECTS_COMPANY_UUID,
				name: 'Donmar Warehouse Projects'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Company')).to.equal(1);

				const response = await chai.request(app)
					.post('/companies')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'COMPANY',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Company')).to.equal(1);

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Company')).to.equal(1);

				const response = await chai.request(app)
					.post('/companies')
					.send({
						name: 'Donmar Warehouse Projects'
					});

				const expectedResponseBody = {
					model: 'COMPANY',
					name: 'Donmar Warehouse Projects',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Company')).to.equal(1);

			});

		});

	});

	describe('attempt to update instance', () => {

		const SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const DONMAR_WAREHOUSE_PROJECTS_COMPANY_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Company',
				uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
				name: 'Shakespeare Globe Trust'
			});

			await createNode({
				label: 'Company',
				uuid: DONMAR_WAREHOUSE_PROJECTS_COMPANY_UUID,
				name: 'Donmar Warehouse Projects'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Company')).to.equal(2);

				const response = await chai.request(app)
					.put(`/companies/${SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'COMPANY',
					uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Company')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Company',
					name: 'Shakespeare Globe Trust',
					uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Company')).to.equal(2);

				const response = await chai.request(app)
					.put(`/companies/${SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID}`)
					.send({
						name: 'Donmar Warehouse Projects'
					});

				const expectedResponseBody = {
					model: 'COMPANY',
					uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
					name: 'Donmar Warehouse Projects',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Company')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Company',
					name: 'Shakespeare Globe Trust',
					uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const A_MIDSUMMER_NIGHTS_DREAM_GLOBE_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Company',
				uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
				name: 'Shakespeare Globe Trust'
			});

			await createNode({
				label: 'Production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_GLOBE_PRODUCTION_UUID,
				name: 'A Midsummer Night\'s Dream'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: A_MIDSUMMER_NIGHTS_DREAM_GLOBE_PRODUCTION_UUID,
				destinationLabel: 'Company',
				destinationUuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
				relationshipName: 'PRODUCED_BY'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Company')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/companies/${SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID}`);

				const expectedResponseBody = {
					model: 'COMPANY',
					uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
					name: 'Shakespeare Globe Trust',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: [
							'Production'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Company')).to.equal(1);

			});

		});

	});

});
