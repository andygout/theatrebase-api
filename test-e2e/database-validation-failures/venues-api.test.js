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

describe('Database validation failures: Venues API', () => {

	describe('attempt to create instance', () => {

		context('sub-venue is already assigned to another sur-venue', () => {

			const SUR_FOO_THEATRE_VENUE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_FOO_THEATRE_VENUE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Venue',
					uuid: SUR_FOO_THEATRE_VENUE_UUID,
					name: 'Sur-Foo Theatre'
				});

				await createNode({
					label: 'Venue',
					uuid: SUB_FOO_THEATRE_VENUE_UUID,
					name: 'Sub-Foo Theatre'
				});

				await createRelationship({
					sourceLabel: 'Venue',
					sourceUuid: SUR_FOO_THEATRE_VENUE_UUID,
					destinationLabel: 'Venue',
					destinationUuid: SUB_FOO_THEATRE_VENUE_UUID,
					relationshipName: 'HAS_SUB_VENUE'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Venue')).to.equal(2);

				const response = await chai.request(app)
					.post('/venues')
					.send({
						name: 'Sur-Bar Theatre',
						subVenues: [
							{
								name: 'Sub-Foo Theatre'
							}
						]
					});

				const expectedResponseBody = {
					model: 'VENUE',
					name: 'Sur-Bar Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							model: 'VENUE',
							name: 'Sub-Foo Theatre',
							differentiator: '',
							errors: {
								name: [
									'Venue with these attributes is already assigned to another sur-venue'
								],
								differentiator: [
									'Venue with these attributes is already assigned to another sur-venue'
								]
							}
						}
					]
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Venue')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Venue',
					name: 'Sur-Bar Theatre'
				})).to.be.false;

			});

		});

		context('sub-venue is the sur-most venue of an existing two-tiered venue collection', () => {

			const SUR_FOO_THEATRE_VENUE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_FOO_THEATRE_VENUE_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Venue',
					uuid: SUR_FOO_THEATRE_VENUE_UUID,
					name: 'Sur-Foo Theatre'
				});

				await createNode({
					label: 'Venue',
					uuid: SUB_FOO_THEATRE_VENUE_UUID,
					name: 'Sub-Foo Theatre'
				});

				await createRelationship({
					sourceLabel: 'Venue',
					sourceUuid: SUR_FOO_THEATRE_VENUE_UUID,
					destinationLabel: 'Venue',
					destinationUuid: SUB_FOO_THEATRE_VENUE_UUID,
					relationshipName: 'HAS_SUB_VENUE'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Venue')).to.equal(2);

				const response = await chai.request(app)
					.post('/venues')
					.send({
						name: 'Sur-Sur-Foo Theatre',
						subVenues: [
							{
								name: 'Sur-Foo Theatre'
							}
						]
					});

				const expectedResponseBody = {
					model: 'VENUE',
					name: 'Sur-Sur-Foo Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							model: 'VENUE',
							name: 'Sur-Foo Theatre',
							differentiator: '',
							errors: {
								name: [
									'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
								],
								differentiator: [
									'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
								]
							}
						}
					]
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Venue')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Venue',
					name: 'Sur-Sur-Foo Theatre'
				})).to.be.false;

			});

		});

	});

	describe('attempt to update instance', () => {

		context('sub-venue is already assigned to another sur-venue', () => {

			const SUR_FOO_THEATRE_VENUE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_FOO_THEATRE_VENUE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUR_BAR_VENUE_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Venue',
					uuid: SUR_FOO_THEATRE_VENUE_UUID,
					name: 'Sur-Foo Theatre'
				});

				await createNode({
					label: 'Venue',
					uuid: SUB_FOO_THEATRE_VENUE_UUID,
					name: 'Sub-Foo Theatre'
				});

				await createRelationship({
					sourceLabel: 'Venue',
					sourceUuid: SUR_FOO_THEATRE_VENUE_UUID,
					destinationLabel: 'Venue',
					destinationUuid: SUB_FOO_THEATRE_VENUE_UUID,
					relationshipName: 'HAS_SUB_VENUE'
				});

				await createNode({
					label: 'Venue',
					uuid: SUR_BAR_VENUE_UUID,
					name: 'Sur-Bar Theatre'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Venue')).to.equal(3);

				const response = await chai.request(app)
					.put(`/venues/${SUR_BAR_VENUE_UUID}`)
					.send({
						name: 'Sur-Bar Theatre',
						subVenues: [
							{
								name: 'Sub-Foo Theatre'
							}
						]
					});

				const expectedResponseBody = {
					model: 'VENUE',
					uuid: SUR_BAR_VENUE_UUID,
					name: 'Sur-Bar Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							model: 'VENUE',
							name: 'Sub-Foo Theatre',
							differentiator: '',
							errors: {
								name: [
									'Venue with these attributes is already assigned to another sur-venue'
								],
								differentiator: [
									'Venue with these attributes is already assigned to another sur-venue'
								]
							}
						}
					]
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Venue')).to.equal(3);
				expect(await isNodeExistent({
					label: 'Venue',
					name: 'Sur-Bar Theatre',
					uuid: SUR_BAR_VENUE_UUID
				})).to.be.true;

			});

		});

		context('sub-venue is the sur-most venue of an existing two-tiered venue collection', () => {

			const SUR_FOO_THEATRE_VENUE_UUID = 'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww';
			const SUB_FOO_THEATRE_VENUE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUR_SUR_FOO_THEATRE_VENUE_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Venue',
					uuid: SUR_FOO_THEATRE_VENUE_UUID,
					name: 'Sur-Foo Theatre'
				});

				await createNode({
					label: 'Venue',
					uuid: SUB_FOO_THEATRE_VENUE_UUID,
					name: 'Sub-Foo Theatre'
				});

				await createRelationship({
					sourceLabel: 'Venue',
					sourceUuid: SUR_FOO_THEATRE_VENUE_UUID,
					destinationLabel: 'Venue',
					destinationUuid: SUB_FOO_THEATRE_VENUE_UUID,
					relationshipName: 'HAS_SUB_VENUE'
				});

				await createNode({
					label: 'Venue',
					uuid: SUR_SUR_FOO_THEATRE_VENUE_UUID,
					name: 'Sur-Sur-Foo Theatre'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Venue')).to.equal(3);

				const response = await chai.request(app)
					.put(`/venues/${SUR_SUR_FOO_THEATRE_VENUE_UUID}`)
					.send({
						name: 'Sur-Sur-Foo Theatre',
						subVenues: [
							{
								name: 'Sur-Foo Theatre'
							}
						]
					});

				const expectedResponseBody = {
					model: 'VENUE',
					uuid: SUR_SUR_FOO_THEATRE_VENUE_UUID,
					name: 'Sur-Sur-Foo Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							model: 'VENUE',
							name: 'Sur-Foo Theatre',
							differentiator: '',
							errors: {
								name: [
									'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
								],
								differentiator: [
									'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
								]
							}
						}
					]
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Venue')).to.equal(3);
				expect(await isNodeExistent({
					label: 'Venue',
					name: 'Sur-Sur-Foo Theatre',
					uuid: SUR_SUR_FOO_THEATRE_VENUE_UUID
				})).to.be.true;

			});

		});

		context('subject venue is the sub-most venue of an existing two-tiered venue collection; a further sub-venue tier is disallowed', () => {

			const SUR_FOO_THEATRE_VENUE_UUID = 'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww';
			const SUB_FOO_THEATRE_VENUE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUB_SUB_FOO_THEATRE_VENUE_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Venue',
					uuid: SUR_FOO_THEATRE_VENUE_UUID,
					name: 'Sur-Foo Theatre'
				});

				await createNode({
					label: 'Venue',
					uuid: SUB_FOO_THEATRE_VENUE_UUID,
					name: 'Sub-Foo Theatre'
				});

				await createRelationship({
					sourceLabel: 'Venue',
					sourceUuid: SUR_FOO_THEATRE_VENUE_UUID,
					destinationLabel: 'Venue',
					destinationUuid: SUB_FOO_THEATRE_VENUE_UUID,
					relationshipName: 'HAS_SUB_VENUE'
				});

				await createNode({
					label: 'Venue',
					uuid: SUB_SUB_FOO_THEATRE_VENUE_UUID,
					name: 'Sub-Sub-Foo Theatre'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Venue')).to.equal(3);

				const response = await chai.request(app)
					.put(`/venues/${SUB_FOO_THEATRE_VENUE_UUID}`)
					.send({
						name: 'Sub-Foo Theatre',
						subVenues: [
							{
								name: 'Sub-Sub-Foo Theatre'
							}
						]
					});

				const expectedResponseBody = {
					model: 'VENUE',
					uuid: SUB_FOO_THEATRE_VENUE_UUID,
					name: 'Sub-Foo Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							model: 'VENUE',
							name: 'Sub-Sub-Foo Theatre',
							differentiator: '',
							errors: {
								name: [
									'Sub-venue cannot be assigned to a two-tiered venue collection'
								],
								differentiator: [
									'Sub-venue cannot be assigned to a two-tiered venue collection'
								]
							}
						}
					]
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Venue')).to.equal(3);
				expect(await isNodeExistent({
					label: 'Venue',
					name: 'Sub-Foo Theatre',
					uuid: SUB_FOO_THEATRE_VENUE_UUID
				})).to.be.true;

			});

		});

	});

});
