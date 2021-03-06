/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

import { Router } from 'express';

import {
	characters as charactersController,
	companies as companiesController,
	materials as materialsController,
	people as peopleController,
	productions as productionsController,
	venues as venuesController
} from './controllers';

const router = new Router();

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

router.get('/venues/new', venuesController.newRoute);
router.post('/venues', venuesController.createRoute);
router.get('/venues/:uuid/edit', venuesController.editRoute);
router.put('/venues/:uuid', venuesController.updateRoute);
router.delete('/venues/:uuid', venuesController.deleteRoute);
router.get('/venues/:uuid', venuesController.showRoute);
router.get('/venues', venuesController.listRoute);

router.get('*', (request, response, next) => response.sendStatus(404));

export default router;
