import { expect } from 'chai';
import { assert, spy } from 'sinon';

import { AwardCeremonyCategory, Nomination } from '../../../src/models/index.js';

describe('AwardCeremonyCategory model', () => {

	describe('constructor method', () => {

		describe('nominations property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = new AwardCeremonyCategory({});
				expect(instance.nominations).to.deep.equal([]);

			});

			it('assigns array of nominations if included in props', () => {

				const props = {
					nominations: [
						{},
						{},
						{}
					]
				};
				const instance = new AwardCeremonyCategory(props);
				expect(instance.nominations.length).to.equal(3);
				expect(instance.nominations[0] instanceof Nomination).to.be.true;
				expect(instance.nominations[1] instanceof Nomination).to.be.true;
				expect(instance.nominations[2] instanceof Nomination).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				name: 'Best New Play',
				nominations: [{}]
			};
			const instance = new AwardCeremonyCategory(props);
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			spy(instance, 'validateNamePresenceIfNamedChildren');
			spy(instance.nominations[0], 'runInputValidations');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				instance.validateNamePresenceIfNamedChildren,
				instance.nominations[0].runInputValidations
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnceWithExactly(instance.validateNamePresenceIfNamedChildren, []);
			assert.calledOnceWithExactly(instance.nominations[0].runInputValidations);

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated nominations\' runDatabaseValidations method', async () => {

			const props = {
				nominations: [{}]
			};
			const instance = new AwardCeremonyCategory(props);
			spy(instance.nominations[0], 'runDatabaseValidations');
			await instance.runDatabaseValidations();
			assert.calledOnceWithExactly(instance.nominations[0].runDatabaseValidations);

		});

	});

});
