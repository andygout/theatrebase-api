/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { awardCeremony as awardCeremonySeedProps } from './model-seed-props/index.js';
import { callInstanceMethod, callStaticListMethod } from '../lib/call-class-methods.js';
import { sendJsonResponse } from '../lib/send-json-response.js';
import { AwardCeremony } from '../models/index.js';
import { ACTIONS, MODELS } from '../utils/constants.js';

const newRoute = (request, response, next) =>
	sendJsonResponse(response, new AwardCeremony(awardCeremonySeedProps));

const createRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.body), ACTIONS.CREATE);

const editRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), ACTIONS.EDIT);

const updateRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony({ ...request.body, ...request.params }), ACTIONS.UPDATE);

const deleteRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), ACTIONS.DELETE);

const showRoute = (request, response, next) =>
	callInstanceMethod(response, next, new AwardCeremony(request.params), ACTIONS.SHOW);

const listRoute = (request, response, next) =>
	callStaticListMethod(response, next, AwardCeremony, MODELS.AWARD_CEREMONY);

export {
	newRoute,
	createRoute,
	editRoute,
	updateRoute,
	deleteRoute,
	showRoute,
	listRoute
};
