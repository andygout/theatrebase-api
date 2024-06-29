/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { venue as venueSeedProps } from './model-seed-props/index.js';
import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods.js';
import { sendJsonResponse } from '../lib/send-json-response.js';
import { Venue } from '../models/index.js';
import { ACTIONS, MODELS } from '../utils/constants.js';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new Venue(venueSeedProps));

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue(request.body), ACTIONS.CREATE);

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue(request.params), ACTIONS.EDIT);

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue({ ...request.body, ...request.params }), ACTIONS.UPDATE);

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue(request.params), ACTIONS.DELETE);

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new Venue(request.params), ACTIONS.SHOW);

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, Venue, MODELS.VENUE);

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
