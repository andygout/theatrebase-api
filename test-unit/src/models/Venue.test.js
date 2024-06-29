import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { SubVenue } from '../../../src/models/index.js';

describe('Venue model', () => {

	let stubs;

	const SubVenueStub = function () {

		return createStubInstance(SubVenue);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([])
			},
			models: {
				SubVenue: SubVenueStub
			}
		};

	});

	const createSubject = () =>

		esmock('../../../src/models/Venue.js', {
			'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
			'../../../src/models/index.js': stubs.models
		});

	const createInstance = async props => {

		const Venue = await createSubject();

		return new Venue(props);

	};

	describe('constructor method', () => {

		describe('subVenues property', () => {

			it('assigns empty array if absent from props', async () => {

				const instance = await createInstance({ name: 'National Theatre' });
				expect(instance.subVenues).to.deep.equal([]);

			});

			it('assigns array of subVenues if included in props, retaining those with empty or whitespace-only string names', async () => {

				const props = {
					name: 'National Theatre',
					subVenues: [
						{
							name: 'Olivier Theatre'
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
				expect(instance.subVenues.length).to.equal(3);
				expect(instance.subVenues[0] instanceof SubVenue).to.be.true;
				expect(instance.subVenues[1] instanceof SubVenue).to.be.true;
				expect(instance.subVenues[2] instanceof SubVenue).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const props = {
				name: 'National Theatre',
				differentiator: '',
				subVenues: [
					{
						name: 'Olivier Theatre',
						differentiator: ''
					}
				]
			};
			const instance = await createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subVenues[0].validateName,
				instance.subVenues[0].validateDifferentiator,
				instance.subVenues[0].validateNoAssociationWithSelf,
				instance.subVenues[0].validateUniquenessInGroup
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnceWithExactly(instance.validateDifferentiator);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subVenues
			);
			assert.calledOnceWithExactly(instance.subVenues[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.subVenues[0].validateDifferentiator);
			assert.calledOnceWithExactly(
				instance.subVenues[0].validateNoAssociationWithSelf,
				{ name: 'National Theatre', differentiator: '' }
			);
			assert.calledOnceWithExactly(
				instance.subVenues[0].validateUniquenessInGroup,
				{ isDuplicate: false }
			);

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated subVenues\' runDatabaseValidations method', async () => {

			const props = {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'National Theatre',
				subVenues: [
					{
						name: 'Olivier Theatre'
					}
				]
			};
			const instance = await createInstance(props);
			stub(instance, 'validateUniquenessInDatabase');
			await instance.runDatabaseValidations();
			assert.calledOnceWithExactly(instance.validateUniquenessInDatabase);
			assert.calledOnceWithExactly(
				instance.subVenues[0].runDatabaseValidations,
				{ subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);

		});

	});

});
