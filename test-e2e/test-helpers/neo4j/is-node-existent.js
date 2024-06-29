import { neo4jQuery } from '../../../src/neo4j/query.js';

export default async opts => {

	const { label, name, uuid } = opts;

	const params = {
		...(name && { name }),
		...(uuid && { uuid })
	};

	const query = `
		MATCH (n:${label} { ${Object.keys(params).map(key => `${key}: $${key}`).join(', ')} })

		RETURN TOBOOLEAN(COUNT(n)) AS isExistent
	`;

	const { isExistent } = await neo4jQuery({ query, params });

	return isExistent;

};
