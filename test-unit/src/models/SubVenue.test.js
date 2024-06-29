import { assert, createSandbox, spy } from 'sinon';

import * as prepareAsParamsModule from '../../../src/lib/prepare-as-params.js';
import { SubVenue } from '../../../src/models/index.js';
import * as cypherQueries from '../../../src/neo4j/cypher-queries/index.js';
import * as neo4jQueryModule from '../../../src/neo4j/query.js';

let stubs;
let instance;

const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

const sandbox = createSandbox();

describe('SubVenue model', () => {

	beforeEach(() => {

		stubs = {
			prepareAsParams: sandbox.stub(prepareAsParamsModule, 'prepareAsParams').returns({
				name: 'NAME_VALUE',
				differentiator: 'DIFFERENTIATOR_VALUE'
			}),
			validationQueries: {
				getSubVenueChecksQuery:
					sandbox.stub(cypherQueries.validationQueries, 'getSubVenueChecksQuery')
						.returns('getSubVenueChecksQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryMockResponse)
		};

		instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('runDatabaseValidations method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubVenueChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubVenueChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (instance is already assigned to another sur-venue)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurVenue: true,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubVenueChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubVenueChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Venue with these attributes is already assigned to another sur-venue'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Venue with these attributes is already assigned to another sur-venue'
				);

			});

		});

		context('invalid data (instance is the sur-most venue of a two-tiered venue collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurVenue: false,
					isSurVenue: true,
					isSubjectVenueASubVenue: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubVenueChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubVenueChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
				);

			});

		});

		context('invalid data (instance cannot be assigned to a two-tiered venue collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: true
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubVenueChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubVenueChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Sub-venue cannot be assigned to a two-tiered venue collection'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Sub-venue cannot be assigned to a two-tiered venue collection'
				);

			});

		});

	});

});
