import { sendJsonResponse } from '../lib/send-json-response.js';
import { searchQueries } from '../neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../neo4j/query.js';

export default async (request, response, next) => {

	try {

		const searchTerm = request.query.searchTerm;

		if (!searchTerm) return sendJsonResponse(response, []);

		const { getSearchQuery } = searchQueries;

		const searchResults = await neo4jQuery(
			{
				query: getSearchQuery(),
				params: { searchTerm }
			},
			{
				isOptionalResult: true,
				isArrayResult: true
			}
		);

		return sendJsonResponse(response, searchResults);

	} catch (error) {

		return next(error);

	}

};
