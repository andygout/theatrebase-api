import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

chai.use(chaiHttp);

describe('Non-existent instances: Materials API', () => {

	before(async () => {

		await purgeDatabase();

	});

	describe('requests for instances that do not exist in database', () => {

		const NON_EXISTENT_MATERIAL_UUID = 'foobar';

		describe('GET edit endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/materials/${NON_EXISTENT_MATERIAL_UUID}/edit`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('PUT update endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.put(`/materials/${NON_EXISTENT_MATERIAL_UUID}`)
					.send({ name: 'The Cherry Orchard' });

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('GET show endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/materials/${NON_EXISTENT_MATERIAL_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('DELETE delete endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.delete(`/materials/${NON_EXISTENT_MATERIAL_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

	});

});
