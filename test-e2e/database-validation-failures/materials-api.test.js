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

describe('Database validation failures: Materials API', () => {

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
					subtitle: '',
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
					subtitle: '',
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
					subtitle: '',
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
					subtitle: '',
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
					subtitle: '',
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
					subtitle: '',
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

		context('original version material is instance\'s subsequent version material', () => {

			const PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const UR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Material',
					uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Plugh'
				});

				await createNode({
					label: 'Material',
					uuid: UR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ur-Plugh'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: UR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID,
					relationshipName: 'SUBSEQUENT_VERSION_OF'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.put(`/materials/${UR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`)
					.send({
						name: 'Ur-Plugh',
						originalVersionMaterial: {
							name: 'Plugh'
						}
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: UR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Ur-Plugh',
					differentiator: '',
					subtitle: '',
					format: '',
					year: '',
					hasErrors: true,
					errors: {},
					originalVersionMaterial: {
						model: 'MATERIAL',
						name: 'Plugh',
						differentiator: '',
						errors: {
							name: [
								'Material with these attributes is this material\'s subsequent version material'
							],
							differentiator: [
								'Material with these attributes is this material\'s subsequent version material'
							]
						}
					},
					writingCredits: [],
					subMaterials: [],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Ur-Plugh',
					uuid: UR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID
				})).to.be.true;

			});

		});

		context('source material is instance\'s sourcing material', () => {

			const WIBBLE_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const WALDO_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {

				await purgeDatabase();

				await createNode({
					label: 'Material',
					uuid: WIBBLE_MATERIAL_UUID,
					name: 'Wibble'
				});

				await createNode({
					label: 'Material',
					uuid: WALDO_MATERIAL_UUID,
					name: 'Waldo'
				});

				await createRelationship({
					sourceLabel: 'Material',
					sourceUuid: WIBBLE_MATERIAL_UUID,
					destinationLabel: 'Material',
					destinationUuid: WALDO_MATERIAL_UUID,
					relationshipName: 'USES_SOURCE_MATERIAL'
				});

			});

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Material')).to.equal(2);

				const response = await chai.request(app)
					.put(`/materials/${WALDO_MATERIAL_UUID}`)
					.send({
						name: 'Waldo',
						writingCredits: [
							{
								entities: [
									{
										model: 'MATERIAL',
										name: 'Wibble'
									}
								]
							}
						]
					});

				const expectedResponseBody = {
					model: 'MATERIAL',
					uuid: WALDO_MATERIAL_UUID,
					name: 'Waldo',
					differentiator: '',
					subtitle: '',
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
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: '',
							creditType: null,
							errors: {},
							entities: [
								{
									model: 'MATERIAL',
									name: 'Wibble',
									differentiator: '',
									errors: {
										name: [
											'Material with these attributes is this material\'s sourcing material'
										],
										differentiator: [
											'Material with these attributes is this material\'s sourcing material'
										]
									}
								}
							]
						}
					],
					subMaterials: [],
					characterGroups: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Material')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Material',
					name: 'Waldo',
					uuid: WALDO_MATERIAL_UUID
				})).to.be.true;

			});

		});

	});

});
