import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app.js';
import { countNodesWithLabel, createNode, purgeDatabase } from '../test-helpers/neo4j/index.js';

chai.use(chaiHttp);

const sandbox = createSandbox();

describe('Uniqueness in database: Award ceremonies API', () => {

	describe('Award ceremony award uniqueness in database', () => {

		const TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedAwardCriticsCircleTheatreAwards1 = {
			model: 'AWARD',
			name: 'Critics\' Circle Theatre Awards',
			differentiator: '',
			errors: {}
		};

		const expectedAwardCriticsCircleTheatreAwards2 = {
			model: 'AWARD',
			name: 'Critics\' Circle Theatre Awards',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				name: '2020'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates award ceremony and creates award that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(0);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: 'Critics\' Circle Theatre Awards'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.award).to.deep.equal(expectedAwardCriticsCircleTheatreAwards1);
			expect(await countNodesWithLabel('Award')).to.equal(1);

		});

		it('updates award ceremony and creates award that has same name as existing award but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(1);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: 'Critics\' Circle Theatre Awards',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.award).to.deep.equal(expectedAwardCriticsCircleTheatreAwards2);
			expect(await countNodesWithLabel('Award')).to.equal(2);

		});

		it('updates award ceremony and uses existing award that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(2);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: 'Critics\' Circle Theatre Awards'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.award).to.deep.equal(expectedAwardCriticsCircleTheatreAwards1);
			expect(await countNodesWithLabel('Award')).to.equal(2);

		});

		it('updates award ceremony and uses existing award that has a differentiator', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(2);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: 'Critics\' Circle Theatre Awards',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.award).to.deep.equal(expectedAwardCriticsCircleTheatreAwards2);
			expect(await countNodesWithLabel('Award')).to.equal(2);

		});

	});

	describe('Award ceremony nominee entity (person) uniqueness in database', () => {

		const TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonChristopherShutt1 = {
			model: 'PERSON',
			name: 'Christopher Shutt',
			differentiator: '',
			errors: {}
		};

		const expectedPersonChristopherShutt2 = {
			model: 'PERSON',
			name: 'Christopher Shutt',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
				name: '2010'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates award ceremony and creates nominee entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0]).to.deep.equal(expectedPersonChristopherShutt1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates award ceremony and creates nominee entity (person) that has same name as existing nominee entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0]).to.deep.equal(expectedPersonChristopherShutt2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates award ceremony and uses existing nominee entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0]).to.deep.equal(expectedPersonChristopherShutt1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates award ceremony and uses existing nominee entity (person) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0]).to.deep.equal(expectedPersonChristopherShutt2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Award ceremony nominee entity (company) uniqueness in database', () => {

		const TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyAutograph1 = {
			model: 'COMPANY',
			name: 'Autograph',
			differentiator: '',
			errors: {},
			members: [
				{
					model: 'PERSON',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		const expectedCompanyAutograph2 = {
			model: 'COMPANY',
			name: 'Autograph',
			differentiator: '1',
			errors: {},
			members: [
				{
					model: 'PERSON',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
				name: '2010'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates award ceremony and creates nominee entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(0);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0]).to.deep.equal(expectedCompanyAutograph1);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('updates award ceremony and creates nominee entity (company) that has same name as existing nominee entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0]).to.deep.equal(expectedCompanyAutograph2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates award ceremony and uses existing nominee entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0]).to.deep.equal(expectedCompanyAutograph1);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates award ceremony and uses existing nominee entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0]).to.deep.equal(expectedCompanyAutograph2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

	});

	describe('Award ceremony nominee entity (company) credited member (person) uniqueness in database', () => {

		const TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonIanDickinson1 = {
			model: 'PERSON',
			name: 'Ian Dickinson',
			differentiator: '',
			errors: {}
		};

		const expectedPersonIanDickinson2 = {
			model: 'PERSON',
			name: 'Ian Dickinson',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
				name: '2010'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates award ceremony and creates nominee entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson'
												}
											]
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0].members[0]).to.deep.equal(expectedPersonIanDickinson1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates award ceremony and creates nominee entity (company) that has same name as existing nominee entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson',
													differentiator: '1'
												}
											]
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0].members[0]).to.deep.equal(expectedPersonIanDickinson2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates award ceremony and uses existing nominee entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson'
												}
											]
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0].members[0]).to.deep.equal(expectedPersonIanDickinson1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates award ceremony and uses existing nominee entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson',
													differentiator: '1'
												}
											]
										}
									]
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.categories[0].nominations[0].entities[0].members[0]).to.deep.equal(expectedPersonIanDickinson2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

});
