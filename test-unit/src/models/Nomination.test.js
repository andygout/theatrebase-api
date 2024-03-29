import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CompanyWithMembers, MaterialBase, NominatedProductionIdentifier, Person } from '../../../src/models';

describe('Nomination model', () => {

	let stubs;

	const CompanyWithMembersStub = function () {

		return createStubInstance(CompanyWithMembers);

	};

	const MaterialBaseStub = function () {

		return createStubInstance(MaterialBase);

	};

	const NominatedProductionIdentifierStub = function () {

		return createStubInstance(NominatedProductionIdentifier);

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
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateProductionIdentifierIndices: stub().returns([])
			},
			models: {
				CompanyWithMembers: CompanyWithMembersStub,
				MaterialBase: MaterialBaseStub,
				NominatedProductionIdentifier: NominatedProductionIdentifierStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Nomination', {
			'../lib/get-duplicate-entity-info': stubs.getDuplicateEntityInfoModule,
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Nomination = createSubject();

		return new Nomination(props);

	};

	describe('constructor method', () => {

		describe('isWinner property', () => {

			it('assigns false if absent from props', () => {

				const instance = createInstance({});
				expect(instance.isWinner).to.equal(false);

			});

			it('assigns false if included in props but value evaluates to false', () => {

				const instance = createInstance({ isWinner: null });
				expect(instance.isWinner).to.equal(false);

			});

			it('assigns false if included in props but value is false', () => {

				const instance = createInstance({ isWinner: false });
				expect(instance.isWinner).to.equal(false);

			});

			it('assigns true if included in props and value evaluates to true', () => {

				const instance = createInstance({ isWinner: 'foobar' });
				expect(instance.isWinner).to.equal(true);

			});

			it('assigns true if included in props and is true', () => {

				const instance = createInstance({ isWinner: true });
				expect(instance.isWinner).to.equal(true);

			});

		});

		describe('customType property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({});
				expect(instance.customType).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ customType: '' });
				expect(instance.customType).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ customType: ' ' });
				expect(instance.customType).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = createInstance({ customType: 'Shortlisted' });
				expect(instance.customType).to.equal('Shortlisted');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ customType: ' Shortlisted ' });
				expect(instance.customType).to.equal('Shortlisted');

			});

		});

		describe('entities property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({});
				expect(instance.entities).to.deep.equal([]);

			});

			it('assigns array of entities if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', () => {

				const props = {
					entities: [
						{
							name: 'Simon Baker'
						},
						{
							model: 'COMPANY',
							name: 'Autograph'
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
				const instance = createInstance(props);
				expect(instance.entities.length).to.equal(6);
				expect(instance.entities[0] instanceof Person).to.be.true;
				expect(instance.entities[1] instanceof CompanyWithMembers).to.be.true;
				expect(instance.entities[2] instanceof Person).to.be.true;
				expect(instance.entities[3] instanceof CompanyWithMembers).to.be.true;
				expect(instance.entities[4] instanceof Person).to.be.true;
				expect(instance.entities[5] instanceof CompanyWithMembers).to.be.true;

			});

		});

		describe('productions property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({});
				expect(instance.productions).to.deep.equal([]);

			});

			it('assigns array of productions if included in props, retaining those with empty or whitespace-only string uuids', () => {

				const props = {
					productions: [
						{
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						},
						{
							uuid: ''
						},
						{
							uuid: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.productions.length).to.equal(3);
				expect(instance.productions[0] instanceof NominatedProductionIdentifier).to.be.true;
				expect(instance.productions[1] instanceof NominatedProductionIdentifier).to.be.true;
				expect(instance.productions[2] instanceof NominatedProductionIdentifier).to.be.true;

			});

		});

		describe('materials property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({});
				expect(instance.materials).to.deep.equal([]);

			});

			it('assigns array of materials if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					materials: [
						{
							name: 'Baghdad Wedding'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.materials.length).to.equal(3);
				expect(instance.materials[0] instanceof MaterialBase).to.be.true;
				expect(instance.materials[1] instanceof MaterialBase).to.be.true;
				expect(instance.materials[2] instanceof MaterialBase).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				customType: 'Shortlisted',
				entities: [
					{
						name: 'Simon Baker'
					},
					{
						model: 'COMPANY',
						name: 'Autograph'
					}
				],
				productions: [
					{
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				],
				materials: [
					{
						name: 'Baghdad Wedding'
					}
				]
			};
			const instance = createInstance(props);
			spy(instance, 'validateCustomType');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateCustomType,
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[1].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateProductionIdentifierIndices,
				instance.productions[0].validateUuid,
				instance.productions[0].validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.materials[0].validateName,
				instance.materials[0].validateDifferentiator,
				instance.materials[0].validateUniquenessInGroup
			);
			assert.calledOnce(instance.validateCustomType);
			assert.calledWithExactly(instance.validateCustomType, { isRequired: false });
			assert.calledOnce(stubs.getDuplicateEntityInfoModule.getDuplicateEntities);
			assert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities
			);
			assert.calledOnce(instance.entities[0].validateName);
			assert.calledWithExactly(instance.entities[0].validateName, { isRequired: false });
			assert.calledOnce(instance.entities[0].validateDifferentiator);
			assert.calledWithExactly(instance.entities[0].validateDifferentiator);
			assert.calledTwice(stubs.getDuplicateEntityInfoModule.isEntityInArray);
			assert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.getCall(0),
				instance.entities[0], 'getDuplicateEntities response'
			);
			assert.calledOnce(instance.entities[0].validateUniquenessInGroup);
			assert.calledWithExactly(instance.entities[0].validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnce(instance.entities[1].validateName);
			assert.calledWithExactly(instance.entities[1].validateName, { isRequired: false });
			assert.calledOnce(instance.entities[1].validateDifferentiator);
			assert.calledWithExactly(instance.entities[1].validateDifferentiator);
			assert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.getCall(1),
				instance.entities[1], 'getDuplicateEntities response'
			);
			assert.calledOnce(instance.entities[1].validateUniquenessInGroup);
			assert.calledWithExactly(instance.entities[1].validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnce(instance.entities[1].runInputValidations);
			assert.calledWithExactly(
				instance.entities[1].runInputValidations,
				{ duplicateEntities: 'getDuplicateEntities response' }
			);
			assert.calledOnce(stubs.getDuplicateIndicesModule.getDuplicateProductionIdentifierIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateProductionIdentifierIndices,
				instance.productions
			);
			assert.calledOnce(instance.productions[0].validateUuid);
			assert.calledWithExactly(instance.productions[0].validateUuid);
			assert.calledOnce(instance.productions[0].validateUniquenessInGroup);
			assert.calledWithExactly(
				instance.productions[0].validateUniquenessInGroup,
				{ isDuplicate: false, properties: new Set(['uuid']) }
			);
			assert.calledOnce(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.materials
			);
			assert.calledOnce(instance.materials[0].validateName);
			assert.calledWithExactly(instance.materials[0].validateName, { isRequired: false });
			assert.calledOnce(instance.materials[0].validateDifferentiator);
			assert.calledWithExactly(instance.materials[0].validateDifferentiator);
			assert.calledOnce(instance.materials[0].validateUniquenessInGroup);
			assert.calledWithExactly(
				instance.materials[0].validateUniquenessInGroup,
				{ isDuplicate: false }
			);

		});

	});

	describe('validateCustomType method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = createInstance({ customType: 'Shortlisted' });
			spy(instance, 'validateStringForProperty');
			instance.validateCustomType({ isRequired: false });
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(
				instance.validateStringForProperty,
				'customType', { isRequired: false }
			);

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated productions\' runDatabaseValidations method', async () => {

			const props = {
				productions: [
					{
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				]
			};
			const instance = createInstance(props);
			await instance.runDatabaseValidations();
			assert.calledOnce(instance.productions[0].runDatabaseValidations);
			assert.calledWithExactly(instance.productions[0].runDatabaseValidations);

		});

	});

});
