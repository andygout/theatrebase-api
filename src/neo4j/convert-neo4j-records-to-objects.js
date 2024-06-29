import { convertNeo4jIntegersToNumbers } from './convert-neo4j-integers-to-numbers.js';

export const convertNeo4jRecordsToObjects = response => {

	const records = response.records || [];

	return records.reduce((recordAccumulator, record) => {

		const object = record.keys.reduce((keyAccumulator, key, index) => {

			keyAccumulator[key] = convertNeo4jIntegersToNumbers(record._fields[index]); // eslint-disable-line no-underscore-dangle

			return keyAccumulator;

		}, {});

		recordAccumulator.push(object);

		return recordAccumulator;

	}, []);

};
