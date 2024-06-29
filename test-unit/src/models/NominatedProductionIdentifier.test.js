import { assert, spy, stub } from 'sinon';

import { NominatedProductionIdentifier } from '../../../src/models/index.js';

describe('NominatedProductionIdentifier model', () => {

	describe('runDatabaseValidations method', () => {

		context('confirmExistenceInDatabase method resolves with true (i.e. production uuid exists in database)', () => {

			it('will not call addPropertyError method', async () => {

				const instance = new NominatedProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				stub(instance, 'confirmExistenceInDatabase').resolves(true);
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations();
				assert.calledOnceWithExactly(instance.confirmExistenceInDatabase, { model: 'PRODUCTION' });
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('confirmExistenceInDatabase method resolves with false (i.e. production uuid does not exist in database)', () => {

			it('will call addPropertyError method', async () => {

				const instance = new NominatedProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				stub(instance, 'confirmExistenceInDatabase').resolves(false);
				spy(instance, 'addPropertyError');
				await instance.runDatabaseValidations();
				assert.calledOnceWithExactly(instance.confirmExistenceInDatabase, { model: 'PRODUCTION' });
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID does not exist'
				);

			});

		});

	});

});
