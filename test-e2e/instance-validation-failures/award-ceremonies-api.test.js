import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Instance validation failures: Award ceremonies API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		const TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				name: '2020'
			});

			await createNode({
				label: 'Award',
				uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				name: 'Laurence Olivier Awards'
			});

			await createRelationship({
				sourceLabel: 'Award',
				sourceUuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				destinationLabel: 'AwardCeremony',
				destinationUuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				relationshipName: 'PRESENTED_AT'
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

				const response = await chai.request(app)
					.post('/awards/ceremonies')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'awardCeremony',
					name: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					award: {
						model: 'award',
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

				const response = await chai.request(app)
					.post('/awards/ceremonies')
					.send({
						name: '2020',
						award: {
							name: 'Laurence Olivier Awards'
						}
					});

				const expectedResponseBody = {
					model: 'awardCeremony',
					name: '2020',
					hasErrors: true,
					errors: {
						name: [
							'Award ceremony already exists for given award'
						]
					},
					award: {
						model: 'award',
						name: 'Laurence Olivier Awards',
						differentiator: '',
						errors: {
							name: [
								'Award ceremony already exists for given award'
							],
							differentiator: [
								'Award ceremony already exists for given award'
							]
						}
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			});

		});

	});

	describe('attempt to update instance', () => {

		const TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
				name: '2019'
			});

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				name: '2020'
			});

			await createNode({
				label: 'Award',
				uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				name: 'Laurence Olivier Awards'
			});

			await createRelationship({
				sourceLabel: 'Award',
				sourceUuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				destinationLabel: 'AwardCeremony',
				destinationUuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				relationshipName: 'PRESENTED_AT'
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('AwardCeremony')).to.equal(2);

				const response = await chai.request(app)
					.put(`/awards/ceremonies/${TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'awardCeremony',
					uuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					award: {
						model: 'award',
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('AwardCeremony')).to.equal(2);
				expect(await isNodeExistent({
					label: 'AwardCeremony',
					name: '2019',
					uuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('AwardCeremony')).to.equal(2);

				const response = await chai.request(app)
					.put(`/awards/ceremonies/${TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID}`)
					.send({
						name: '2020',
						award: {
							name: 'Laurence Olivier Awards'
						}
					});

				const expectedResponseBody = {
					model: 'awardCeremony',
					uuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2020',
					hasErrors: true,
					errors: {
						name: [
							'Award ceremony already exists for given award'
						]
					},
					award: {
						model: 'award',
						name: 'Laurence Olivier Awards',
						differentiator: '',
						errors: {
							name: [
								'Award ceremony already exists for given award'
							],
							differentiator: [
								'Award ceremony already exists for given award'
							]
						}
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('AwardCeremony')).to.equal(2);
				expect(await isNodeExistent({
					label: 'AwardCeremony',
					name: '2019',
					uuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
				name: '2019'
			});

			await createNode({
				label: 'Award',
				uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
				name: 'Evening Standard Theatre Awards'
			});

			await createRelationship({
				sourceLabel: 'Award',
				sourceUuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
				destinationLabel: 'AwardCeremony',
				destinationUuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
				relationshipName: 'PRESENTED_AT'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/awards/ceremonies/${TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID}`);

				const expectedResponseBody = {
					model: 'awardCeremony',
					uuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019',
					hasErrors: true,
					errors: {
						associations: [
							'Award'
						]
					},
					award: {
						model: 'award',
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			});

		});

	});

});