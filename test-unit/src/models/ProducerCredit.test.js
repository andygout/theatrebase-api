import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CompanyWithMembers, Person } from '../../../src/models/index.js';

describe('ProducerCredit model', () => {

	let stubs;

	const CompanyWithMembersStub = function () {

		return createStubInstance(CompanyWithMembers);

	};

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateEntityInfoModule: {
				getDuplicateEntities: stub().returns('getDuplicateEntities response'),
				isEntityInArray: stub().returns(false)
			},
			models: {
				CompanyWithMembers: CompanyWithMembersStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		esmock('../../../src/models/ProducerCredit.js', {
			'../../../src/lib/get-duplicate-entity-info.js': stubs.getDuplicateEntityInfoModule,
			'../../../src/models/index.js': stubs.models
		});

	const createInstance = async props => {

		const ProducerCredit = await createSubject();

		return new ProducerCredit(props);

	};

	describe('constructor method', () => {

		describe('entities property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'in association with' });
				expect(instance.entities).to.deep.equal([]);

			});

			it('assigns array of producers if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'in association with',
					entities: [
						{
							name: 'Jason Haigh-Ellery'
						},
						{
							model: 'COMPANY',
							name: 'Stage Entertainment UK'
						},
						{
							name: ''
						},
						{
							model: 'COMPANY',
							name: ''
						},
						{
							name: ' '
						},
						{
							model: 'COMPANY',
							name: ' '
						}
					]
				};
				const instance = await createInstance(props);
				expect(instance.entities.length).to.equal(6);
				expect(instance.entities[0] instanceof Person).to.be.true;
				expect(instance.entities[1] instanceof CompanyWithMembers).to.be.true;
				expect(instance.entities[2] instanceof Person).to.be.true;
				expect(instance.entities[3] instanceof CompanyWithMembers).to.be.true;
				expect(instance.entities[4] instanceof Person).to.be.true;
				expect(instance.entities[5] instanceof CompanyWithMembers).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const props = {
				name: 'in association with',
				entities: [
					{
						name: 'Jason Haigh-Ellery'
					},
					{
						model: 'COMPANY',
						name: 'Fiery Angel'
					}
				]
			};
			const instance = await createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[1].runInputValidations
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnceWithExactly(
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities
			);
			assert.calledOnceWithExactly(instance.entities[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.entities[0].validateDifferentiator);
			assert.calledTwice(stubs.getDuplicateEntityInfoModule.isEntityInArray);
			assert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.firstCall,
				instance.entities[0], 'getDuplicateEntities response'
			);
			assert.calledOnceWithExactly(instance.entities[0].validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnceWithExactly(instance.entities[1].validateName, { isRequired: false });
			assert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.secondCall,
				instance.entities[1], 'getDuplicateEntities response'
			);
			assert.calledOnceWithExactly(instance.entities[1].validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnceWithExactly(
				instance.entities[1].runInputValidations,
				{ duplicateEntities: 'getDuplicateEntities response' }
			);

		});

	});

});
