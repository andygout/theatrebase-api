import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Company, Person } from '../../../src/models/index.js';

describe('Review model', () => {

	let stubs;

	const CompanyStub = function () {

		return createStubInstance(Company);

	};

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			isValidDateModule: {
				isValidDate: stub().returns(true)
			},
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake(arg => arg?.trim() || '')
			},
			models: {
				Company: CompanyStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		esmock('../../../src/models/Review.js', {
			'../../../src/lib/is-valid-date.js': stubs.isValidDateModule,
			'../../../src/lib/strings.js': stubs.stringsModule,
			'../../../src/models/index.js': stubs.models
		});

	const createInstance = async props => {

		const Review = await createSubject();

		return new Review(props);

	};

	describe('constructor method', () => {

		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {

			await createInstance();
			expect(stubs.stringsModule.getTrimmedOrEmptyString.callCount).to.equal(2);

		});

		describe('url property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const instance = await createInstance({ url: 'https://www.foo.com' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.firstCall, 'https://www.foo.com');
				expect(instance.url).to.equal('https://www.foo.com');

			});

		});

		describe('date property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const instance = await createInstance({ date: '2024-04-03' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.secondCall, '2024-04-03');
				expect(instance.date).to.equal('2024-04-03');

			});

		});

		describe('publication property', () => {

			it('assigns instance if absent from props', async () => {

				const instance = await createInstance({ url: 'https://www.foo.com' });
				expect(instance.publication instanceof Company).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const instance = await createInstance({
					url: 'https://www.foo.com',
					publication: {
						name: 'Financial Times'
					}
				});
				expect(instance.publication instanceof Company).to.be.true;

			});

		});

		describe('critic property', () => {

			it('assigns instance if absent from props', async () => {

				const instance = await createInstance({ url: 'https://www.foo.com' });
				expect(instance.critic instanceof Person).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const instance = await createInstance({
					name: 'https://www.foo.com',
					critic: {
						name: 'Sarah Hemming'
					}
				});
				expect(instance.critic instanceof Person).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		context('instance url value is non-empty string', () => {

			it('calls instance\'s validate methods and associated models\' validate methods', async () => {

				const props = {
					url: 'https://www.foo.com',
					publication: {
						name: 'Financial Times'
					},
					critic: {
						name: 'Sarah Hemming'
					}
				};
				const instance = await createInstance(props);
				spy(instance, 'validateUrl');
				spy(instance, 'validateUniquenessInGroup');
				spy(instance, 'validateUrlPresenceIfNamedChildren');
				spy(instance, 'validateDate');
				instance.runInputValidations({ isDuplicate: false, duplicatePublicationAndCriticEntities: [] });
				assert.callOrder(
					instance.validateUrl,
					instance.validateUniquenessInGroup,
					instance.validateUrlPresenceIfNamedChildren,
					instance.validateDate,
					instance.publication.validateName,
					instance.publication.validateDifferentiator,
					instance.critic.validateName,
					instance.critic.validateDifferentiator
				);
				assert.calledOnceWithExactly(instance.validateUrl, { isRequired: false });
				assert.calledOnceWithExactly(
					instance.validateUniquenessInGroup,
					{ isDuplicate: false, properties: new Set(['url']) }
				);
				assert.calledOnceWithExactly(
					instance.validateUrlPresenceIfNamedChildren,
					[instance.publication, instance.critic]
				);
				assert.calledOnceWithExactly(instance.validateDate);
				assert.calledOnceWithExactly(instance.publication.validateName, { isRequired: true });
				assert.calledOnceWithExactly(instance.publication.validateDifferentiator);
				assert.calledOnceWithExactly(instance.critic.validateName, { isRequired: true });
				assert.calledOnceWithExactly(instance.critic.validateDifferentiator);

			});

		});

		context('instance url value is empty string', () => {

			it('calls instance\'s publication and critic validateName methods with an argument that it is not required', async () => {

				const props = {
					url: '',
					publication: {
						name: 'Financial Times'
					},
					critic: {
						name: 'Sarah Hemming'
					}
				};
				const instance = await createInstance(props);
				instance.runInputValidations({ isDuplicate: false });
				assert.calledOnceWithExactly(instance.publication.validateName, { isRequired: false });
				assert.calledOnceWithExactly(instance.critic.validateName, { isRequired: false });

			});

		});

	});

	describe('validateUrl method', () => {

		it('will call validateStringForProperty method', async () => {

			const instance = await createInstance({ url: 'https://www.foo.com' });
			spy(instance, 'validateStringForProperty');
			instance.validateUrl({ isRequired: false });
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'url', { isRequired: false }
			);

		});

		context('url property is a valid URL', () => {

			it('will not call addPropertyError method', async () => {

				const instance = await createInstance({ url: 'https://www.foo.com' });
				spy(instance, 'addPropertyError');
				instance.validateUrl({ isRequired: false });
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('url property is an empty string', () => {

			it('will not call addPropertyError method', async () => {

				const instance = await createInstance({ url: '' });
				spy(instance, 'addPropertyError');
				instance.validateUrl({ isRequired: false });
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('url property is a non-empty string that is not a valid URL', () => {

			it('will call addPropertyError method', async () => {

				const instance = await createInstance({ url: 'foobar' });
				spy(instance, 'addPropertyError');
				instance.validateUrl({ isRequired: false });
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'url', 'URL must be a valid URL'
				);

			});

		});

	});

	describe('validateUrlPresenceIfNamedChildren method', () => {

		it('will call validatePropertyPresenceIfNamedChildren', async () => {

			const instance = await createInstance();
			spy(instance, 'validatePropertyPresenceIfNamedChildren');
			instance.validateUrlPresenceIfNamedChildren([{ name: 'Financial Times' }, { name: 'Sarah Hemming' }]);
			assert.calledOnceWithExactly(
				instance.validatePropertyPresenceIfNamedChildren,
				'url', [{ name: 'Financial Times' }, { name: 'Sarah Hemming' }]
			);

		});

	});

	describe('validateDate method', () => {

		context('valid data', () => {

			context('date is an empty string', () => {

				it('will not call isValidDate or addPropertyError method', async () => {

					const instance = await createInstance({ date: '' });
					spy(instance, 'addPropertyError');
					instance.validateDate();
					assert.notCalled(stubs.isValidDateModule.isValidDate);
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('date is in a valid date format', () => {

				it('will call isValidDate; will not call addPropertyError method', async () => {

					const instance = await createInstance({ date: '2024-04-03' });
					spy(instance, 'addPropertyError');
					instance.validateDate();
					assert.calledOnceWithExactly(stubs.isValidDateModule.isValidDate, instance.date);
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			context('date is in an invalid date format', () => {

				it('will call isValidDate and addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate.returns(false);
					const instance = await createInstance({ date: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDate();
					assert.calledOnceWithExactly(stubs.isValidDateModule.isValidDate, instance.date);
					assert.calledOnceWithExactly(instance.addPropertyError, 'date', 'Value must be in date format');

				});

			});

		});

	});

});
