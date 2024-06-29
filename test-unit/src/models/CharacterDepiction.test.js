import { expect } from 'chai';
import esmock from 'esmock';
import { assert, spy, stub } from 'sinon';

describe('CharacterDepiction model', () => {

	let stubs;

	beforeEach(() => {

		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake(arg => arg?.trim() || '')
			}
		};

	});

	const createSubject = () =>
		esmock('../../../src/models/CharacterDepiction.js', {
			'../../../src/lib/strings.js': stubs.stringsModule
		});

	describe('constructor method', () => {

		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {

			const CharacterDepiction = await createSubject();
			new CharacterDepiction();
			expect(stubs.stringsModule.getTrimmedOrEmptyString.callCount).to.equal(2);

		});

		describe('underlyingName property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const CharacterDepiction = await createSubject();
				const instance = new CharacterDepiction({ underlyingName: 'King Henry V' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.firstCall, 'King Henry V');
				expect(instance.underlyingName).to.equal('King Henry V');

			});

		});

		describe('qualifier property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const CharacterDepiction = await createSubject();
				const instance = new CharacterDepiction({ qualifier: 'older' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.secondCall, 'older');
				expect(instance.qualifier).to.equal('older');

			});

		});

	});

	describe('validateUnderlyingName method', () => {

		it('will call validateStringForProperty method', async () => {

			const CharacterDepiction = await createSubject();
			const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });
			spy(instance, 'validateStringForProperty');
			instance.validateUnderlyingName();
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'underlyingName', { isRequired: false }
			);

		});

	});

	describe('validateCharacterNameUnderlyingNameDisparity method', () => {

		context('valid data', () => {

			context('role name without a character name', () => {

				it('will not add properties to errors property', async () => {

					const CharacterDepiction = await createSubject();
					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: '' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('role name and different character name', () => {

				it('will not add properties to errors property', async () => {

					const CharacterDepiction = await createSubject();
					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('no role name and no character name', () => {

				it('will not add properties to errors property', async () => {

					const CharacterDepiction = await createSubject();
					const instance = new CharacterDepiction({ name: '', underlyingName: '' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', async () => {

				const CharacterDepiction = await createSubject();
				const instance = new CharacterDepiction({ name: 'King Henry V', underlyingName: 'King Henry V' });
				spy(instance, 'addPropertyError');
				instance.validateCharacterNameUnderlyingNameDisparity();
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'underlyingName', 'Underlying name is only required if different from character name'
				);

			});

		});

	});

});
