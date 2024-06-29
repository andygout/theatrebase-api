import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, stub } from 'sinon';

import { FestivalSeries } from '../../../src/models/index.js';

describe('Festival Serieses controller', () => {

	let stubs;

	const FestivalSeriesStub = function () {

		return createStubInstance(FestivalSeries);

	};

	beforeEach(() => {

		stubs = {
			callClassMethodsModule: {
				callInstanceMethod: stub().resolves('callInstanceMethod response'),
				callStaticListMethod: stub().resolves('callStaticListMethod response')
			},
			sendJsonResponseModule: {
				sendJsonResponse: stub().returns('sendJsonResponse response')
			},
			models: {
				FestivalSeries: FestivalSeriesStub
			},
			request: stub(),
			response: stub(),
			next: stub()
		};

	});

	const createSubject = () =>
		esmock('../../../src/controllers/festival-serieses.js', {
			'../../../src/lib/call-class-methods.js': stubs.callClassMethodsModule,
			'../../../src/lib/send-json-response.js': stubs.sendJsonResponseModule,
			'../../../src/models/index.js': stubs.models
		});

	const callFunction = async functionName => {

		const festivalSeriesController = await createSubject();

		return festivalSeriesController[functionName](stubs.request, stubs.response, stubs.next);

	};

	describe('newRoute function', () => {

		it('calls sendJsonResponse module', async () => {

			const result = await callFunction('newRoute');
			assert.calledOnceWithExactly(
				stubs.sendJsonResponseModule.sendJsonResponse,
				stubs.response, stubs.models.FestivalSeries() // eslint-disable-line new-cap
			);
			expect(result).to.equal('sendJsonResponse response');

		});

	});

	describe('createRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('createRoute');
			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.FestivalSeries(), 'CREATE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('editRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('editRoute');
			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.FestivalSeries(), 'EDIT' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('updateRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('updateRoute');
			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.FestivalSeries(), 'UPDATE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('deleteRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('deleteRoute');
			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.FestivalSeries(), 'DELETE' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('showRoute function', () => {

		it('calls callInstanceMethod module', async () => {

			const result = await callFunction('showRoute');
			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callInstanceMethod,
				stubs.response, stubs.next, stubs.models.FestivalSeries(), 'SHOW' // eslint-disable-line new-cap
			);
			expect(result).to.equal('callInstanceMethod response');

		});

	});

	describe('listRoute function', () => {

		it('calls callStaticListMethod module', async () => {

			const result = await callFunction('listRoute');
			assert.calledOnceWithExactly(
				stubs.callClassMethodsModule.callStaticListMethod,
				stubs.response, stubs.next, stubs.models.FestivalSeries, 'FESTIVAL_SERIES'
			);
			expect(result).to.equal('callStaticListMethod response');

		});

	});

});
