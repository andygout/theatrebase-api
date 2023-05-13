import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Database validation failures: Materials API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		context('sub-material is already assigned to another sur-material', () => {

			const SUR_GRAULT_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Material',
					uuid: SUR_GRAULT_MATERIAL_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: SUR_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: SUB_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.post('/materials')
					.send({
						name: 'Sur-Garply',
						subMaterials: [
							{
								name: 'Sub-Grault'
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					name: 'Sur-Garply',
					differentiator: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							model: 'MATERIAL',
							name: 'Sub-Grault',
							differentiator: '',
							errors: {
								name: [
									'Material with these attributes is already assigned to another sur-material'
								],
								differentiator: [
									'Material with these attributes is already assigned to another sur-material'
								]
							}
						}
					],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Sur-Garply'
				})).to.be.false;

			});

		});

		context('sub-material is the sur-most material of an existing three-tiered material collection', () => {

			const SUR_GRAULT_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const MID_GRAULT_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUB_GRAULT_MATERIAL_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Material',
					uuid: SUR_GRAULT_MATERIAL_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: MID_GRAULT_MATERIAL_UUID,
					name: 'Mid-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: SUR_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: MID_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: MID_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: SUB_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(3);

				const response = await chai.request(app)
					.post('/materials')
					.send({
						name: 'Sur-Sur-Grault',
						subMaterials: [
							{
								name: 'Sur-Grault'
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					name: 'Sur-Sur-Grault',
					differentiator: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							model: 'MATERIAL',
							name: 'Sur-Grault',
							differentiator: '',
							errors: {
								name: [
									'Material with these attributes is the sur-most material of a three-tiered material collection'
								],
								differentiator: [
									'Material with these attributes is the sur-most material of a three-tiered material collection'
								]
							}
						}
					],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(3);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Sur-Sur-Grault'
				})).to.be.false;

			});

		});

	});

	describe('attempt to update instance', () => {

		context('sub-material is instance\'s sur-material', () => {

			const SUR_GRAULT_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Material',
					uuid: SUR_GRAULT_MATERIAL_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: SUR_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: SUB_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.put(`/materials/${SUB_GRAULT_MATERIAL_UUID}`)
					.send({
						name: 'Sub-Grault',
						subMaterials: [
							{
								name: 'Sur-Grault'
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Grault',
					differentiator: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							model: 'MATERIAL',
							name: 'Sur-Grault',
							differentiator: '',
							errors: {
								name: [
									'Material with these attributes is this material\'s sur-material'
								],
								differentiator: [
									'Material with these attributes is this material\'s sur-material'
								]
							}
						}
					],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Sub-Grault',
					uuid: SUB_GRAULT_MATERIAL_UUID
				})).to.be.true;

			});

		});

		context('sub-material is already assigned to another sur-material', () => {

			const SUR_GRAULT_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUR_GARPLY_MATERIAL_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Material',
					uuid: SUR_GRAULT_MATERIAL_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: SUR_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: SUB_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

				await createNode({
					label: 'Material',
					uuid: SUR_GARPLY_MATERIAL_UUID,
					name: 'Sur-Garply'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(3);

				const response = await chai.request(app)
					.put(`/materials/${SUR_GARPLY_MATERIAL_UUID}`)
					.send({
						name: 'Sur-Garply',
						subMaterials: [
							{
								name: 'Sub-Grault'
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: SUR_GARPLY_MATERIAL_UUID,
					name: 'Sur-Garply',
					differentiator: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							model: 'MATERIAL',
							name: 'Sub-Grault',
							differentiator: '',
							errors: {
								name: [
									'Material with these attributes is already assigned to another sur-material'
								],
								differentiator: [
									'Material with these attributes is already assigned to another sur-material'
								]
							}
						}
					],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(3);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Sur-Garply',
					uuid: SUR_GARPLY_MATERIAL_UUID
				})).to.be.true;

			});

		});

		context('sub-material is the sur-most material of an existing three-tiered material collection', () => {

			const SUR_GRAULT_MATERIAL_UUID = 'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww';
			const MID_GRAULT_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUR_SUR_GRAULT_MATERIAL_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Material',
					uuid: SUR_GRAULT_MATERIAL_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: MID_GRAULT_MATERIAL_UUID,
					name: 'Mid-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: SUR_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: MID_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: MID_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: SUB_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

				await createNode({
					label: 'Material',
					uuid: SUR_SUR_GRAULT_MATERIAL_UUID,
					name: 'Sur-Sur-Grault'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(4);

				const response = await chai.request(app)
					.put(`/materials/${SUR_SUR_GRAULT_MATERIAL_UUID}`)
					.send({
						name: 'Sur-Sur-Grault',
						subMaterials: [
							{
								name: 'Sur-Grault'
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: SUR_SUR_GRAULT_MATERIAL_UUID,
					name: 'Sur-Sur-Grault',
					differentiator: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							model: 'MATERIAL',
							name: 'Sur-Grault',
							differentiator: '',
							errors: {
								name: [
									'Material with these attributes is the sur-most material of a three-tiered material collection'
								],
								differentiator: [
									'Material with these attributes is the sur-most material of a three-tiered material collection'
								]
							}
						}
					],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(4);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Sur-Sur-Grault',
					uuid: SUR_SUR_GRAULT_MATERIAL_UUID
				})).to.be.true;

			});

		});

		context('subject material is the sub-most material of an existing three-tiered material collection; a further sub-material tier is disallowed', () => {

			const SUR_GRAULT_MATERIAL_UUID = 'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww';
			const MID_GRAULT_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const SUB_GRAULT_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
			const SUB_SUB_GRAULT_MATERIAL_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Material',
					uuid: SUR_GRAULT_MATERIAL_UUID,
					name: 'Sur-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: MID_GRAULT_MATERIAL_UUID,
					name: 'Mid-Grault'
				});

				await createNode({
					label: 'Material',
					uuid: SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Grault'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: SUR_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: MID_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: MID_GRAULT_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: SUB_GRAULT_MATERIAL_UUID,
					relationshipName: 'HAS_SUB_MATERIAL'
				});

				await createNode({
					label: 'Material',
					uuid: SUB_SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Sub-Grault'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(4);

				const response = await chai.request(app)
					.put(`/materials/${SUB_GRAULT_MATERIAL_UUID}`)
					.send({
						name: 'Sub-Grault',
						subMaterials: [
							{
								name: 'Sub-Sub-Grault'
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: SUB_GRAULT_MATERIAL_UUID,
					name: 'Sub-Grault',
					differentiator: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					writingCredits: [],
					subMaterials: [
						{
							model: 'MATERIAL',
							name: 'Sub-Sub-Grault',
							differentiator: '',
							errors: {
								name: [
									'Sub-material cannot be assigned to a three-tiered material collection'
								],
								differentiator: [
									'Sub-material cannot be assigned to a three-tiered material collection'
								]
							}
						}
					],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(4);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Sub-Grault',
					uuid: SUB_GRAULT_MATERIAL_UUID
				})).to.be.true;

			});

		});

	});

});
