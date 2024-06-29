import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as stringsModule from '../../../src/lib/strings.js';
import { ProductionIdentifier } from '../../../src/models/index.js';

let stubs;

const sandbox = createSandbox();

describe('ProductionIdentifier model', () => {

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

			new ProductionIdentifier();
			expect(stubs.getTrimmedOrEmptyString.callCount).to.equal(1);

		});

		describe('uuid property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', () => {

				const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				assert.calledWithExactly(stubs.getTrimmedOrEmptyString, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
				expect(instance.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

		});

	});

	describe('validateUuid method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
			spy(instance, 'validateStringForProperty');
			instance.validateUuid();
			assert.calledOnceWithExactly(instance.validateStringForProperty, 'uuid', { isRequired: false });

		});

	});

});
