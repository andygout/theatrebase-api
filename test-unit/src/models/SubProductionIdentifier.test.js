import { assert, createSandbox, spy } from 'sinon';

import { SubProductionIdentifier } from '../../../src/models/index.js';
import * as cypherQueries from '../../../src/neo4j/cypher-queries/index.js';
import * as neo4jQueryModule from '../../../src/neo4j/query.js';

let stubs;
let instance;

const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

const sandbox = createSandbox();

describe('SubProductionIdentifier model', () => {

	beforeEach(() => {

		stubs = {
			validationQueries: {
				getSubProductionChecksQuery:
					sandbox.stub(cypherQueries.validationQueries, 'getSubProductionChecksQuery')
						.returns('getSubProductionChecksQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryMockResponse)
		};

		instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('runDatabaseValidations method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (instance does not exist)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isExistent: false,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID does not exist'
				);

			});

		});

		context('invalid data (instance is already assigned to another sur-production)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: true,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is already assigned to another sur-production'
				);

			});

		});

		context('invalid data (instance is the sur-most production of a three-tiered production collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: true,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is the sur-most production of a three-tiered production collection'
				);

			});

		});

		context('invalid data (instance is the subject production\'s sur-production)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: true,
					isSubjectProductionASubSubProduction: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is this production\'s sur-production'
				);

			});

		});

		context('invalid data (instance cannot be assigned to a three-tiered production collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: true
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});
				assert.callOrder(
					stubs.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Sub-production cannot be assigned to a three-tiered production collection'
				);

			});

		});

	});

});
