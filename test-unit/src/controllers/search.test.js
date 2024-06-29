import { expect } from 'chai';
import esmock from 'esmock';
import httpMocks from 'node-mocks-http';
import { assert, stub } from 'sinon';

describe('Search controller', () => {

	let stubs;

	beforeEach(() => {

		stubs = {
			sendJsonResponseModule: {
				sendJsonResponse: stub().returns('sendJsonResponse response')
			},
			cypherQueriesModule: {
				searchQueries: {
					getSearchQuery: stub().returns('getSearchQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().returns(['foo bar'])
			},
			request: httpMocks.createRequest({ query: { searchTerm: 'foo' } }),
			response: httpMocks.createResponse(),
			next: stub()
		};

	});

	const createSubject = () =>
		esmock('../../../src/controllers/search.js', {
			'../../../src/lib/send-json-response.js': stubs.sendJsonResponseModule,
			'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
			'../../../src/neo4j/query.js': stubs.neo4jQueryModule
		});

	context('searchTerm is not present in request.query', () => {

		it('calls sendJsonResponse with the response object and an empty array; does not call neo4jQuery', async () => {

			const searchController = await createSubject();
			const request = httpMocks.createRequest();
			const result = await searchController(request, stubs.response, stubs.next);
			assert.calledOnceWithExactly(
				stubs.sendJsonResponseModule.sendJsonResponse,
				stubs.response, []
			);
			expect(result).to.equal('sendJsonResponse response');
			assert.notCalled(stubs.neo4jQueryModule.neo4jQuery);
			assert.notCalled(stubs.cypherQueriesModule.searchQueries.getSearchQuery);
			assert.notCalled(stubs.next);

		});

	});

	context('searchTerm is present in request.query and is an empty string', () => {

		it('calls sendJsonResponse with the response object and an empty array; does not call neo4jQuery', async () => {

			const searchController = await createSubject();
			const request = httpMocks.createRequest({ query: { searchTerm: '' } });
			const result = await searchController(request, stubs.response, stubs.next);
			assert.calledOnceWithExactly(
				stubs.sendJsonResponseModule.sendJsonResponse,
				stubs.response, []
			);
			expect(result).to.equal('sendJsonResponse response');
			assert.notCalled(stubs.neo4jQueryModule.neo4jQuery);
			assert.notCalled(stubs.cypherQueriesModule.searchQueries.getSearchQuery);
			assert.notCalled(stubs.next);

		});

	});

	context('searchTerm is present in request.query and is a non-empty string', () => {

		context('neo4jQuery responds as expected', () => {

			it('calls getSearchQuery, neo4jQuery, then sendJsonResponse with the response object and the neo4jQuery response', async () => {

				const searchController = await createSubject();
				const result = await searchController(stubs.request, stubs.response, stubs.next);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.searchQueries.getSearchQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSearchQuery response',
						params: {
							searchTerm: 'foo'
						}
					},
					{
						isOptionalResult: true,
						isArrayResult: true
					}
				);
				assert.calledOnceWithExactly(
					stubs.sendJsonResponseModule.sendJsonResponse,
					stubs.response, ['foo bar']
				);
				expect(result).to.equal('sendJsonResponse response');
				assert.notCalled(stubs.next);

			});

		});

		context('neo4jQuery throws an error', () => {

			it('calls getSearchQuery, neo4jQuery, then next with the error object', async () => {

				const neo4jQueryError = new Error('neo4jQuery error');
				stubs.neo4jQueryModule.neo4jQuery.rejects(neo4jQueryError);

				const searchController = await createSubject();
				await searchController(stubs.request, stubs.response, stubs.next);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.searchQueries.getSearchQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSearchQuery response',
						params: {
							searchTerm: 'foo'
						}
					},
					{
						isOptionalResult: true,
						isArrayResult: true
					}
				);
				assert.notCalled(stubs.sendJsonResponseModule.sendJsonResponse);
				assert.calledOnceWithExactly(stubs.next, neo4jQueryError);

			});

		});

	});

});
