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

describe('Instance validation failures: Characters API', () => {

	describe('attempt to create instance', () => {

		const ORSINO_CHARACTER_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Character',
				uuid: ORSINO_CHARACTER_UUID,
				name: 'Orsino'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(1);

				const response = await chai.request(app)
					.post('/characters')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'CHARACTER',
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
				expect(await countNodesWithLabel('Character')).to.equal(1);

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(1);

				const response = await chai.request(app)
					.post('/characters')
					.send({
						name: 'Orsino'
					});

				const expectedResponseBody = {
					model: 'CHARACTER',
					name: 'Orsino',
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
				expect(await countNodesWithLabel('Character')).to.equal(1);

			});

		});

	});

	describe('attempt to update instance', () => {

		const VIOLA_CHARACTER_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const ORSINO_CHARACTER_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Character',
				uuid: VIOLA_CHARACTER_UUID,
				name: 'Viola'
			});

			await createNode({
				label: 'Character',
				uuid: ORSINO_CHARACTER_UUID,
				name: 'Orsino'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(2);

				const response = await chai.request(app)
					.put(`/characters/${VIOLA_CHARACTER_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'CHARACTER',
					uuid: VIOLA_CHARACTER_UUID,
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
				expect(await countNodesWithLabel('Character')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Character',
					name: 'Viola',
					uuid: VIOLA_CHARACTER_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(2);

				const response = await chai.request(app)
					.put(`/characters/${VIOLA_CHARACTER_UUID}`)
					.send({
						name: 'Orsino'
					});

				const expectedResponseBody = {
					model: 'CHARACTER',
					uuid: VIOLA_CHARACTER_UUID,
					name: 'Orsino',
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
				expect(await countNodesWithLabel('Character')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Character',
					name: 'Viola',
					uuid: VIOLA_CHARACTER_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const VIOLA_CHARACTER_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const TWELFTH_NIGHT_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Character',
				uuid: VIOLA_CHARACTER_UUID,
				name: 'Viola'
			});

			await createNode({
				label: 'Material',
				uuid: TWELFTH_NIGHT_MATERIAL_UUID,
				name: 'Twelfth Night'
			});

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: TWELFTH_NIGHT_MATERIAL_UUID,
				destinationLabel: 'Character',
				destinationUuid: VIOLA_CHARACTER_UUID,
				relationshipName: 'HAS_CHARACTER'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/characters/${VIOLA_CHARACTER_UUID}`);

				const expectedResponseBody = {
					model: 'CHARACTER',
					uuid: VIOLA_CHARACTER_UUID,
					name: 'Viola',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: [
							'Material'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Character')).to.equal(1);

			});

		});

	});

});
