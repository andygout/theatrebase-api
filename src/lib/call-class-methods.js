import { sendJsonResponse } from './send-json-response.js';

const callInstanceMethod = async (response, next, classInstance, action) => {

	try {

		const instance = await classInstance[action.toLowerCase()]();

		return sendJsonResponse(response, instance);

	} catch (error) {

		if (error.message === 'Not Found') return response.sendStatus(404);

		return next(error);

	}

};

const callStaticListMethod = async (response, next, Class, model) => {

	try {

		const instances = await Class.list(model);

		return sendJsonResponse(response, instances);

	} catch (error) {

		return next(error);

	}

};

export {
	callInstanceMethod,
	callStaticListMethod
};
