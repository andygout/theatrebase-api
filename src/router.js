/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { Router } from 'express';

import {
	awards as awardsController,
	awardCeremonies as awardCeremoniesController,
	characters as charactersController,
	companies as companiesController,
	festivals as festivalsController,
	festivalSerieses as festivalsSeriesesController,
	materials as materialsController,
	people as peopleController,
	productions as productionsController,
	search as searchController,
	seasons as seasonsController,
	venues as venuesController
} from './controllers/index.js';

const router = new Router();

router.get('/search', searchController);

router.get('/awards/new', awardsController.newRoute);
router.post('/awards', awardsController.createRoute);
router.get('/awards/:uuid/edit', awardsController.editRoute);
router.put('/awards/:uuid', awardsController.updateRoute);
router.delete('/awards/:uuid', awardsController.deleteRoute);
router.get('/awards/:uuid', awardsController.showRoute);
router.get('/awards', awardsController.listRoute);

router.get('/award-ceremonies/new', awardCeremoniesController.newRoute);
router.post('/award-ceremonies', awardCeremoniesController.createRoute);
router.get('/award-ceremonies/:uuid/edit', awardCeremoniesController.editRoute);
router.put('/award-ceremonies/:uuid', awardCeremoniesController.updateRoute);
router.delete('/award-ceremonies/:uuid', awardCeremoniesController.deleteRoute);
router.get('/award-ceremonies/:uuid', awardCeremoniesController.showRoute);
router.get('/award-ceremonies', awardCeremoniesController.listRoute);

router.get('/characters/new', charactersController.newRoute);
router.post('/characters', charactersController.createRoute);
router.get('/characters/:uuid/edit', charactersController.editRoute);
router.put('/characters/:uuid', charactersController.updateRoute);
router.delete('/characters/:uuid', charactersController.deleteRoute);
router.get('/characters/:uuid', charactersController.showRoute);
router.get('/characters', charactersController.listRoute);

router.get('/companies/new', companiesController.newRoute);
router.post('/companies', companiesController.createRoute);
router.get('/companies/:uuid/edit', companiesController.editRoute);
router.put('/companies/:uuid', companiesController.updateRoute);
router.delete('/companies/:uuid', companiesController.deleteRoute);
router.get('/companies/:uuid', companiesController.showRoute);
router.get('/companies', companiesController.listRoute);

router.get('/festivals/new', festivalsController.newRoute);
router.post('/festivals', festivalsController.createRoute);
router.get('/festivals/:uuid/edit', festivalsController.editRoute);
router.put('/festivals/:uuid', festivalsController.updateRoute);
router.delete('/festivals/:uuid', festivalsController.deleteRoute);
router.get('/festivals/:uuid', festivalsController.showRoute);
router.get('/festivals', festivalsController.listRoute);

router.get('/festival-serieses/new', festivalsSeriesesController.newRoute);
router.post('/festival-serieses', festivalsSeriesesController.createRoute);
router.get('/festival-serieses/:uuid/edit', festivalsSeriesesController.editRoute);
router.put('/festival-serieses/:uuid', festivalsSeriesesController.updateRoute);
router.delete('/festival-serieses/:uuid', festivalsSeriesesController.deleteRoute);
router.get('/festival-serieses/:uuid', festivalsSeriesesController.showRoute);
router.get('/festival-serieses', festivalsSeriesesController.listRoute);

router.get('/materials/new', materialsController.newRoute);
router.post('/materials', materialsController.createRoute);
router.get('/materials/:uuid/edit', materialsController.editRoute);
router.put('/materials/:uuid', materialsController.updateRoute);
router.delete('/materials/:uuid', materialsController.deleteRoute);
router.get('/materials/:uuid', materialsController.showRoute);
router.get('/materials', materialsController.listRoute);

router.get('/people/new', peopleController.newRoute);
router.post('/people', peopleController.createRoute);
router.get('/people/:uuid/edit', peopleController.editRoute);
router.put('/people/:uuid', peopleController.updateRoute);
router.delete('/people/:uuid', peopleController.deleteRoute);
router.get('/people/:uuid', peopleController.showRoute);
router.get('/people', peopleController.listRoute);

router.get('/productions/new', productionsController.newRoute);
router.post('/productions', productionsController.createRoute);
router.get('/productions/:uuid/edit', productionsController.editRoute);
router.put('/productions/:uuid', productionsController.updateRoute);
router.delete('/productions/:uuid', productionsController.deleteRoute);
router.get('/productions/:uuid', productionsController.showRoute);
router.get('/productions', productionsController.listRoute);

router.get('/seasons/new', seasonsController.newRoute);
router.post('/seasons', seasonsController.createRoute);
router.get('/seasons/:uuid/edit', seasonsController.editRoute);
router.put('/seasons/:uuid', seasonsController.updateRoute);
router.delete('/seasons/:uuid', seasonsController.deleteRoute);
router.get('/seasons/:uuid', seasonsController.showRoute);
router.get('/seasons', seasonsController.listRoute);

router.get('/venues/new', venuesController.newRoute);
router.post('/venues', venuesController.createRoute);
router.get('/venues/:uuid/edit', venuesController.editRoute);
router.put('/venues/:uuid', venuesController.updateRoute);
router.delete('/venues/:uuid', venuesController.deleteRoute);
router.get('/venues/:uuid', venuesController.showRoute);
router.get('/venues', venuesController.listRoute);

router.get('*', (request, response, next) => response.sendStatus(404));

export default router;
