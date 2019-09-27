import { expect } from 'chai';
import sinon from 'sinon';

import * as prepareAsParamsModule from '../../../server/lib/prepare-as-params';
import * as validateStringModule from '../../../server/lib/validate-string';
import * as verifyErrorPresenceModule from '../../../server/lib/verify-error-presence';
import Base from '../../../server/models/base';
import * as cypherQueriesModelQueryMaps from '../../../server/neo4j/cypher-queries/model-query-maps';
import * as cypherQueriesShared from '../../../server/neo4j/cypher-queries/shared';
import * as neo4jQueryModule from '../../../server/neo4j/query';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Base model', () => {

	let stubs;
	let instance;

	const sandbox = sinon.createSandbox();

	beforeEach(() => {

		stubs = {
			prepareAsParams: sandbox.stub(prepareAsParamsModule, 'prepareAsParams').returns('prepareAsParams response'),
			validateString: sandbox.stub(validateStringModule, 'validateString').returns([]),
			verifyErrorPresence: sandbox.stub(verifyErrorPresenceModule, 'verifyErrorPresence').returns(false),
			getCreateQueries: {
				production:
					sandbox.stub(cypherQueriesModelQueryMaps.getCreateQueries, 'production')
			},
			getEditQueries: {
				production:
					sandbox.stub(cypherQueriesModelQueryMaps.getEditQueries, 'production')
						.returns('getEditProductionQuery response')
			},
			getUpdateQueries: {
				production: sandbox.stub(cypherQueriesModelQueryMaps.getUpdateQueries, 'production')
			},
			getDeleteQueries: {
				production:
					sandbox.stub(cypherQueriesModelQueryMaps.getDeleteQueries, 'production')
						.returns('getDeleteProductionQuery response')
			},
			getShowQueries: {
				theatre:
					sandbox.stub(cypherQueriesModelQueryMaps.getShowQueries, 'theatre')
						.returns('getShowTheatreQuery response')
			},
			getValidateQuery:
				sandbox.stub(cypherQueriesShared, 'getValidateQuery').returns('getValidateQuery response'),
			getCreateQuery: sandbox.stub(cypherQueriesShared, 'getCreateQuery').returns('getCreateQuery response'),
			getEditQuery: sandbox.stub(cypherQueriesShared, 'getEditQuery').returns('getEditQuery response'),
			getUpdateQuery: sandbox.stub(cypherQueriesShared, 'getUpdateQuery').returns('getUpdateQuery response'),
			getDeleteQuery: sandbox.stub(cypherQueriesShared, 'getDeleteQuery').returns('getDeleteQuery response'),
			getListQuery: sandbox.stub(cypherQueriesShared, 'getListQuery').returns('getListQuery response'),
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryFixture)
		};

		stubs.validateString.withArgs('').returns(['Name is too short']);

		instance = new Base({ name: 'Foobar' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('name property', () => {

			it('assigns empty string if not included in props', () => {

				instance = new Base({});
				expect(instance.name).to.eq('');

			});

			it('assigns given value', () => {

				instance = new Base({ name: 'Barfoo' });
				expect(instance.name).to.eq('Barfoo');

			});

			it('trims', () => {

				instance = new Base({ name: ' Barfoo ' });
				expect(instance.name).to.eq('Barfoo');

			});

		});

	});

	describe('validate method', () => {

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				instance.validate();
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				instance = new Base({ name: '' });
				instance.validate();
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name is too short']);

			});

		});

	});

	describe('validateInDb method', () => {

		it('validates update in database', async () => {

			await instance.validateInDb();
			expect(stubs.getValidateQuery.calledOnce).to.be.true;
			expect(stubs.getValidateQuery.calledWithExactly(
				instance.model, instance.uuid
			)).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getValidateQuery response', params: instance }
			)).to.be.true;

		});

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not add properties to errors property', async () => {

				stubs.neo4jQuery.resolves({ instanceCount: 0 });
				await instance.validateInDb();
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('adds properties that are arrays to errors property', async () => {

				stubs.neo4jQuery.resolves({ instanceCount: 1 });
				await instance.validateInDb();
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name already exists']);

			});

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates', async () => {

				sinon.spy(instance, 'validate');
				sinon.spy(instance, 'validateInDb');
				const result = await instance.createUpdate(stubs.getCreateQuery)
				sinon.assert.callOrder(
					instance.validate.withArgs({ required: true }),
					stubs.verifyErrorPresence.withArgs(instance),
					instance.validateInDb.withArgs(),
					stubs.getValidateQuery.withArgs(instance.model),
					stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					stubs.verifyErrorPresence.withArgs(instance),
					stubs.getCreateQuery.withArgs(instance.model),
					stubs.prepareAsParams.withArgs(instance),
					stubs.neo4jQuery.withArgs(
						{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.validate.calledOnce).to.be.true;
				expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.getCreateQuery.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

			it('updates', async () => {

				sinon.spy(instance, 'validate');
				sinon.spy(instance, 'validateInDb');
				const result = await instance.createUpdate(stubs.getUpdateQuery);
				sinon.assert.callOrder(
					instance.validate.withArgs({ required: true }),
					stubs.verifyErrorPresence.withArgs(instance),
					instance.validateInDb.withArgs(),
					stubs.getValidateQuery.withArgs(instance.model),
					stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					stubs.verifyErrorPresence.withArgs(instance),
					stubs.getUpdateQuery.withArgs(instance.model),
					stubs.prepareAsParams.withArgs(instance),
					stubs.neo4jQuery.withArgs(
						{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.validate.calledOnce).to.be.true;
				expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.getUpdateQuery.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('invalid data', () => {

			context('initial validation errors caused by submitted values', () => {

				it('returns instance without creating/updating', async () => {

					stubs.verifyErrorPresence.returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance.model = 'theatre';
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
					expect(instance.validate.calledBefore(stubs.verifyErrorPresence)).to.be.true;
					expect(instance.validate.calledOnce).to.be.true;
					expect(instance.validate.calledWithExactly({ required: true })).to.be.true;
					expect(stubs.verifyErrorPresence.calledOnce).to.be.true;
					expect(stubs.verifyErrorPresence.calledWithExactly(instance)).to.be.true;
					expect(instance.validateInDb.notCalled).to.be.true;
					expect(stubs.getValidateQuery.notCalled).to.be.true;
					expect(stubs.neo4jQuery.notCalled).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(result).to.deep.eq(instance);

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('returns instance without creating/updating', async () => {

					stubs.verifyErrorPresence.onFirstCall().returns(false).onSecondCall().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance.model = 'theatre';
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
					sinon.assert.callOrder(
						instance.validate.withArgs({ required: true }),
						stubs.verifyErrorPresence.withArgs(instance),
						instance.validateInDb.withArgs(),
						stubs.getValidateQuery.withArgs(instance.model),
						stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
						stubs.verifyErrorPresence.withArgs(instance)
					);
					expect(instance.validate.calledOnce).to.be.true;
					expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(stubs.getValidateQuery.calledOnce).to.be.true;
					expect(stubs.neo4jQuery.calledOnce).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(result).to.deep.eq(instance);

				});

			});

		});

	});

	describe('create method', () => {

		context('instance requires a model-specific query', () => {

			it('calls createUpdate method with function to get model-specific create query as argument', async () => {

				instance.model = 'production';
				sinon.spy(instance, 'createUpdate');
				await instance.create();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.getCreateQueries[instance.model])).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('calls createUpdate method with function to get shared create query as argument', async () => {

				sinon.spy(instance, 'createUpdate');
				await instance.create();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.getCreateQuery)).to.be.true;

			});

		});

	});

	describe('edit method', () => {

		context('instance requires a model-specific query', () => {

			it('gets edit data using model-specific query', async () => {

				instance.model = 'production';
				const result = await instance.edit();
				expect(stubs.getEditQueries[instance.model].calledOnce).to.be.true;
				expect(stubs.getEditQueries[instance.model].calledWithExactly()).to.be.true;
				expect(stubs.getEditQuery.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getEditProductionQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('instance can use shared query', () => {

			it('gets edit data using shared query', async () => {

				const result = await instance.edit();
				expect(stubs.getEditQuery.calledOnce).to.be.true;
				expect(stubs.getEditQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.getEditQueries.production.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getEditQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

	});

	describe('update method', () => {

		context('instance requires a model-specific query', () => {

			it('calls createUpdate method with function to get model-specific update query as argument', async () => {

				instance.model = 'production';
				sinon.spy(instance, 'createUpdate');
				await instance.update();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.getUpdateQueries[instance.model])).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('calls createUpdate method with function to get shared update query as argument', async () => {

				sinon.spy(instance, 'createUpdate');
				await instance.update();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.getUpdateQuery)).to.be.true;

			});

		});

	});

	describe('delete method', () => {

		context('instance requires a model-specific query', () => {

			it('deletes using model-specific query', async () => {

				instance.model = 'production';
				const result = await instance.delete();
				expect(stubs.getDeleteQueries[instance.model].calledOnce).to.be.true;
				expect(stubs.getDeleteQueries[instance.model].calledWithExactly()).to.be.true;
				expect(stubs.getDeleteQuery.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDeleteProductionQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('instance can use shared query', () => {

			it('deletes using shared query', async () => {

				const result = await instance.delete();
				expect(stubs.getDeleteQuery.calledOnce).to.be.true;
				expect(stubs.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.getDeleteQueries.production.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDeleteQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

	});

	describe('show method', () => {

		it('gets show data', async () => {

			instance.model = 'theatre';
			const result = await instance.show();
			expect(stubs.getShowQueries.theatre.calledOnce).to.be.true;
			expect(stubs.getShowQueries.theatre.calledWithExactly()).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getShowTheatreQuery response', params: instance }
			)).to.be.true;
			expect(result).to.deep.eq(neo4jQueryFixture);

		});

	});

	describe('list method', () => {

		it('gets list data', async () => {

			const result = await Base.list('model');
			expect(stubs.getListQuery.calledOnce).to.be.true;
			expect(stubs.getListQuery.calledWithExactly('model')).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getListQuery response' }, { isReqdResult: false, returnArray: true }
			)).to.be.true;
			expect(result).to.deep.eq(neo4jQueryFixture);

		});

	});

});
