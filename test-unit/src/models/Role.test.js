import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as stringsModule from '../../../src/lib/strings.js';
import Role from '../../../src/models/Role.js';

let stubs;

const sandbox = createSandbox();

describe('Role model', () => {

	beforeEach(() => {

		stubs = {
			getTrimmedOrEmptyString:
				sandbox.stub(stringsModule, 'getTrimmedOrEmptyString').callsFake(arg => arg?.trim() || '')
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		it('calls getTrimmedOrEmptyString to get values to assign to properties', () => {

			new Role();
			expect(stubs.getTrimmedOrEmptyString.callCount).to.equal(4);

		});

		describe('characterName property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', () => {

				const instance = new Role({ characterName: 'Hamlet' });
				assert.calledWithExactly(stubs.getTrimmedOrEmptyString.secondCall, 'Hamlet');
				expect(instance.characterName).to.equal('Hamlet');

			});

		});

		describe('characterDifferentiator property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', () => {

				const instance = new Role({ characterDifferentiator: '1' });
				assert.calledWithExactly(stubs.getTrimmedOrEmptyString.thirdCall, '1');
				expect(instance.characterDifferentiator).to.equal('1');

			});

		});

		describe('qualifier property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', () => {

				const instance = new Role({ qualifier: 'younger' });
				assert.calledWithExactly(stubs.getTrimmedOrEmptyString.getCall(3), 'younger');
				expect(instance.qualifier).to.equal('younger');

			});

		});

		describe('isAlternate property', () => {

			it('assigns false if absent from props', () => {

				const instance = new Role({ name: 'Young Lucius' });
				expect(instance.isAlternate).to.equal(false);

			});

			it('assigns false if included in props but value evaluates to false', () => {

				const instance = new Role({ name: 'Young Lucius', isAlternate: null });
				expect(instance.isAlternate).to.equal(false);

			});

			it('assigns false if included in props but value is false', () => {

				const instance = new Role({ name: 'Young Lucius', isAlternate: false });
				expect(instance.isAlternate).to.equal(false);

			});

			it('assigns true if included in props and value evaluates to true', () => {

				const instance = new Role({ name: 'Young Lucius', isAlternate: 'foobar' });
				expect(instance.isAlternate).to.equal(true);

			});

			it('assigns true if included in props and value is true', () => {

				const instance = new Role({ name: 'Young Lucius', isAlternate: true });
				expect(instance.isAlternate).to.equal(true);

			});

		});

	});

	describe('validateCharacterName method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
			spy(instance, 'validateStringForProperty');
			instance.validateCharacterName();
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'characterName', { isRequired: false }
			);

		});

	});

	describe('validateCharacterDifferentiator method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Role({ name: 'Cinna', characterDifferentiator: '1' });
			spy(instance, 'validateStringForProperty');
			instance.validateCharacterDifferentiator();
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'characterDifferentiator', { isRequired: false }
			);

		});

	});

	describe('validateRoleNameCharacterNameDisparity method', () => {

		context('valid data', () => {

			context('role name without a character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: 'Hamlet', characterName: '' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('role name and different character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('no role name and no character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: '', characterName: '' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Role({ name: 'Hamlet', characterName: 'Hamlet' });
				spy(instance, 'addPropertyError');
				instance.validateRoleNameCharacterNameDisparity();
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'characterName', 'Character name is only required if different from role name'
				);

			});

		});

	});

});
