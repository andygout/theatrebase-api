import { assert, createSandbox, spy } from 'sinon';

import * as prepareAsParamsModule from '../../../src/lib/prepare-as-params.js';
import { OriginalVersionMaterial } from '../../../src/models/index.js';
import * as cypherQueries from '../../../src/neo4j/cypher-queries/index.js';
import * as neo4jQueryModule from '../../../src/neo4j/query.js';

let stubs;
let instance;

const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

const sandbox = createSandbox();

describe('OriginalVersionMaterial model', () => {

	beforeEach(() => {

		stubs = {
			prepareAsParams: sandbox.stub(prepareAsParamsModule, 'prepareAsParams').returns({
				name: 'NAME_VALUE',
				differentiator: 'DIFFERENTIATOR_VALUE'
			}),
			validationQueries: {
				getOriginalVersionMaterialChecksQuery:
					sandbox.stub(cypherQueries.validationQueries, 'getOriginalVersionMaterialChecksQuery')
						.returns('getOriginalVersionMaterialChecksQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryMockResponse)
		};

		instance = new OriginalVersionMaterial({ name: 'NAME_VALUE', differentiator: '1' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('runDatabaseValidations method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isSubsequentVersionMaterialOfSubjectMaterial: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getOriginalVersionMaterialChecksQuery,
					stubs.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getOriginalVersionMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getOriginalVersionMaterialChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (instance is the subject material\'s subsequent version material)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isSubsequentVersionMaterialOfSubjectMaterial: true
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getOriginalVersionMaterialChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getOriginalVersionMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getOriginalVersionMaterialChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Material with these attributes is this material\'s subsequent version material'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is this material\'s subsequent version material'
				);

			});

		});

	});

});
