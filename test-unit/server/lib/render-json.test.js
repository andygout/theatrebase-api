import { expect } from 'chai';
import httpMocks from 'node-mocks-http';

import { renderJson } from '../../../server/lib/render-json';

describe('Render JSON module', () => {

	it('renders form page with requisite data', () => {

		const res = httpMocks.createResponse();
		renderJson(res, { instanceProperty: 'instanceValue' });
		expect(res.statusCode).to.eq(200);
		expect(res._getHeaders()).to.deep.eq({ 'content-type': 'application/json' });
		expect(res._getData()).to.eq('{"instanceProperty":"instanceValue"}');

	});

});