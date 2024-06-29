import directly from 'directly';

import { neo4jQuery } from './query.js';
import { MODEL_TO_NODE_LABEL_MAP } from '../utils/constants.js';

const INDEXABLE_LABELS = new Set([
	MODEL_TO_NODE_LABEL_MAP.AWARD,
	MODEL_TO_NODE_LABEL_MAP.CHARACTER,
	MODEL_TO_NODE_LABEL_MAP.COMPANY,
	MODEL_TO_NODE_LABEL_MAP.FESTIVAL,
	MODEL_TO_NODE_LABEL_MAP.FESTIVAL_SERIES,
	MODEL_TO_NODE_LABEL_MAP.MATERIAL,
	MODEL_TO_NODE_LABEL_MAP.PERSON,
	MODEL_TO_NODE_LABEL_MAP.SEASON,
	MODEL_TO_NODE_LABEL_MAP.VENUE
]);

const createIndex = async label => {

	const createIndexQuery = `CREATE INDEX FOR (n:${label}) ON (n.name)`;

	try {

		await neo4jQuery(
			{ query: createIndexQuery },
			{ isOptionalResult: true }
		);

		console.log(`Neo4j database: Index on name property created for ${label}`); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${createIndexQuery}': `, error); // eslint-disable-line no-console

	}

};

export default async () => {

	const callDbIndexesQuery = 'SHOW RANGE INDEXES WHERE owningConstraint IS NULL';

	try {

		const indexes = await neo4jQuery(
			{ query: callDbIndexesQuery },
			{ isOptionalResult: true, isArrayResult: true }
		);

		const labelsWithIndex =
			indexes
				.filter(index => index.properties?.includes('name'))
				.map(index => index.labelsOrTypes[0]);

		const labelsToIndex = [...INDEXABLE_LABELS].filter(label => !labelsWithIndex.includes(label));

		console.log('Neo4j database: Creating indexes…'); // eslint-disable-line no-console

		if (!labelsToIndex.length) {

			console.log('Neo4j database: No indexes required'); // eslint-disable-line no-console

			return;

		}

		const labelIndexFunctions = labelsToIndex.map(label => () => createIndex(label));

		await directly(1, labelIndexFunctions);

		console.log('Neo4j database: All indexes created'); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${callDbIndexesQuery}': `, error); // eslint-disable-line no-console

	}

};
