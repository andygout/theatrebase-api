import { expect } from 'chai';
import httpMocks from 'node-mocks-http';

import { sendJsonResponse } from '../../../src/lib/send-json-response.js';

describe('Send JSON Response module', () => {

	it('renders form page with requisite data', () => {

		const response = httpMocks.createResponse();
		sendJsonResponse(response, { instanceProperty: 'instanceValue' });
		expect(response.statusCode).to.equal(200);
		expect(response._getHeaders()).to.deep.equal({ 'content-type': 'application/json' }); // eslint-disable-line no-underscore-dangle
		expect(response._getData()).to.equal('{"instanceProperty":"instanceValue"}'); // eslint-disable-line no-underscore-dangle

	});

});
