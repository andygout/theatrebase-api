import directly from 'directly';

import { neo4jQuery } from './query.js';
import { MODEL_TO_NODE_LABEL_MAP } from '../utils/constants.js';

const NAMES_FULL_TEXT_INDEX_NAME = 'names';

const FULL_TEXT_INDEX_NAME_TO_PROPERTY_MAP = {
	[NAMES_FULL_TEXT_INDEX_NAME]: 'name'
};

const FULL_TEXT_INDEX_NAME_TO_LABELS_MAP = {
	[NAMES_FULL_TEXT_INDEX_NAME]: new Set([
		MODEL_TO_NODE_LABEL_MAP.AWARD,
		MODEL_TO_NODE_LABEL_MAP.AWARD_CEREMONY,
		MODEL_TO_NODE_LABEL_MAP.CHARACTER,
		MODEL_TO_NODE_LABEL_MAP.COMPANY,
		MODEL_TO_NODE_LABEL_MAP.FESTIVAL,
		MODEL_TO_NODE_LABEL_MAP.FESTIVAL_SERIES,
		MODEL_TO_NODE_LABEL_MAP.MATERIAL,
		MODEL_TO_NODE_LABEL_MAP.PERSON,
		MODEL_TO_NODE_LABEL_MAP.PRODUCTION,
		MODEL_TO_NODE_LABEL_MAP.SEASON,
		MODEL_TO_NODE_LABEL_MAP.VENUE
	])
};

const FULL_TEXT_INDEX_NAMES = new Set([
	NAMES_FULL_TEXT_INDEX_NAME
]);

const createFullTextIndex = async fullTextIndexName => {

	const dropFullTextIndexQuery = 'DROP INDEX $name IF EXISTS';

	const params = {
		name: fullTextIndexName
	};

	const pipeSeparatedLabels = [...FULL_TEXT_INDEX_NAME_TO_LABELS_MAP[fullTextIndexName]].join('|');

	const property = FULL_TEXT_INDEX_NAME_TO_PROPERTY_MAP[fullTextIndexName];

	const createFullTextIndexQuery =
		`CREATE FULLTEXT INDEX $name FOR (n:${pipeSeparatedLabels}) ON EACH [n.${property}]`;

	try {

		await neo4jQuery(
			{
				query: dropFullTextIndexQuery,
				params
			},
			{
				isOptionalResult: true
			}
		);

		console.log(`Neo4j database: Full-text index ${fullTextIndexName} has been dropped (if pre-existing)`); // eslint-disable-line no-console

		await neo4jQuery(
			{
				query: createFullTextIndexQuery,
				params
			},
			{
				isOptionalResult: true
			}
		);

		const commaSeparatedLabels = [...FULL_TEXT_INDEX_NAME_TO_LABELS_MAP[fullTextIndexName]].join(',');

		console.log(`Neo4j database: Full-text index '${fullTextIndexName}' has been created on the ${property} property for labels: ${commaSeparatedLabels}`); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${createFullTextIndexQuery}': `, error); // eslint-disable-line no-console

	}

};

export default async () => {

	const callDbIndexesQuery = 'SHOW FULLTEXT INDEXES';

	try {

		const fullTextIndexes = await neo4jQuery(
			{ query: callDbIndexesQuery },
			{ isOptionalResult: true, isArrayResult: true }
		);

		const fullTextIndexesToCreate =
			[...FULL_TEXT_INDEX_NAMES]
				.filter(fullTextIndexName => {
					const fullTextIndex =
						fullTextIndexes.find(fullTextIndex => fullTextIndex.name === fullTextIndexName);

					if (!fullTextIndex) return true;

					const isFullTextIndexLackingLabels =
						![...FULL_TEXT_INDEX_NAME_TO_LABELS_MAP[fullTextIndexName]]
							.every(label => fullTextIndex.labelsOrTypes.includes(label));

					if (isFullTextIndexLackingLabels) return true;

					return false;
				});

		console.log('Neo4j database: Creating full-text indexes…'); // eslint-disable-line no-console

		if (!fullTextIndexesToCreate.length) {

			console.log('Neo4j database: No full-text indexes required'); // eslint-disable-line no-console

			return;

		}

		const fullTextIndexFunctions =
			fullTextIndexesToCreate.map(fullTextIndexName => () => createFullTextIndex(fullTextIndexName));

		await directly(1, fullTextIndexFunctions);

		console.log('Neo4j database: All full-text indexes created'); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${callDbIndexesQuery}': `, error); // eslint-disable-line no-console

	}

};
