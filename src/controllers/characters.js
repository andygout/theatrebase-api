/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods.js';
import { sendJsonResponse } from '../lib/send-json-response.js';
import { Character } from '../models/index.js';
import { ACTIONS, MODELS } from '../utils/constants.js';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Character());

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character(request.body), ACTIONS.CREATE);

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character(request.params), ACTIONS.EDIT);

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character({ ...request.body, ...request.params }), ACTIONS.UPDATE);

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character(request.params), ACTIONS.DELETE);

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Character(request.params), ACTIONS.SHOW);

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Character, MODELS.CHARACTER);

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
