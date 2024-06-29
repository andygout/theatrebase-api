import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import {
	CastMember,
	CreativeCredit,
	CrewCredit,
	FestivalBase,
	MaterialBase,
	ProducerCredit,
	Review,
	Season,
	SubProductionIdentifier,
	VenueBase
} from '../../../src/models/index.js';

describe('Production model', () => {

	let stubs;

	const CastMemberStub = function () {

		return createStubInstance(CastMember);

	};

	const CreativeCreditStub = function () {

		return createStubInstance(CreativeCredit);

	};

	const CrewCreditStub = function () {

		return createStubInstance(CrewCredit);

	};

	const FestivalBaseStub = function () {

		return createStubInstance(FestivalBase);

	};

	const MaterialBaseStub = function () {

		return createStubInstance(MaterialBase);

	};

	const ProducerCreditStub = function () {

		return createStubInstance(ProducerCredit);

	};

	const ReviewStub = function () {

		return createStubInstance(Review);

	};

	const SeasonStub = function () {

		return createStubInstance(Season);

	};

	const SubProductionIdentifierStub = function () {

		return createStubInstance(SubProductionIdentifier);

	};

	const VenueBaseStub = function () {

		return createStubInstance(VenueBase);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateNameIndices: stub().returns([]),
				getDuplicateUuidIndices: stub().returns([]),
				getDuplicateUrlIndices: stub().returns([])
			},
			isValidDateModule: {
				isValidDate: stub().returns(false)
			},
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake(arg => arg?.trim() || '')
			},
			models: {
				CastMember: CastMemberStub,
				CreativeCredit: CreativeCreditStub,
				CrewCredit: CrewCreditStub,
				FestivalBase: FestivalBaseStub,
				MaterialBase: MaterialBaseStub,
				ProducerCredit: ProducerCreditStub,
				Review: ReviewStub,
				Season: SeasonStub,
				SubProductionIdentifier: SubProductionIdentifierStub,
				VenueBase: VenueBaseStub
			}
		};

	});

	const createSubject = () =>
		esmock('../../../src/models/Production.js', {
			'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
			'../../../src/lib/is-valid-date.js': stubs.isValidDateModule,
			'../../../src/lib/strings.js': stubs.stringsModule,
			'../../../src/models/index.js': stubs.models
		});

	const createInstance = async props => {

		const Production = await createSubject();

		return new Production(props);

	};

	describe('constructor method', () => {

		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {

			await createInstance();
			expect(stubs.stringsModule.getTrimmedOrEmptyString.callCount).to.equal(4);

		});

		describe('subtitle property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const instance = await createInstance({ subtitle: 'Prince of Denmark' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.firstCall, 'Prince of Denmark');
				expect(instance.subtitle).to.equal('Prince of Denmark');

			});

		});

		describe('startDate property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const instance = await createInstance({ startDate: '2010-09-30' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.secondCall, '2010-09-30');
				expect(instance.startDate).to.equal('2010-09-30');

			});

		});

		describe('pressDate property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const instance = await createInstance({ pressDate: '2010-10-07' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.thirdCall, '2010-10-07');
				expect(instance.pressDate).to.equal('2010-10-07');

			});

		});

		describe('endDate property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const instance = await createInstance({ endDate: '2011-01-26' });
				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(3), '2011-01-26');
				expect(instance.endDate).to.equal('2011-01-26');

			});

		});

		describe('material property', () => {

			it('assigns instance if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.material instanceof MaterialBase).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const instance = await createInstance({
					name: 'Hamlet',
					material: {
						name: 'The Tragedy of Hamlet'
					}
				});
				expect(instance.material instanceof MaterialBase).to.be.true;

			});

		});

		describe('venue property', () => {

			it('assigns instance if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.venue instanceof VenueBase).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const instance = await createInstance({
					name: 'Hamlet',
					venue: {
						name: 'Olivier Theatre'
					}
				});
				expect(instance.venue instanceof VenueBase).to.be.true;

			});

		});

		describe('season property', () => {

			it('assigns instance if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.season instanceof Season).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const instance = await createInstance({
					name: 'Hamlet',
					season: {
						name: 'Shakesperean Tragedy Season'
					}
				});
				expect(instance.season instanceof Season).to.be.true;

			});

		});

		describe('festival property', () => {

			it('assigns instance if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.festival instanceof FestivalBase).to.be.true;

			});

			it('assigns instance if included in props', async () => {

				const instance = await createInstance({
					name: 'Hamlet',
					festival: {
						name: 'The Complete Works'
					}
				});
				expect(instance.festival instanceof FestivalBase).to.be.true;

			});

		});

		describe('subProductions property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({});
				expect(instance.subProductions).to.deep.equal([]);

			});

			it('assigns array of subProductions if included in props, retaining those with empty or whitespace-only string uuids', async () => {

				const props = {
					subProductions: [
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
				const instance = await createInstance(props);
				expect(instance.subProductions.length).to.equal(3);
				expect(instance.subProductions[0] instanceof SubProductionIdentifier).to.be.true;
				expect(instance.subProductions[1] instanceof SubProductionIdentifier).to.be.true;
				expect(instance.subProductions[2] instanceof SubProductionIdentifier).to.be.true;

			});

		});

		describe('producerCredits property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.producerCredits).to.deep.equal([]);

			});

			it('assigns array of produucerCredits if included in props, retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'Produced by'
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
				expect(instance.producerCredits.length).to.equal(3);
				expect(instance.producerCredits[0] instanceof ProducerCredit).to.be.true;
				expect(instance.producerCredits[1] instanceof ProducerCredit).to.be.true;
				expect(instance.producerCredits[2] instanceof ProducerCredit).to.be.true;

			});

		});

		describe('cast property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.cast).to.deep.equal([]);

			});

			it('assigns array of cast if included in props, retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Patrick Stewart'
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
				expect(instance.cast.length).to.equal(3);
				expect(instance.cast[0] instanceof CastMember).to.be.true;
				expect(instance.cast[1] instanceof CastMember).to.be.true;
				expect(instance.cast[2] instanceof CastMember).to.be.true;

			});

		});

		describe('creativeCredits property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.creativeCredits).to.deep.equal([]);

			});

			it('assigns array of creativeCredits if included in props, retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Designer'
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
				expect(instance.creativeCredits.length).to.equal(3);
				expect(instance.creativeCredits[0] instanceof CreativeCredit).to.be.true;
				expect(instance.creativeCredits[1] instanceof CreativeCredit).to.be.true;
				expect(instance.creativeCredits[2] instanceof CreativeCredit).to.be.true;

			});

		});

		describe('crewCredits property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.crewCredits).to.deep.equal([]);

			});

			it('assigns array of crewCredits if included in props, retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager'
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
				expect(instance.crewCredits.length).to.equal(3);
				expect(instance.crewCredits[0] instanceof CrewCredit).to.be.true;
				expect(instance.crewCredits[1] instanceof CrewCredit).to.be.true;
				expect(instance.crewCredits[2] instanceof CrewCredit).to.be.true;

			});

		});

		describe('reviews property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'Hamlet' });
				expect(instance.reviews).to.deep.equal([]);

			});

			it('assigns array of reviews if included in props, retaining those with empty or whitespace-only string urls', async () => {

				const props = {
					name: 'Hamlet',
					reviews: [
						{
							url: 'https://www.foo.com'
						},
						{
							url: ''
						},
						{
							url: ' '
						}
					]
				};
				const instance = await createInstance(props);
				expect(instance.reviews.length).to.equal(3);
				expect(instance.reviews[0] instanceof Review).to.be.true;
				expect(instance.reviews[1] instanceof Review).to.be.true;
				expect(instance.reviews[2] instanceof Review).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const props = {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'Hamlet',
				subtitle: 'Prince of Denmark',
				subProductions: [
					{
						uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				],
				producerCredits: [
					{
						name: 'Produced by'
					}
				],
				cast: [
					{
						name: 'Patrick Stewart'
					}
				],
				creativeCredits: [
					{
						name: 'Sound Designer'
					}
				],
				crewCredits: [
					{
						name: 'Stage Manager'
					}
				],
				reviews: [
					{
						url: 'https://www.foo.com',
						publication: {
							name: 'Financial Times'
						},
						critic: {
							name: 'Sarah Hemming'
						}
					}
				]
			};
			const instance = await createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateSubtitle');
			spy(instance, 'validateDates');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateSubtitle,
				instance.validateDates,
				instance.material.validateName,
				instance.material.validateDifferentiator,
				instance.venue.validateName,
				instance.venue.validateDifferentiator,
				instance.season.validateName,
				instance.season.validateDifferentiator,
				instance.festival.validateName,
				instance.festival.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateUuidIndices,
				instance.subProductions[0].validateUuid,
				instance.subProductions[0].validateNoAssociationWithSelf,
				instance.subProductions[0].validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.producerCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.cast[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.creativeCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.crewCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateUrlIndices,
				instance.reviews[0].runInputValidations
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnceWithExactly(instance.validateSubtitle);
			assert.calledOnceWithExactly(instance.validateDates);
			assert.calledOnceWithExactly(instance.material.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.material.validateDifferentiator);
			assert.calledOnceWithExactly(instance.venue.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.venue.validateDifferentiator);
			assert.calledOnceWithExactly(instance.season.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.season.validateDifferentiator);
			assert.calledOnceWithExactly(instance.festival.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.festival.validateDifferentiator);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateUuidIndices, instance.subProductions
			);
			assert.calledOnceWithExactly(instance.subProductions[0].validateUuid);
			assert.calledOnceWithExactly(
				instance.subProductions[0].validateNoAssociationWithSelf,
				{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);
			assert.calledOnceWithExactly(
				instance.subProductions[0].validateUniquenessInGroup,
				{ isDuplicate: false, properties: new Set(['uuid']) }
			);
			assert.calledThrice(stubs.getDuplicateIndicesModule.getDuplicateNameIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.firstCall,
				instance.producerCredits
			);
			assert.calledOnceWithExactly(
				instance.producerCredits[0].runInputValidations,
				{ isDuplicate: false }
			);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.cast
			);
			assert.calledOnceWithExactly(
				instance.cast[0].runInputValidations,
				{ isDuplicate: false }
			);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.secondCall,
				instance.creativeCredits
			);
			assert.calledOnceWithExactly(
				instance.creativeCredits[0].runInputValidations,
				{ isDuplicate: false }
			);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.thirdCall,
				instance.crewCredits
			);
			assert.calledOnceWithExactly(
				instance.crewCredits[0].runInputValidations,
				{ isDuplicate: false }
			);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateUrlIndices,
				instance.reviews
			);
			assert.calledOnceWithExactly(
				instance.reviews[0].runInputValidations,
				{ isDuplicate: false }
			);

		});

	});

	describe('validateDates method', () => {

		context('valid data', () => {

			context('startDate with empty string values', () => {

				it('will not call addPropertyError method', async () => {

					const instance = await createInstance({ name: 'Hamlet', startDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate with valid date format', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate.onFirstCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', startDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate with empty string values', () => {

				it('will not call addPropertyError method', async () => {

					const instance = await createInstance({ name: 'Hamlet', pressDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate with valid date format', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate.onSecondCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', pressDate: '2010-10-07' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-10-07');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('endDate with empty string values', () => {

				it('will not call addPropertyError method', async () => {

					const instance = await createInstance({ name: 'Hamlet', endDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('endDate with valid date format', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate.onThirdCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2011-01-26');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate and endDate with valid date format with startDate before endDate', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', startDate: '2010-09-30', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2011-01-26');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate and endDate with valid date format with startDate same as endDate', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', startDate: '2010-09-30', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2010-09-30');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate and pressDate with valid date format with startDate before pressDate', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onSecondCall().returns(true);
					const instance = await createInstance({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-10-07'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-10-07');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate and pressDate with valid date format with startDate same as pressDate', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onSecondCall().returns(true);
					const instance = await createInstance({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-09-30'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate and endDate with valid date format with pressDate before endDate', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onSecondCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', pressDate: '2010-10-07', endDate: '2011-01-26' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-10-07');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2011-01-26');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('pressDate and endDate with valid date format with pressDate same as endDate', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onSecondCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', pressDate: '2010-09-30', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2010-09-30');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate, pressDate, and endDate with empty string values', () => {

				it('will not call addPropertyError method', async () => {

					const instance = await createInstance({ name: 'Hamlet', startDate: '', pressDate: '', endDate: '' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate, pressDate, and endDate with valid date format with startDate before pressDate and pressDate before endDate', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onSecondCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-10-07',
						endDate: '2011-01-26'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-10-07');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2011-01-26');
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('startDate, pressDate, and endDate with valid date format all with same value', () => {

				it('will not call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onSecondCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({
						name: 'Hamlet',
						startDate: '2010-09-30',
						pressDate: '2010-09-30',
						endDate: '2010-09-30'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2010-09-30');
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			context('startDate with invalid date format', () => {

				it('will call addPropertyError method', async () => {

					const instance = await createInstance({ name: 'Hamlet', startDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, 'foobar');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'startDate', 'Value must be in date format'
					);

				});

			});

			context('pressDate with invalid date format', () => {

				it('will call addPropertyError method', async () => {

					const instance = await createInstance({ name: 'Hamlet', pressDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, 'foobar');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'pressDate', 'Value must be in date format'
					);

				});

			});

			context('endDate with invalid date format', () => {

				it('will call addPropertyError method', async () => {

					const instance = await createInstance({ name: 'Hamlet', endDate: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, 'foobar');
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'endDate', 'Value must be in date format'
					);

				});

			});

			context('startDate and endDate with valid date format with startDate after endDate', () => {

				it('will call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', startDate: '2011-01-26', endDate: '2010-09-30' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2011-01-26');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2010-09-30');
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'startDate', 'Start date must not be after end date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'endDate', 'End date must not be before start date'
					);

				});

			});

			context('startDate and pressDate with valid date format with startDate after pressDate', () => {

				it('will call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onSecondCall().returns(true);
					const instance = await createInstance({
						name: 'Hamlet',
						startDate: '2010-10-07',
						pressDate: '2010-09-30'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2010-10-07');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-09-30');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '');
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'startDate', 'Start date must not be after press date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'pressDate', 'Press date must not be before start date'
					);

				});

			});

			context('pressDate and endDate with valid date format with pressDate after endDate', () => {

				it('will call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onSecondCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({ name: 'Hamlet', pressDate: '2011-01-26', endDate: '2010-10-07' });
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2011-01-26');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2010-10-07');
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'pressDate', 'Press date must not be after end date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'endDate', 'End date must not be before press date'
					);

				});

			});

			context('startDate, pressDate, and endDate with valid date format with startDate after pressDate and pressDate after endDate', () => {

				it('will call addPropertyError method', async () => {

					stubs.isValidDateModule.isValidDate
						.onFirstCall().returns(true)
						.onSecondCall().returns(true)
						.onThirdCall().returns(true);
					const instance = await createInstance({
						name: 'Hamlet',
						startDate: '2011-01-26',
						pressDate: '2010-10-07',
						endDate: '2010-09-30'
					});
					spy(instance, 'addPropertyError');
					instance.validateDates();
					expect(stubs.isValidDateModule.isValidDate.callCount).to.equal(3);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.firstCall, '2011-01-26');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.secondCall, '2010-10-07');
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate.thirdCall, '2010-09-30');
					expect(instance.addPropertyError.callCount).to.equal(6);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'startDate', 'Start date must not be after end date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'endDate', 'End date must not be before start date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.thirdCall,
						'startDate', 'Start date must not be after press date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(3),
						'pressDate', 'Press date must not be before start date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(4),
						'pressDate', 'Press date must not be after end date'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(5),
						'endDate', 'End date must not be before press date'
					);

				});

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated subProductions\' runDatabaseValidations method', async () => {

			const props = {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				subProductions: [
					{
						uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				]
			};
			const instance = await createInstance(props);
			await instance.runDatabaseValidations();
			assert.calledOnceWithExactly(
				instance.subProductions[0].runDatabaseValidations,
				{ subjectProductionUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);

		});

	});

});
