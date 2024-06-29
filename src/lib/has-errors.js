import isObjectWithKeys from './is-object-with-keys.js';

const isErrorsProperty = (prop, value) => prop === 'errors' && isObjectWithKeys(value);

const isObjectWithErrors = item => isObjectWithKeys(item) && hasErrors(item);

export const hasErrors = instance => {

	for (const prop in instance) if (Object.hasOwn(instance, prop)) {

		const value = instance[prop];

		if (isErrorsProperty(prop, value)) return true;

		if (isObjectWithErrors(value)) return true;

		if (Array.isArray(value) && value.find(item => isObjectWithErrors(item))) return true;

	}

	return false;

};
