import { neo4jQuery } from '../../../src/neo4j/query.js';

export default async () => {

	const query = `
		MATCH (n)

		DETACH DELETE n
	`;

	await neo4jQuery({ query, params: {} }, { isOptionalResult: true });

};
