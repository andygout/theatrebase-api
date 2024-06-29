import './dotenv.js';

import createNeo4jConstraints from './neo4j/create-constraints.js';
import createNeo4jFullTextIndexes from './neo4j/create-full-text-indexes.js';
import createNeo4jIndexes from './neo4j/create-indexes.js';
import { getDriver as getNeo4jDriver } from './neo4j/get-driver.js';

const neo4jDriver = getNeo4jDriver();

(async () => {

	await createNeo4jConstraints();

	await createNeo4jIndexes();

	await createNeo4jFullTextIndexes();

	await neo4jDriver.close();

	return;

})();
