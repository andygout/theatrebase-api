import directly from 'directly';

import { neo4jQuery } from './query.js';
import { MODEL_TO_NODE_LABEL_MAP } from '../utils/constants.js';

const CONSTRAINABLE_LABELS = new Set([
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
]);

const createConstraint = async label => {

	const createConstraintQuery = `CREATE CONSTRAINT FOR (node:${label}) REQUIRE node.uuid IS UNIQUE`;

	try {

		await neo4jQuery(
			{ query: createConstraintQuery },
			{ isOptionalResult: true }
		);

		console.log(`Neo4j database: Constraint on uuid property created for ${label}`); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${createConstraintQuery}': `, error); // eslint-disable-line no-console

	}

};

export default async () => {

	const callDbConstraintsQuery = 'SHOW CONSTRAINTS';

	try {

		const constraints = await neo4jQuery(
			{ query: callDbConstraintsQuery },
			{ isOptionalResult: true, isArrayResult: true }
		);

		const labelsWithConstraint = constraints.map(constraint => constraint.labelsOrTypes[0]);

		const labelsToConstrain = [...CONSTRAINABLE_LABELS].filter(label => !labelsWithConstraint.includes(label));

		console.log('Neo4j database: Creating constraints…'); // eslint-disable-line no-console

		if (!labelsToConstrain.length) {

			console.log('Neo4j database: No constraints required'); // eslint-disable-line no-console

			return;

		}

		const labelConstraintFunctions = labelsToConstrain.map(label => () => createConstraint(label));

		await directly(1, labelConstraintFunctions);

		console.log('Neo4j database: All constraints created'); // eslint-disable-line no-console

	} catch (error) {

		console.error(`Neo4j database: Error attempting query '${callDbConstraintsQuery}': `, error); // eslint-disable-line no-console

	}

};
