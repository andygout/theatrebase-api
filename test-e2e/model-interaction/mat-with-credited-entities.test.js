import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid.js';
import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { getStubUuid } from '../test-helpers/index.js';

chai.use(chaiHttp);

const XYZZY_MATERIAL_UUID = 'XYZZY_MATERIAL_UUID';
const FERDINAND_FOO_PERSON_UUID = 'FERDINAND_FOO_PERSON_UUID';
const STAGECRAFT_LTD_COMPANY_UUID = 'STAGECRAFT_LTD_COMPANY_UUID';

let material;
let person;
let company;

const sandbox = createSandbox();

describe('Material with entities credited multiple times', () => {

	before(async () => {

		const stubUuidCounts = {};

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Xyzzy',
				format: 'play',
				year: '2015',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					{
						name: 'additional material by',
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					}
				]
			});

		material = await chai.request(app)
			.get(`/materials/${XYZZY_MATERIAL_UUID}`);

		person = await chai.request(app)
			.get(`/people/${FERDINAND_FOO_PERSON_UUID}`);

		company = await chai.request(app)
			.get(`/companies/${STAGECRAFT_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Material', () => {

		it('includes writers of this material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: FERDINAND_FOO_PERSON_UUID,
							name: 'Ferdinand Foo'
						},
						{
							model: 'COMPANY',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'additional material by',
					entities: [
						{
							model: 'PERSON',
							uuid: FERDINAND_FOO_PERSON_UUID,
							name: 'Ferdinand Foo'
						},
						{
							model: 'COMPANY',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd'
						}
					]
				}
			];

			const { writingCredits } = material.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Person', () => {

		it('includes materials they have written, with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'additional material by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					]
				}
			];

			const { materials } = person.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Company', () => {

		it('includes materials it has written, with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'additional material by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					]
				}
			];

			const { materials } = company.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

});
