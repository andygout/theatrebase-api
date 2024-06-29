import neo4j from 'neo4j-driver';

import isObjectWithKeys from '../lib/is-object-with-keys.js';

export const convertNeo4jIntegersToNumbers = inputValue => {

	const applyModifications = object => {

		return Object.keys(object).reduce((accumulator, key) => {

			const value = object[key];

			if (neo4j.isInt(value)) {

				const neo4jInteger = neo4j.int(value);

				if (neo4jInteger.inSafeRange()) accumulator[key] = neo4jInteger.toNumber();

			} else if (isObjectWithKeys(value)) {

				accumulator[key] = applyModifications(value);

			} else if (Array.isArray(value)) {

				accumulator[key] = value.map(item => isObjectWithKeys(item) ? applyModifications(item) : item);

			} else {

				accumulator[key] = value;

			}

			return accumulator;

		}, {});

	};

	const { key: modifiedValue } = applyModifications({ key: inputValue });

	return modifiedValue;

};
