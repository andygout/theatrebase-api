import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Character } from '../../../src/models';

describe('Playtext model', () => {

	let stubs;
	let instance;

	const DEFAULT_INSTANCE_PROPS = {
		name: 'The Tragedy of Hamlet, Prince of Denmark',
		characters: [{ name: 'Hamlet' }]
	};

	const CharacterStub = function () {

		return createStubInstance(Character);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateNameIndicesModule: {
				getDuplicateNameIndices: stub().returns([])
			},
			Base: {
				validateStringModule: {
					validateString: stub()
				}
			},
			models: {
				Character: CharacterStub
			}
		};

		instance = createInstance();

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Playtext', {
			'../lib/get-duplicate-name-indices': stubs.getDuplicateNameIndicesModule,
			'./Base': proxyquire('../../../src/models/Base', {
				'../lib/validate-string': stubs.Base.validateStringModule
			}),
			'.': stubs.models
		}).default;

	const createInstance = (props = DEFAULT_INSTANCE_PROPS) => {

		const Playtext = createSubject();

		return new Playtext(props);

	};

	describe('constructor method', () => {

		context('instance is subject', () => {

			describe('characters property', () => {

				it('assigns empty array if absent from props', () => {

					const props = { name: 'The Tragedy of Hamlet, Prince of Denmark' };
					const instance = createInstance(props);
					expect(instance.characters).to.deep.equal([]);

				});

				it('assigns array of characters if included in props, retaining those with empty or whitespace-only string names', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						characters: [
							{ name: 'Hamlet' },
							{ name: '' },
							{ name: ' ' }
						]
					};
					const instance = createInstance(props);
					expect(instance.characters.length).to.equal(3);
					expect(instance.characters[0] instanceof Character).to.be.true;
					expect(instance.characters[1] instanceof Character).to.be.true;
					expect(instance.characters[2] instanceof Character).to.be.true;

				});

			});

		});

		context('instance is not subject, i.e. it is an association of another instance', () => {

			describe('characters property', () => {

				it('will not assign any value if absent from props', () => {

					const props = { name: 'The Tragedy of Hamlet, Prince of Denmark', isAssociation: true };
					const instance = createInstance(props);
					expect(instance).not.to.have.property('characters');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						characters: [{ name: 'Hamlet' }],
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('characters');

				});

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			spy(instance, 'validateName');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices,
				instance.characters[0].validateName,
				instance.characters[0].validateNameUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ requiresName: true })).to.be.true;
			expect(stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.calledWithExactly(
				instance.characters
			)).to.be.true;
			expect(instance.characters[0].validateName.calledOnce).to.be.true;
			expect(instance.characters[0].validateName.calledWithExactly({ requiresName: false })).to.be.true;
			expect(instance.characters[0].validateNameUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.characters[0].validateNameUniquenessInGroup.calledWithExactly(
				{ hasDuplicateName: false }
			)).to.be.true;

		});

	});

});
