import { neo4jQuery } from '../../../src/neo4j/query.js';

export default async label => {

	const query = `
		RETURN COUNT { (n:${label}) } AS count
	`;

	const { count } = await neo4jQuery({ query, params: {} });

	return count;

};
