import { assert, createSandbox, spy } from 'sinon';

import * as prepareAsParamsModule from '../../../src/lib/prepare-as-params.js';
import { SourceMaterial } from '../../../src/models/index.js';
import * as cypherQueries from '../../../src/neo4j/cypher-queries/index.js';
import * as neo4jQueryModule from '../../../src/neo4j/query.js';

let stubs;
let instance;

const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

const sandbox = createSandbox();

describe('SourceMaterial model', () => {

	beforeEach(() => {

		stubs = {
			prepareAsParams: sandbox.stub(prepareAsParamsModule, 'prepareAsParams').returns({
				name: 'NAME_VALUE',
				differentiator: 'DIFFERENTIATOR_VALUE'
			}),
			validationQueries: {
				getSourceMaterialChecksQuery:
					sandbox.stub(cypherQueries.validationQueries, 'getSourceMaterialChecksQuery')
						.returns('getSourceMaterialChecksQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryMockResponse)
		};

		instance = new SourceMaterial({ name: 'NAME_VALUE', differentiator: '1' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('runDatabaseValidations method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isSourcingMaterialOfSubjectMaterial: false
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getSourceMaterialChecksQuery,
					stubs.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getSourceMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSourceMaterialChecksQuery response',
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

		context('invalid data (instance is the subject material\'s sourcing material)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({
					isSourcingMaterialOfSubjectMaterial: true
				});
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations({ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getSourceMaterialChecksQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getSourceMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getSourceMaterialChecksQuery response',
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
					'name', 'Material with these attributes is this material\'s sourcing material'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is this material\'s sourcing material'
				);

			});

		});

	});

});
