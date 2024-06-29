/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { material as materialSeedProps } from './model-seed-props/index.js';
import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods.js';
import { sendJsonResponse } from '../lib/send-json-response.js';
import { Material } from '../models/index.js';
import { ACTIONS, MODELS } from '../utils/constants.js';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Material(materialSeedProps));

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material(request.body), ACTIONS.CREATE);

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material(request.params), ACTIONS.EDIT);

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material({ ...request.body, ...request.params }), ACTIONS.UPDATE);

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material(request.params), ACTIONS.DELETE);

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Material(request.params), ACTIONS.SHOW);

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Material, MODELS.MATERIAL);

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
