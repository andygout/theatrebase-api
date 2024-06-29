import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CharacterGroup, MaterialBase, OriginalVersionMaterial, SubMaterial, WritingCredit } from '../../../src/models/index.js';

describe('Material model', () => {

	let stubs;

	const CharacterGroupStub = function () {

		return createStubInstance(CharacterGroup);

	};

	const OriginalVersionMaterialStub = function () {

		return createStubInstance(OriginalVersionMaterial);

	};

	const SubMaterialStub = function () {

		return createStubInstance(SubMaterial);

	};

	const WritingCreditStub = function () {

		return createStubInstance(WritingCredit);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateNameIndices: stub().returns([])
			},
			isValidYearModule: {
				isValidYear: stub().returns(false)
			},
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake(arg => arg?.trim() || '')
			},
			models: {
				CharacterGroup: CharacterGroupStub,
				OriginalVersionMaterial: OriginalVersionMaterialStub,
				SubMaterial: SubMaterialStub,
				WritingCredit: WritingCreditStub
			}
		};

		stubs.isValidYearModule.isValidYear.withArgs(1959).returns(true);

	});

	const createSubject = () =>
		esmock('../../../src/models/Material.js', {
			'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
			'../../../src/lib/is-valid-year.js': stubs.isValidYearModule,
			'../../../src/lib/strings.js': stubs.stringsModule,
			'../../../src/models/index.js': stubs.models
		});

	const createInstance = async props => {

		const Material = await createSubject();

		return new Material(props);

	};

	describe('constructor method', () => {

		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {

			await createInstance();
			expect(stubs.stringsModule.getTrimmedOrEmptyString.callCount).to.equal(3);

		});

		describe('subtitle property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const instance = await createInstance({ subtitle: 'Prince of Denmark' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.firstCall, 'Prince of Denmark');
				expect(instance.subtitle).to.equal('Prince of Denmark');

			});

		});

		describe('format property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const instance = await createInstance({ format: 'play' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.secondCall, 'play');
				expect(instance.format).to.equal('play');

			});

		});

		describe('year property', () => {

			context('value cannot be parsed as integer', () => {

				it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

					const instance = await createInstance({ year: 'Nineteen Fifty-Nine' });
					assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.thirdCall, 'Nineteen Fifty-Nine');
					expect(instance.year).to.equal('Nineteen Fifty-Nine');

				});

			});

			context('value can be parsed as integer', () => {

				it('assigns value converted to integer if included in props and value can be parsed as integer', async () => {

					const instance = await createInstance({ year: '1959' });
					expect(instance.year).to.equal(1959);

				});

				it('assigns value with flanking whitespace converted to integer if included in props and value can be parsed as integer', async () => {

					const instance = await createInstance({ year: ' 1959 ' });
					expect(instance.year).to.equal(1959);

				});

				it('assigns value if included in props and is an integer', async () => {

					const instance = await createInstance({ year: 1959 });
					expect(instance.year).to.equal(1959);

				});

			});

		});

		describe('originalVersionMaterial property', () => {

			it('assigns instance if absent from props', async () => {

				const instance = await createInstance({
					name: 'The Seagull',
					differentiator: '2'
				});
				expect(instance.originalVersionMaterial instanceof MaterialBase).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const instance = await createInstance({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});
				expect(instance.originalVersionMaterial instanceof MaterialBase).to.be.true;

			});

		});

		describe('writingCredits property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'The Tragedy of Hamlet' });
				expect(instance.writingCredits).to.deep.equal([]);

			});

			it('assigns array of writingCredits if included in props, retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'The Tragedy of Hamlet',
					writingCredits: [
						{
							name: 'version by'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				};
				const instance = await createInstance(props);
				expect(instance.writingCredits.length).to.equal(3);
				expect(instance.writingCredits[0] instanceof WritingCredit).to.be.true;
				expect(instance.writingCredits[1] instanceof WritingCredit).to.be.true;
				expect(instance.writingCredits[2] instanceof WritingCredit).to.be.true;

			});

		});

		describe('subMaterials property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'The Coast of Utopia' });
				expect(instance.subMaterials).to.deep.equal([]);

			});

			it('assigns array of subMaterials if included in props, retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'Voyage'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				};
				const instance = await createInstance(props);
				expect(instance.subMaterials.length).to.equal(3);
				expect(instance.subMaterials[0] instanceof SubMaterial).to.be.true;
				expect(instance.subMaterials[1] instanceof SubMaterial).to.be.true;
				expect(instance.subMaterials[2] instanceof SubMaterial).to.be.true;

			});

		});

		describe('characterGroups property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'The Tragedy of Hamlet' });
				expect(instance.characterGroups).to.deep.equal([]);

			});

			it('assigns array of characterGroups if included in props, retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'The Tragedy of Hamlet',
					characterGroups: [
						{
							name: 'Court of Elsinore'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				};
				const instance = await createInstance(props);
				expect(instance.characterGroups.length).to.equal(3);
				expect(instance.characterGroups[0] instanceof CharacterGroup).to.be.true;
				expect(instance.characterGroups[1] instanceof CharacterGroup).to.be.true;
				expect(instance.characterGroups[2] instanceof CharacterGroup).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const props = {
				name: 'The Tragedy of Hamlet',
				differentiator: '1',
				subtitle: 'Prince of Denmark',
				writingCredits: [
					{
						name: 'version by'
					}
				],
				subMaterials: [
					{
						name: 'The Murder of Gonzago'
					}
				],
				characterGroups: [
					{
						name: 'Court of Elsinore'
					}
				]
			};
			const instance = await createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			spy(instance, 'validateSubtitle');
			spy(instance, 'validateFormat');
			spy(instance, 'validateYear');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				instance.validateSubtitle,
				instance.validateFormat,
				instance.validateYear,
				instance.originalVersionMaterial.validateName,
				instance.originalVersionMaterial.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.writingCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subMaterials[0].validateName,
				instance.subMaterials[0].validateDifferentiator,
				instance.subMaterials[0].validateNoAssociationWithSelf,
				instance.subMaterials[0].validateUniquenessInGroup,
				instance.characterGroups[0].runInputValidations
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnceWithExactly(instance.validateDifferentiator);
			assert.calledOnceWithExactly(instance.validateSubtitle);
			assert.calledOnceWithExactly(instance.validateFormat, { isRequired: false });
			assert.calledOnceWithExactly(instance.validateYear, { isRequired: false });
			assert.calledOnceWithExactly(instance.originalVersionMaterial.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.originalVersionMaterial.validateDifferentiator);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.writingCredits
			);
			assert.calledOnceWithExactly(
				instance.writingCredits[0].runInputValidations,
				{
					isDuplicate: false,
					subject: {
						name: 'The Tragedy of Hamlet',
						differentiator: '1'
					}
				}
			);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subMaterials
			);
			assert.calledOnceWithExactly(instance.subMaterials[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.subMaterials[0].validateDifferentiator);
			assert.calledOnceWithExactly(
				instance.subMaterials[0].validateNoAssociationWithSelf,
				{ name: 'The Tragedy of Hamlet', differentiator: '1' }
			);
			assert.calledOnceWithExactly(
				instance.subMaterials[0].validateUniquenessInGroup,
				{ isDuplicate: false }
			);
			assert.calledOnceWithExactly(instance.characterGroups[0].runInputValidations);

		});

	});

	describe('validateFormat method', () => {

		it('will call validateStringForProperty method', async () => {

			const instance = await createInstance({ name: 'The Tragedy of Hamlet', format: 'play' });
			spy(instance, 'validateStringForProperty');
			instance.validateFormat({ isRequired: false });
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'format', { isRequired: false }
			);

		});

	});

	describe('validateYear method', () => {

		context('year value equates to false', () => {

			it('will not call isValidYear function or addPropertyError method', async () => {

				const instance = await createInstance({ name: 'The Caretaker', year: '' });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				assert.notCalled(stubs.isValidYearModule.isValidYear);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('year value is not a valid year', () => {

			it('will call isValidYear function and addPropertyError method', async () => {

				const instance = await createInstance({ name: 'The Caretaker', year: 'Nineteen Fifty-Nine' });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				assert.calledOnceWithExactly(stubs.isValidYearModule.isValidYear, 'Nineteen Fifty-Nine');
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'year', 'Value must be a valid year'
				);

			});

		});

		context('year value is a valid year', () => {

			it('will call isValidYear function but not addPropertyError method', async () => {

				const instance = await createInstance({ name: 'The Caretaker', year: 1959 });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				assert.calledOnceWithExactly(stubs.isValidYearModule.isValidYear, 1959);
				assert.notCalled(instance.addPropertyError);

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated subMaterials\' runDatabaseValidations method', async () => {

			const props = {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'Foo',
				originalVersionMaterial: {
					name: 'Ur-Foo'
				},
				writingCredits: [
					{
						model: 'MATERIAL',
						name: 'Pre-Foo'
					}
				],
				subMaterials: [
					{
						name: 'Sub-Foo'
					}
				]
			};
			const instance = await createInstance(props);
			stub(instance, 'validateUniquenessInDatabase');
			await instance.runDatabaseValidations();
			assert.calledOnceWithExactly(instance.validateUniquenessInDatabase);
			assert.calledOnceWithExactly(
				instance.originalVersionMaterial.runDatabaseValidations,
				{ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);
			assert.calledOnceWithExactly(
				instance.writingCredits[0].runDatabaseValidations,
				{ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);
			assert.calledOnceWithExactly(
				instance.subMaterials[0].runDatabaseValidations,
				{ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);

		});

	});

});
