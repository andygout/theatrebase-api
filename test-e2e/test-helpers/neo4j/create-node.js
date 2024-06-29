import { neo4jQuery } from '../../../src/neo4j/query.js';

export default async opts => {

	const { label, uuid, name } = opts;

	const params = { uuid, name };

	const query = `
		CREATE (n:${label} { uuid: $uuid, name: $name })

		RETURN n
	`;

	await neo4jQuery({ query, params });

	return;

};
