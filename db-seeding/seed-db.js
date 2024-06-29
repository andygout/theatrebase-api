import fs from 'node:fs';
import path from 'node:path';

import directly from 'directly';
import jsonlint from 'jsonlint';

const BASE_URL = 'http://localhost:3000';

const PLURALISED_MODEL_TO_EMOJI_MAP = {
	'award-ceremonies': '🏆',
	'festivals': '🎪',
	'materials': '📖',
	'productions': '🎭',
	'venues': '🏛️'
};

const PAUSE_DURATION_IN_MILLISECONDS = 500;

const pause = duration => new Promise(resolve => setTimeout(resolve, duration));

async function performFetch (url, instance, modelEmoji, filenamePathSlug) {

	const settings = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(instance)
	};

	await pause(PAUSE_DURATION_IN_MILLISECONDS);

	const response = await fetch(url, settings);

	if (response.status !== 200) throw new Error(response.statusText);

	const responseJson = await response.json();

	const resultIndicator = responseJson.hasErrors ? '❌' : '✅';

	// eslint-disable-next-line no-console
	console.log(`${resultIndicator} Seeding Neo4j database: ${modelEmoji} ${filenamePathSlug}`);

	return;

}

async function seedInstances (pluralisedModel) {

	const directoryName = pluralisedModel;
	const modelUrlRoute = pluralisedModel;

	const modelEmoji = PLURALISED_MODEL_TO_EMOJI_MAP[pluralisedModel];

	const directoryPath = path.join(__dirname, `seeds/${directoryName}`);

	const seedFilenames = fs.readdirSync(directoryPath);

	// eslint-disable-next-line no-console
	console.log(`🟢 Seeding Neo4j database: ${modelEmoji} Commenced sowing ${seedFilenames.length} ${pluralisedModel} seeds`);

	const createInstanceFunctions =
		seedFilenames
			.map(filename => () => {

				const filenamePathSlug = `${directoryName}/${filename}`;

				const modelEmoji = PLURALISED_MODEL_TO_EMOJI_MAP[pluralisedModel];

				try {

					const rawData = fs.readFileSync(`${directoryPath}/${filename}`);

					let instance;

					try {
						// Parse with jsonlint rather than JSON.parse() because
						// its errors specify the line of parse errors.
						instance = jsonlint.parse(rawData.toString());
					} catch (parsingError) {
						// eslint-disable-next-line no-console
						console.log(`❌ Seeding Neo4j database: ${modelEmoji} ${filenamePathSlug}`);
						// eslint-disable-next-line no-console
						console.log(parsingError);

						return Promise.resolve();
					}

					const url = `${BASE_URL}/${modelUrlRoute}`;

					return performFetch(
						url,
						instance,
						modelEmoji,
						filenamePathSlug
					);

				} catch (error) {

					throw new Error(`${filenamePathSlug}: ${error.message}`, { cause: error });

				}

			});

	await directly(1, createInstanceFunctions);

	return;

}

async function seedDatabase () {

	// eslint-disable-next-line no-console
	console.log('🟢 Seeding Neo4j database: Commenced');

	await seedInstances('festivals');

	// eslint-disable-next-line no-console
	console.log(`✔️  Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['festivals']} Festival seeds sown`);

	await seedInstances('venues');

	// eslint-disable-next-line no-console
	console.log(`✔️  Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['venues']} Venue seeds sown`);

	await seedInstances('materials');

	// eslint-disable-next-line no-console
	console.log(`✔️  Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['materials']} Material seeds sown`);

	await seedInstances('productions');

	// eslint-disable-next-line no-console
	console.log(`✔️  Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['productions']} Production seeds sown`);

	await seedInstances('award-ceremonies');

	// eslint-disable-next-line no-console
	console.log(`✔️  Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['award-ceremonies']} Award ceremony seeds sown`);

	// eslint-disable-next-line no-console
	console.log('🆗 Seeding Neo4j database: Complete');

	return;

}

seedDatabase();
