import { expect } from 'chai';
import { assert, spy } from 'sinon';

import CharacterDepiction from '../../../src/models/CharacterDepiction';

describe('CharacterDepiction model', () => {

	describe('constructor method', () => {

		describe('underlyingName property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new CharacterDepiction({ name: 'Prince Hal' });
				expect(instance.underlyingName).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: '' });
				expect(instance.underlyingName).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: ' ' });
				expect(instance.underlyingName).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });
				expect(instance.underlyingName).to.equal('King Henry V');

			});

			it('trims value before assigning', () => {

				const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: ' King Henry V ' });
				expect(instance.underlyingName).to.equal('King Henry V');

			});

		});

		describe('qualifier property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new CharacterDepiction({ name: 'Esme' });
				expect(instance.qualifier).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new CharacterDepiction({ name: 'Esme', qualifier: '' });
				expect(instance.qualifier).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new CharacterDepiction({ name: 'Esme', qualifier: ' ' });
				expect(instance.qualifier).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = new CharacterDepiction({ name: 'Esme', qualifier: 'older' });
				expect(instance.qualifier).to.equal('older');

			});

			it('trims value before assigning', () => {

				const instance = new CharacterDepiction({ name: 'Esme', qualifier: ' older ' });
				expect(instance.qualifier).to.equal('older');

			});

		});

	});

	describe('validateUnderlyingName method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });
			spy(instance, 'validateStringForProperty');
			instance.validateUnderlyingName();
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(
				instance.validateStringForProperty,
				'underlyingName', { isRequired: false }
			);

		});

	});

	describe('validateCharacterNameUnderlyingNameDisparity method', () => {

		context('valid data', () => {

			context('role name without a character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: '' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('role name and different character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('no role name and no character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new CharacterDepiction({ name: '', underlyingName: '' });
					spy(instance, 'addPropertyError');
					instance.validateCharacterNameUnderlyingNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new CharacterDepiction({ name: 'King Henry V', underlyingName: 'King Henry V' });
				spy(instance, 'addPropertyError');
				instance.validateCharacterNameUnderlyingNameDisparity();
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'underlyingName', 'Underlying name is only required if different from character name'
				);

			});

		});

	});

});
