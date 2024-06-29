import neo4j from 'neo4j-driver';

import { getRandomUuid } from './get-random-uuid.js';
import isObjectWithKeys from './is-object-with-keys.js';

const CHARACTER_GROUPS = 'characterGroups';
const CREATIVE_CREDITS = 'creativeCredits';
const CREW_CREDITS = 'crewCredits';
const NOMINATIONS = 'nominations';
const PRODUCER_CREDITS = 'producerCredits';
const PRODUCTIONS = 'productions';
const REVIEWS = 'reviews';
const SUB_PRODUCTIONS = 'subProductions';
const WRITING_CREDITS = 'writingCredits';

const EMPTY_NAME_EXCEPTION_KEYS = new Set([
	CHARACTER_GROUPS,
	NOMINATIONS,
	PRODUCER_CREDITS,
	PRODUCTIONS, // Excepted from having empty name only in the context of being an association of another subject.
	REVIEWS,
	SUB_PRODUCTIONS,
	WRITING_CREDITS
]);

const REQUIRES_NAMED_CHILDREN_KEYS = new Set([
	CHARACTER_GROUPS,
	CREATIVE_CREDITS,
	CREW_CREDITS,
	NOMINATIONS,
	PRODUCER_CREDITS,
	WRITING_CREDITS
]);

const REQUIRES_NON_EMPTY_URL_KEYS = new Set([
	REVIEWS
]);

const REQUIRES_NON_EMPTY_UUID_KEYS = new Set([
	PRODUCTIONS,
	SUB_PRODUCTIONS
]);

export const prepareAsParams = instance => {

	const recordedInstances = [];

	const hasNameOrIsExempt = key => item =>
		Boolean(item.name) ||
		EMPTY_NAME_EXCEPTION_KEYS.has(key);

	const hasNamedChildrenIfRequired = key => item =>
		!REQUIRES_NAMED_CHILDREN_KEYS.has(key) ||
		item[key === CHARACTER_GROUPS ? 'characters' : 'entities']?.some(child => Boolean(child.name)) ||
		(
			key === NOMINATIONS &&
			(
				item['entities']?.some(child => Boolean(child.name)) ||
				item['productions']?.some(child => Boolean(child.uuid)) ||
				item['materials']?.some(child => Boolean(child.name))
			)
		);

	const hasUrlIfRequired = key => item =>
		!REQUIRES_NON_EMPTY_URL_KEYS.has(key) ||
		!Object.hasOwn(item, 'url') ||
		Boolean(item.url);

	const hasUuidIfRequired = key => item =>
		!REQUIRES_NON_EMPTY_UUID_KEYS.has(key) ||
		!Object.hasOwn(item, 'uuid') ||
		Boolean(item.uuid);

	const applyPositionPropertyAndRecurseObject = (item, index, array) => {

		if (isObjectWithKeys(item)) {

			if (array.length > 1) item = { ...item, model: item.model, position: index };

			return applyModifications(item);

		}

		return null;

	};

	const applyModifications = instance => {

		return Object.keys(instance).concat(['model']).reduce((accumulator, key) => {

			const value = instance[key];

			if (isObjectWithKeys(value)) {

				accumulator[key] = applyModifications(value);

			} else if (Array.isArray(value)) {

				accumulator[key] =
					value
						.filter(hasNameOrIsExempt(key))
						.filter(hasNamedChildrenIfRequired(key))
						.filter(hasUrlIfRequired(key))
						.filter(hasUuidIfRequired(key))
						.map(applyPositionPropertyAndRecurseObject)
						.filter(Boolean);

			} else {

				const requiresUuidValue =
					key === 'uuid' &&
					(value === undefined || !value.length) &&
					Boolean(instance.name);

				if (requiresUuidValue) {

					const instanceWithShareableUuid = recordedInstances.find(recordedInstance => {
						const instanceNameForComparison = instance.underlyingName || instance.name;
						const recordedInstanceNameForComparison = recordedInstance.underlyingName || recordedInstance.name;

						const isInstanceWithShareableUuid =
							instance.model === recordedInstance.model &&
							instanceNameForComparison === recordedInstanceNameForComparison &&
							instance.differentiator === recordedInstance.differentiator;

						return isInstanceWithShareableUuid;
					});

					accumulator[key] =
						instanceWithShareableUuid?.uuid ||
						// Arguments given to create predictable uuid values in end-to-end tests.
						getRandomUuid({
							model: instance.model,
							name: instance.name,
							differentiator: instance.differentiator
						});

					if (!instanceWithShareableUuid) {

						recordedInstances.push({
							model: instance.model,
							uuid: accumulator[key],
							name: instance.name,
							underlyingName: instance.underlyingName,
							differentiator: instance.differentiator
						});

					}

				}
				else if (typeof value === 'number') accumulator[key] = neo4j.int(value);
				else if (value === '' || (typeof value === 'boolean' && !value)) accumulator[key] = null;
				else accumulator[key] = value || null;

			}

			return accumulator;

		}, {});

	};

	return applyModifications(instance);

};
