import { expect } from 'chai';
import esmock from 'esmock';
import { assert, spy, stub } from 'sinon';

import { Nomination, ProductionIdentifier, Review } from '../../../src/models/index.js';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Base model', () => {

	let stubs;

	beforeEach(() => {

		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake(arg => arg?.trim() || '')
			},
			validateStringModule: {
				validateString: stub().returns(undefined)
			}
		};

		stubs.validateStringModule.validateString
			.withArgs('', { isRequired: true }).returns('Value is too short');
		stubs.validateStringModule.validateString
			.withArgs(ABOVE_MAX_LENGTH_STRING, { isRequired: false }).returns('Value is too long');

	});

	const createSubject = (model = 'Base') =>
		esmock(
			`../../../src/models/${model}.js`,
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when instances of class extensions of the Base class are tested.
			{
				'../../../src/lib/strings.js': stubs.stringsModule,
				'../../../src/lib/validate-string.js': stubs.validateStringModule
			}
		);

	describe('constructor method', () => {

		describe('name property', () => {

			context('model is not exempt', () => {

				it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					assert.calledOnceWithExactly(stubs.stringsModule.getTrimmedOrEmptyString, 'Foobar');
					expect(instance.name).to.equal('Foobar');

				});

			});

			context('model is exempt', () => {

				context('model is Nomination', () => {

					it('does not assign name property', async () => {

						const Nomination = await createSubject('Nomination');
						const instance = new Nomination({ name: '1' });
						expect(instance).to.not.have.property('name');

					});

				});

				context('model is ProductionIdentifier', () => {

					it('does not assign name property', async () => {

						const ProductionIdentifier = await createSubject('ProductionIdentifier');
						const instance = new ProductionIdentifier({
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							name: '1'
						});
						expect(instance).to.not.have.property('name');

					});

				});

				context('model is Review', () => {

					it('does not assign name property', async () => {

						const Review = await createSubject('Review');
						const instance = new Review({
							url: 'https://www.foo.com',
							name: 'foo'
						});
						expect(instance).to.not.have.property('name');

					});

				});

			});

		});

	});

	describe('validateName method', () => {

		it('will call validateStringForProperty method', async () => {

			const Base = await createSubject();
			const instance = new Base();
			spy(instance, 'validateStringForProperty');
			instance.validateName({ isRequired: false });
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'name', { isRequired: false }
			);

		});

	});

	describe('validateQualifier method', () => {

		it('will call validateStringForProperty method', async () => {

			const Base = await createSubject();
			const instance = new Base();
			spy(instance, 'validateStringForProperty');
			instance.validateQualifier();
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'qualifier', { isRequired: false }
			);

		});

	});

	describe('validateStringForProperty method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				const Base = await createSubject();
				const instance = new Base();
				spy(instance, 'addPropertyError');
				instance.validateStringForProperty('name', { isRequired: false });
				assert.calledOnceWithExactly(
					stubs.validateStringModule.validateString,
					instance.name, { isRequired: false }
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data', () => {

			it('will call addPropertyError method', async () => {

				const Base = await createSubject();
				const instance = new Base({ name: '' });
				spy(instance, 'addPropertyError');
				instance.validateStringForProperty('name', { isRequired: true });
				assert.callOrder(
					stubs.validateStringModule.validateString,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(
					stubs.validateStringModule.validateString,
					instance.name, { isRequired: true }
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'name', 'Value is too short'
				);

			});

		});

	});

	describe('validateUniquenessInGroup method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				const Base = await createSubject();
				const instance = new Base({ name: 'Foobar' });
				spy(instance, 'addPropertyError');
				const opts = { isDuplicate: false };
				instance.validateUniquenessInGroup(opts);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data', () => {

			context('instance does not have differentiator, characterDifferentiator, qualifier, or group property', () => {

				it('will call addPropertyError method with group context error text for name property only', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'name', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has underlyingName property', () => {

				it('will call addPropertyError method with group context error text for name and underlyingName properties', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					instance.underlyingName = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'underlyingName', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has characterName property', () => {

				it('will call addPropertyError method with group context error text for name and characterName properties', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					instance.characterName = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'characterName', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has differentiator property', () => {

				it('will call addPropertyError method with group context error text for name and differentiator properties', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					instance.differentiator = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'differentiator', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has characterDifferentiator property', () => {

				it('will call addPropertyError method with group context error text for name and differentiator properties', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					instance.characterDifferentiator = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'characterDifferentiator', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has qualifier property', () => {

				it('will call addPropertyError method with group context error text for name and qualifier properties', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					instance.qualifier = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'qualifier', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has group property', () => {

				it('will call addPropertyError method with group context error text for name property', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'name', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has differentiator, characterDifferentiator, qualifier, and group property', () => {

				it('will call addPropertyError method with group context error text for name, differentiator, and qualifier properties', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					instance.differentiator = '';
					instance.characterDifferentiator = '';
					instance.qualifier = '';
					instance.group = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.callCount).to.equal(4);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'differentiator', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.thirdCall,
						'characterDifferentiator', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(3),
						'qualifier', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has uuid property which is specified via opts argument as requiring an error assigned to it', () => {

				it('will call addPropertyError method with group context error text for uuid property only (i.e. not name property)', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					instance.uuid = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true, properties: new Set(['uuid']) };
					instance.validateUniquenessInGroup(opts);
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'uuid', 'This item has been duplicated within the group'
					);

				});

			});

		});

	});

	describe('validateNamePresenceIfNamedChildren method', () => {

		it('will call validatePropertyPresenceIfNamedChildren', async () => {

			const Base = await createSubject();
			const instance = new Base({ name: 'Foobar' });
			spy(instance, 'validatePropertyPresenceIfNamedChildren');
			instance.validateNamePresenceIfNamedChildren([{ name: 'Foo' }, { name: 'Bar' }]);
			assert.calledOnceWithExactly(
				instance.validatePropertyPresenceIfNamedChildren,
				'name', [{ name: 'Foo' }, { name: 'Bar' }]
			);

		});

	});

	describe('validatePropertyPresenceIfNamedChildren method', () => {

		context('valid data', () => {

			context('instance does not have name nor any children with names', () => {

				it('will not add properties to errors property', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: '' });
					instance.name = '';
					spy(instance, 'addPropertyError');
					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: '' }]);
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('instance has a name and no children with names', () => {

				it('will not add properties to errors property', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					spy(instance, 'addPropertyError');
					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: '' }]);
					assert.notCalled(instance.addPropertyError);
				});

			});

			context('instance has a name and children with names', () => {

				it('will not add properties to errors property', async () => {

					const Base = await createSubject();
					const instance = new Base({ name: 'Foobar' });
					spy(instance, 'addPropertyError');
					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: 'Bar' }]);
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			it('adds properties to errors property', async () => {

				const Base = await createSubject();
				const instance = new Base({ name: '' });
				instance.name = '';
				spy(instance, 'addPropertyError');
				instance.validatePropertyPresenceIfNamedChildren('name', [{ name: 'Bar' }]);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'name', 'Value is required if named children exist'
				);

			});

		});

	});

	describe('addPropertyError method', () => {

		context('property exists on errors object', () => {

			it('merges error into existing array', async () => {

				const Base = await createSubject();
				const instance = new Base({ name: 'Foobar' });
				instance.errors.name = ['Value is too long'];
				instance.addPropertyError('name', 'Name has been duplicated in this group');
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.equal(['Value is too long', 'Name has been duplicated in this group']);

			});

		});

		context('property does not exist on errors object', () => {

			it('adds new property to errors object and assigns a value of an array containing error text', async () => {

				const Base = await createSubject();
				const instance = new Base({ name: 'Foobar' });
				instance.errors.name = ['Name has been duplicated in this group'];
				instance.addPropertyError('characterName', 'Value is too long');
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.equal(['Name has been duplicated in this group']);
				expect(instance.errors)
					.to.have.property('characterName')
					.that.is.an('array')
					.that.deep.equal(['Value is too long']);

			});

		});

	});

});
