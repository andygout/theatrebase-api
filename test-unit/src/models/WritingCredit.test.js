import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Company, Person, SourceMaterial } from '../../../src/models/index.js';

describe('WritingCredit model', () => {

	let stubs;

	const CompanyStub = function () {

		return createStubInstance(Company);

	};

	const SourceMaterialStub = function () {

		return createStubInstance(SourceMaterial);

	};

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateEntityIndices: stub().returns([])
			},
			models: {
				Company: CompanyStub,
				SourceMaterial: SourceMaterialStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		esmock('../../../src/models/WritingCredit.js', {
			'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
			'../../../src/models/index.js': stubs.models
		});

	const createInstance = async props => {

		const WritingCredit = await createSubject();

		return new WritingCredit(props);

	};

	describe('constructor method', () => {

		describe('creditType property', () => {

			it('assigns null if absent from props', async () => {

				const instance = await createInstance({ name: '' });
				expect(instance.creditType).to.equal(null);

			});

			it('assigns null if included in props but value is not an accepted credit type', async () => {

				const instance = await createInstance({ name: '', creditType: 'foobar' });
				expect(instance.creditType).to.equal(null);

			});

			it('assigns value if included in props and is an accepted credit type', async () => {

				const creditTypes = [
					'NON_SPECIFIC_SOURCE_MATERIAL',
					'RIGHTS_GRANTOR'
				];

				for (const creditType of creditTypes) {

					const instance = await createInstance({ name: '', creditType });
					expect(instance.creditType).to.equal(creditType);

				};

			});

		});

		describe('entities property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'version by' });
				expect(instance.entities).to.deep.equal([]);

			});

			it('assigns array of writers and materials if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'version by',
					entities: [
						{
							name: 'David Eldridge'
						},
						{
							model: 'COMPANY',
							name: 'Told by an Idiot'
						},
						{
							model: 'MATERIAL',
							name: 'A Midsummer Night\'s Dream'
						},
						{
							name: ''
						},
						{
							model: 'COMPANY',
							name: ''
						},
						{
							model: 'MATERIAL',
							name: ''
						},
						{
							name: ' '
						},
						{
							model: 'COMPANY',
							name: ' '
						},
						{
							model: 'MATERIAL',
							name: ' '
						}
					]
				};
				const instance = await createInstance(props);
				expect(instance.entities.length).to.equal(9);
				expect(instance.entities[0] instanceof Person).to.be.true;
				expect(instance.entities[1] instanceof Company).to.be.true;
				expect(instance.entities[2] instanceof SourceMaterial).to.be.true;
				expect(instance.entities[3] instanceof Person).to.be.true;
				expect(instance.entities[4] instanceof Company).to.be.true;
				expect(instance.entities[5] instanceof SourceMaterial).to.be.true;
				expect(instance.entities[6] instanceof Person).to.be.true;
				expect(instance.entities[7] instanceof Company).to.be.true;
				expect(instance.entities[8] instanceof SourceMaterial).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const props = {
				name: 'version by',
				entities: [
					{
						name: 'David Eldridge'
					},
					{
						model: 'COMPANY',
						name: 'Told by an Idiot'
					},
					{
						model: 'MATERIAL',
						name: 'A Midsummer Night\'s Dream'
					}
				]
			};
			const instance = await createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			instance.runInputValidations(
				{ isDuplicate: false, subject: { name: 'The Indian Boy', differentiator: '1' } }
			);
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateEntityIndices,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[2].validateName,
				instance.entities[2].validateDifferentiator,
				instance.entities[2].validateUniquenessInGroup,
				instance.entities[2].validateNoAssociationWithSelf
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateEntityIndices,
				instance.entities
			);
			assert.calledOnceWithExactly(instance.entities[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.entities[0].validateDifferentiator);
			assert.calledOnceWithExactly(instance.entities[0].validateUniquenessInGroup, { isDuplicate: false });
			assert.notCalled(instance.entities[0].validateNoAssociationWithSelf);
			assert.calledOnceWithExactly(instance.entities[1].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.entities[1].validateDifferentiator);
			assert.calledOnceWithExactly(instance.entities[1].validateUniquenessInGroup, { isDuplicate: false });
			assert.notCalled(instance.entities[1].validateNoAssociationWithSelf);
			assert.calledOnceWithExactly(instance.entities[2].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.entities[2].validateDifferentiator);
			assert.calledOnceWithExactly(instance.entities[2].validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnceWithExactly(
				instance.entities[2].validateNoAssociationWithSelf,
				{ name: 'The Indian Boy', differentiator: '1' }
			);

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated subMaterials\' runDatabaseValidations method', async () => {

			const props = {
				name: 'version by',
				entities: [
					{
						name: 'David Eldridge'
					},
					{
						model: 'COMPANY',
						name: 'Told by an Idiot'
					},
					{
						model: 'MATERIAL',
						name: 'A Midsummer Night\'s Dream'
					}
				]
			};
			const instance = await createInstance(props);
			await instance.runDatabaseValidations({ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
			assert.notCalled(instance.entities[0].runDatabaseValidations);
			assert.notCalled(instance.entities[1].runDatabaseValidations);
			assert.calledOnceWithExactly(
				instance.entities[2].runDatabaseValidations,
				{ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);

		});

	});

});
