import { expect } from 'chai';
import esmock from 'esmock';
import { assert, stub } from 'sinon';
import neo4j from 'neo4j-driver';

import applyModelGetter from '../../test-helpers/apply-model-getter.js';

describe('Prepare As Params module', () => {

	let stubs;

	beforeEach(() => {

		stubs = {
			neo4j: {
				int: stub().returnsArg(0)
			},
			getRandomUuidModule: {
				getRandomUuid: stub().returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
			}
		};

	});

	const createSubject = () =>
		esmock('../../../src/lib/prepare-as-params.js', {
			'neo4j-driver': stubs.neo4j,
			'../../../src/lib/get-random-uuid.js': stubs.getRandomUuidModule
		});

	it('returns new object with modifications but will not mutate input object', async () => {

		const instance = {
			uuid: '',
			name: 'Foo',
			items: [
				{
					name: 'Foo',
					nestedItems: [
						{
							name: 'Baz'
						},
						{
							name: 'Qux'
						}
					]
				},
				{
					name: 'Bar',
					nestedItems: [
						{
							name: 'Quux'
						},
						{
							name: 'Quuz'
						}
					]
				}
			]
		};
		const { prepareAsParams } = await createSubject();
		const result = prepareAsParams(instance);
		expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		expect(result.items[0].position).to.equal(0);
		expect(result.items[0].nestedItems[0].position).to.equal(0);
		expect(result.items[0].nestedItems[1].position).to.equal(1);
		expect(result.items[1].position).to.equal(1);
		expect(result.items[1].nestedItems[0].position).to.equal(0);
		expect(result.items[1].nestedItems[1].position).to.equal(1);
		expect(instance.uuid).to.equal('');
		expect(instance.items[0]).not.to.have.property('position');
		expect(instance.items[0].nestedItems[0]).not.to.have.property('position');
		expect(instance.items[0].nestedItems[1]).not.to.have.property('position');
		expect(instance.items[1]).not.to.have.property('position');
		expect(instance.items[1].nestedItems[0]).not.to.have.property('position');
		expect(instance.items[1].nestedItems[0]).not.to.have.property('position');

	});

	context('top level properties', () => {

		context('name property and value is present', () => {

			it('assigns value to uuid property if empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: '', name: 'Foo' };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('assigns value to uuid property if undefined', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: undefined, name: 'Foo' };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will not assign value to uuid property if one already exists', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: 'Foo' };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

		});

		context('name property is present; its value is an empty string', () => {

			it('assigns value to uuid property if empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: '', name: '' };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal(null);

			});

			it('assigns value to uuid property if undefined', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: undefined, name: '' };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal(null);

			});

			it('will not assign value to uuid property if one already exists', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: '' };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

		});

		context('name property is absent', () => {

			it('assigns value to uuid property if empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: '' };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal(null);

			});

			it('assigns value to uuid property if undefined', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: undefined };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal(null);

			});

			it('will not assign value to uuid property if one already exists', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { foo: 'bar' };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.foo).to.equal(null);

		});

		it('will assign null value to non-uuid properties with false values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { foo: false };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.foo).to.equal(null);

		});

		it('will not add position property', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result).not.to.have.property('position');

		});

		it('will add model property with value from model getter method', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = applyModelGetter({ foo: '' });
			const result = prepareAsParams(instance);
			expect(result.model).to.equal('BASE');

		});

	});

	context('nested level properties', () => {

		context('name property and value is present', () => {

			it('assigns value to uuid property if empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: '', name: 'Foo' } };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('assigns value to uuid property if undefined', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: undefined, name: 'Foo' } };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will not assign value to uuid property if one already exists', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: 'Foo' } };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

		});

		context('name property is present; its value is an empty string', () => {

			it('assigns value to uuid property if empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: '', name: '' } };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal(null);

			});

			it('assigns value to uuid property if undefined', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: undefined, name: '' } };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal(null);

			});

			it('will not assign value to uuid property if one already exists', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: '' } };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

		});

		context('name property is absent', () => {

			it('assigns value to uuid property if empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: '' } };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal(null);

			});

			it('assigns value to uuid property if undefined', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: undefined } };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal(null);

			});

			it('will not assign value to uuid property if one already exists', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { venue: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.venue.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { venue: { foo: 'bar' } };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.venue.foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { venue: { foo: '' } };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.venue.foo).to.equal(null);

		});

		it('will assign null value to non-uuid properties with false values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { venue: { foo: false } };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.venue.foo).to.equal(null);

		});

		it('will not add position property', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { venue: { uuid: '' } };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.venue).not.to.have.property('position');

		});

		it('will add model property with value from model getter method', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { venue: applyModelGetter({ foo: '' }) };
			const result = prepareAsParams(instance);
			expect(result.venue.model).to.equal('BASE');

		});

	});

	context('properties in arrays at top level', () => {

		it('assigns value to uuid property if empty string', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ uuid: '', name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ uuid: undefined, name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ foo: 'bar', name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ foo: '', name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].foo).to.equal(null);

		});

		it('will assign null value to non-uuid properties with false values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ foo: false, name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('will not add position property', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { cast: [{ uuid: '', name: 'David Calder' }] };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.cast[0]).to.not.have.property('position');

			});

			it('will add model property with value from model getter method', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { cast: [applyModelGetter({ foo: '', name: 'David Calder' })] };
				const result = prepareAsParams(instance);
				expect(result.cast[0].model).to.equal('BASE');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { cast: [{ uuid: '', name: 'David Calder' }, { uuid: '', name: 'Ruth Negga' }] };
				const result = prepareAsParams(instance);
				assert.calledTwice(stubs.getRandomUuidModule.getRandomUuid);
				assert.calledTwice(stubs.neo4j.int);
				assert.calledWithExactly(stubs.neo4j.int.firstCall, 0);
				assert.calledWithExactly(stubs.neo4j.int.secondCall, 1);
				expect(result.cast[0]).to.have.property('position');
				expect(result.cast[0].position).to.equal(0);
				expect(result.cast[1]).to.have.property('position');
				expect(result.cast[1].position).to.equal(1);

			});

			it('will add model property with value from model getter method', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					cast: [
						applyModelGetter({ foo: '', name: 'David Calder' }),
						applyModelGetter({ foo: '', name: 'Ruth Negga' })
					]
				};
				const result = prepareAsParams(instance);
				expect(result.cast[0].model).to.equal('BASE');

			});

		});

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'David Calder' }] };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.cast.length).to.equal(1);
				expect(result.cast[0].name).to.equal('David Calder');
				expect(result.cast[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an absent name property or empty string name value regardless of whether they have named children', () => {

			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					productions: [
						{ uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' }
					],
					subProductions: [
						{ uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' }
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.productions.length).to.equal(1);
				expect(result.productions[0]).to.not.have.property('name');
				expect(result.productions[0]).to.not.have.property('position');
				expect(result.subProductions.length).to.equal(1);
				expect(result.subProductions[0]).to.not.have.property('name');
				expect(result.subProductions[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an absent name property or empty string name value providing they have named children', () => {

			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					characterGroups: [
						{ name: '', characters: [{ name: 'Malene' }] }
					],
					nominations: [
						{ entities: [{ name: 'Simon Baker' }] }
					],
					producerCredits: [
						{ name: '', entities: [{ name: 'National Theatre Company' }] }
					],
					writingCredits: [
						{ name: '', entities: [{ name: 'Henrik Ibsen' }] }
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.characterGroups.length).to.equal(1);
				expect(result.characterGroups[0].name).to.be.null;
				expect(result.characterGroups[0]).to.not.have.property('position');
				expect(result.nominations.length).to.equal(1);
				expect(result.nominations[0]).to.not.have.property('name');
				expect(result.nominations[0]).to.not.have.property('position');
				expect(result.producerCredits.length).to.equal(1);
				expect(result.producerCredits[0].name).to.be.null;
				expect(result.producerCredits[0]).to.not.have.property('position');
				expect(result.writingCredits.length).to.equal(1);
				expect(result.writingCredits[0].name).to.be.null;
				expect(result.writingCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items must have at least one named child', () => {

			it('filters out objects that do not have any named children (e.g. entities, characters)', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					characterGroups: [
						{ name: 'The Rentheims', characters: [{ name: '' }] },
						{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
						{ name: 'The Foldals' }
					],
					creativeCredits: [
						{ name: 'Director', entities: [{ name: '' }] },
						{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
						{ name: 'Lighting Designer' }
					],
					crewCredits: [
						{ name: 'Production Manager', entities: [{ name: '' }] },
						{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
						{ name: 'Costume Supervisor' }
					],
					nominations: [
						{ entities: [{ name: '' }] },
						{ entities: [{ name: 'Simon Baker' }] },
						{ productions: [{ uuid: '' }] },
						{ productions: [{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }] },
						{ materials: [{ name: '' }] },
						{ materials: [{ name: 'Hairspray' }] },
						{
							entities: [{ name: '' }],
							productions: [{ uuid: '' }],
							materials: [{ name: '' }]
						},
						{
							entities: [{ name: 'Steve C Kennedy' }],
							productions: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }],
							materials: [{ name: 'Hairspray' }]
						},
						{}
					],
					producerCredits: [
						{ name: 'in partnership with', entities: [{ name: '' }] },
						{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
						{ name: 'originally commissioned by' }
					],
					writingCredits: [
						{ name: 'adaptation by', entities: [{ name: '' }] },
						{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
						{ name: 'translation by' }
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				expect(stubs.neo4j.int.callCount).to.equal(4);
				expect(result.characterGroups.length).to.equal(1);
				expect(result.characterGroups[0]).to.not.have.property('position');
				expect(result.characterGroups[0].name).to.equal('The Borkmans');
				expect(result.creativeCredits.length).to.equal(1);
				expect(result.creativeCredits[0]).to.not.have.property('position');
				expect(result.creativeCredits[0].name).to.equal('Designer');
				expect(result.crewCredits.length).to.equal(1);
				expect(result.crewCredits[0]).to.not.have.property('position');
				expect(result.crewCredits[0].name).to.equal('Stage Manager');
				expect(result.nominations.length).to.equal(4);
				expect(result.nominations[0]).to.not.have.property('name');
				expect(result.nominations[0].position).to.equal(0);
				expect(result.producerCredits.length).to.equal(1);
				expect(result.producerCredits[0]).to.not.have.property('position');
				expect(result.producerCredits[0].name).to.equal('in association with');
				expect(result.writingCredits.length).to.equal(1);
				expect(result.writingCredits[0].name).to.equal('version by');
				expect(result.writingCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items do not require any named children', () => {

			it('retains objects whether they have named children (e.g. roles) or not', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					cast: [
						{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
						{ name: 'Matthew Macfadyen', roles: [] },
						{ name: 'Samuel Roukin' }
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.calledThrice(stubs.neo4j.int);
				expect(result.cast.length).to.equal(3);

			});

		});

		context('object is in array where items require a url', () => {

			it('retains objects only if they have a non-empty url value', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					reviews: [
						{ url: '' },
						{ url: 'https://www.foo.com' },
						{ url: '' }
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.reviews.length).to.equal(1);

			});

		});

		context('object is in array where items require a uuid', () => {

			it('retains objects only if they have a non-empty uuid value', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					productions: [
						{ uuid: '' },
						{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
						{ uuid: '' }
					],
					subProductions: [
						{ uuid: '' },
						{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' },
						{ uuid: '' }
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.productions.length).to.equal(1);
				expect(result.subProductions.length).to.equal(1);

			});

		});

		it('applies the same uuid value to items that will need to share the same database entry', async () => {

			stubs.getRandomUuidModule.getRandomUuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd')
				.onCall(4).returns('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
				.onCall(5).returns('ffffffff-ffff-ffff-ffff-ffffffffffff');
			const { prepareAsParams } = await createSubject();
			const instance = {
				characters: [
					applyModelGetter({ uuid: '', name: 'Ferdinand Foo', underlyingName: '', differentiator: '', qualifier: 'younger' }),
					applyModelGetter({ uuid: '', name: 'Bar', underlyingName: 'Beatrice Bar', differentiator: '1', qualifier: 'younger' }),
					applyModelGetter({ uuid: '', name: 'Brandon Baz', underlyingName: '', differentiator: '', qualifier: '' }),
					applyModelGetter({ uuid: '', name: 'Qux', underlyingName: 'Quincy Qux', differentiator: '', qualifier: '' }),
					applyModelGetter({ uuid: '', name: 'Quux', underlyingName: 'Clara Qux', differentiator: '', qualifier: '' }),
					applyModelGetter({ uuid: '', name: 'Ferdinand Foo', underlyingName: '', differentiator: '', qualifier: 'older' }),
					applyModelGetter({ uuid: '', name: 'Beatrice', underlyingName: 'Beatrice Bar', differentiator: '1', qualifier: 'older' }),
					applyModelGetter({ uuid: '', name: 'Baz', underlyingName: 'Brandon Baz', differentiator: '', qualifier: '' }),
					applyModelGetter({ uuid: '', name: 'Quincy Qux', underlyingName: '', differentiator: '', qualifier: '' }),
					applyModelGetter({ uuid: '', name: 'Clara Quux', underlyingName: '', differentiator: '1', qualifier: '' })
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.getRandomUuidModule.getRandomUuid.callCount).to.equal(6);
			expect(stubs.neo4j.int.callCount).to.equal(10);
			expect(result.characters[0].uuid).to.equal(result.characters[5].uuid);
			expect(result.characters[1].uuid).to.equal(result.characters[6].uuid);
			expect(result.characters[2].uuid).to.equal(result.characters[7].uuid);
			expect(result.characters[3].uuid).to.equal(result.characters[8].uuid);
			expect(result.characters[4].uuid).to.not.equal(result.characters[9].uuid);

		});

	});

	context('properties in arrays at nested level (nested in object)', () => {

		it('assigns value to uuid property if empty string', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { production: { cast: [{ uuid: '', name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.production.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { production: { cast: [{ uuid: undefined, name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.production.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = {
				production: {
					cast: [
						{
							uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
							name: 'David Calder'
						}
					]
				}
			};
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.production.cast[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { production: { cast: [{ foo: 'bar', name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.production.cast[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { production: { cast: [{ foo: '', name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.production.cast[0].foo).to.equal(null);

		});

		it('will assign null value to non-uuid properties with false values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { production: { cast: [{ foo: false, name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.production.cast[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('will not add position property', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { production: { cast: [{ uuid: '', name: 'David Calder' }] } };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.production.cast[0]).to.not.have.property('position');

			});

			it('will add model property with value from model getter method', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { production: { cast: [applyModelGetter({ foo: '', name: 'David Calder' })] } };
				const result = prepareAsParams(instance);
				expect(result.production.cast[0].model).to.equal('BASE');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					production: {
						cast: [
							{ uuid: '', name: 'David Calder' },
							{ uuid: '', name: 'Ruth Negga' }
						]
					}
				};
				const result = prepareAsParams(instance);
				assert.calledTwice(stubs.getRandomUuidModule.getRandomUuid);
				assert.calledTwice(stubs.neo4j.int);
				assert.calledWithExactly(stubs.neo4j.int.firstCall, 0);
				assert.calledWithExactly(stubs.neo4j.int.secondCall, 1);
				expect(result.production.cast[0]).to.have.property('position');
				expect(result.production.cast[0].position).to.equal(0);
				expect(result.production.cast[1]).to.have.property('position');
				expect(result.production.cast[1].position).to.equal(1);

			});

			it('will add model property with value from model getter method', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					production: {
						cast: [
							applyModelGetter({ foo: '', name: 'David Calder' }),
							applyModelGetter({ foo: '', name: 'Ruth Negga' })
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(result.production.cast[0].model).to.equal('BASE');

			});

		});

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { production: { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'David Calder' }] } };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.production.cast.length).to.equal(1);
				expect(result.production.cast[0].name).to.equal('David Calder');
				expect(result.production.cast[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an absent name property or empty string name value regardless of whether they have named children', () => {

			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					foo: {
						productions: [
							{ uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' }
						],
						subProductions: [
							{ uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' }
						]
					}
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.foo.productions.length).to.equal(1);
				expect(result.foo.productions[0]).to.not.have.property('name');
				expect(result.foo.productions[0]).to.not.have.property('position');
				expect(result.foo.subProductions.length).to.equal(1);
				expect(result.foo.subProductions[0]).to.not.have.property('name');
				expect(result.foo.subProductions[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an absent name property or empty string name value providing they have named children', () => {

			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					foo: {
						characterGroups: [
							{ name: '', characters: [{ name: 'Malene' }] }
						],
						nominations: [
							{ entities: [{ name: 'Simon Baker' }] }
						],
						producerCredits: [
							{ name: '', entities: [{ name: 'National Theatre Company' }] }
						],
						writingCredits: [
							{ name: '', entities: [{ name: 'Henrik Ibsen' }] }
						]
					}
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.foo.characterGroups.length).to.equal(1);
				expect(result.foo.characterGroups[0].name).to.be.null;
				expect(result.foo.characterGroups[0]).to.not.have.property('position');
				expect(result.foo.nominations.length).to.equal(1);
				expect(result.foo.nominations[0]).to.not.have.property('name');
				expect(result.foo.nominations[0]).to.not.have.property('position');
				expect(result.foo.producerCredits.length).to.equal(1);
				expect(result.foo.producerCredits[0].name).to.be.null;
				expect(result.foo.producerCredits[0]).to.not.have.property('position');
				expect(result.foo.writingCredits.length).to.equal(1);
				expect(result.foo.writingCredits[0].name).to.be.null;
				expect(result.foo.writingCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items must have at least one named child', () => {

			it('filters out objects that do not have any named children (e.g. entities, characters)', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					foo: {
						characterGroups: [
							{ name: 'The Rentheims', characters: [{ name: '' }] },
							{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
							{ name: 'The Foldals' }
						],
						creativeCredits: [
							{ name: 'Director', entities: [{ name: '' }] },
							{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
							{ name: 'Lighting Designer' }
						],
						crewCredits: [
							{ name: 'Production Manager', entities: [{ name: '' }] },
							{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
							{ name: 'Costume Supervisor' }
						],
						nominations: [
							{ entities: [{ name: '' }] },
							{ entities: [{ name: 'Simon Baker' }] },
							{ productions: [{ uuid: '' }] },
							{ productions: [{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }] },
							{ materials: [{ name: '' }] },
							{ materials: [{ name: 'Hairspray' }] },
							{
								entities: [{ name: '' }],
								productions: [{ uuid: '' }],
								materials: [{ name: '' }]
							},
							{
								entities: [{ name: 'Steve C Kennedy' }],
								productions: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }],
								materials: [{ name: 'Hairspray' }]
							},
							{}
						],
						producerCredits: [
							{ name: 'in partnership with', entities: [{ name: '' }] },
							{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
							{ name: 'originally commissioned by' }
						],
						writingCredits: [
							{ name: 'adaptation by', entities: [{ name: '' }] },
							{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
							{ name: 'translation by' }
						]
					}
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				expect(stubs.neo4j.int.callCount).to.equal(4);
				expect(result.foo.characterGroups.length).to.equal(1);
				expect(result.foo.characterGroups[0]).to.not.have.property('position');
				expect(result.foo.characterGroups[0].name).to.equal('The Borkmans');
				expect(result.foo.creativeCredits.length).to.equal(1);
				expect(result.foo.creativeCredits[0]).to.not.have.property('position');
				expect(result.foo.creativeCredits[0].name).to.equal('Designer');
				expect(result.foo.crewCredits.length).to.equal(1);
				expect(result.foo.crewCredits[0]).to.not.have.property('position');
				expect(result.foo.crewCredits[0].name).to.equal('Stage Manager');
				expect(result.foo.nominations.length).to.equal(4);
				expect(result.foo.nominations[0]).to.not.have.property('name');
				expect(result.foo.nominations[0].position).to.equal(0);
				expect(result.foo.producerCredits.length).to.equal(1);
				expect(result.foo.producerCredits[0]).to.not.have.property('position');
				expect(result.foo.producerCredits[0].name).to.equal('in association with');
				expect(result.foo.writingCredits.length).to.equal(1);
				expect(result.foo.writingCredits[0]).to.not.have.property('position');
				expect(result.foo.writingCredits[0].name).to.equal('version by');

			});

		});

		context('object is in array where items do not require any named children', () => {

			it('retains objects whether they have named children (e.g. roles) or not', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					production: {
						cast: [
							{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
							{ name: 'Matthew Macfadyen', roles: [] },
							{ name: 'Samuel Roukin' }
						]
					}
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.calledThrice(stubs.neo4j.int);
				expect(result.production.cast.length).to.equal(3);

			});

		});

		context('object is in array where items require a url', () => {

			it('retains objects only if they have a non-empty url value', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					foo: {
						reviews: [
							{ url: '' },
							{ url: 'https://www.foo.com' },
							{ url: '' }
						]
					}
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.foo.reviews.length).to.equal(1);

			});

		});

		context('object is in array where items require a uuid', () => {

			it('retains objects only if they have a non-empty uuid value', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					foo: {
						productions: [
							{ uuid: '' },
							{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
							{ uuid: '' }
						],
						subProductions: [
							{ uuid: '' },
							{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
							{ uuid: '' }
						]
					}
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.foo.productions.length).to.equal(1);
				expect(result.foo.subProductions.length).to.equal(1);

			});

		});

		it('applies the same uuid value to items that will need to share the same database entry', async () => {

			stubs.getRandomUuidModule.getRandomUuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd')
				.onCall(4).returns('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
				.onCall(5).returns('ffffffff-ffff-ffff-ffff-ffffffffffff');
			const { prepareAsParams } = await createSubject();
			const instance = {
				production: {
					cast: [
						applyModelGetter({ uuid: '', name: 'Ferdinand Foo', underlyingName: '', differentiator: '', qualifier: 'younger' }),
						applyModelGetter({ uuid: '', name: 'Bar', underlyingName: 'Beatrice Bar', differentiator: '1', qualifier: 'younger' }),
						applyModelGetter({ uuid: '', name: 'Brandon Baz', underlyingName: '', differentiator: '', qualifier: '' }),
						applyModelGetter({ uuid: '', name: 'Qux', underlyingName: 'Quincy Qux', differentiator: '', qualifier: '' }),
						applyModelGetter({ uuid: '', name: 'Quux', underlyingName: 'Clara Qux', differentiator: '', qualifier: '' }),
						applyModelGetter({ uuid: '', name: 'Ferdinand Foo', underlyingName: '', differentiator: '', qualifier: 'older' }),
						applyModelGetter({ uuid: '', name: 'Beatrice', underlyingName: 'Beatrice Bar', differentiator: '1', qualifier: 'older' }),
						applyModelGetter({ uuid: '', name: 'Baz', underlyingName: 'Brandon Baz', differentiator: '', qualifier: '' }),
						applyModelGetter({ uuid: '', name: 'Quincy Qux', underlyingName: '', differentiator: '', qualifier: '' }),
						applyModelGetter({ uuid: '', name: 'Clara Quux', underlyingName: '', differentiator: '1', qualifier: '' })
					]
				}
			};
			const result = prepareAsParams(instance);
			expect(stubs.getRandomUuidModule.getRandomUuid.callCount).to.equal(6);
			expect(stubs.neo4j.int.callCount).to.equal(10);
			expect(result.production.cast[0].uuid).to.equal(result.production.cast[5].uuid);
			expect(result.production.cast[1].uuid).to.equal(result.production.cast[6].uuid);
			expect(result.production.cast[2].uuid).to.equal(result.production.cast[7].uuid);
			expect(result.production.cast[3].uuid).to.equal(result.production.cast[8].uuid);
			expect(result.production.cast[4].uuid).to.not.equal(result.production.cast[9].uuid);

		});

	});

	context('properties in arrays at nested level (nested in array)', () => {

		it('assigns value to uuid property if empty string', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: '', name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].roles[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: undefined, name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].roles[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = {
				cast: [
					{
						name: 'David Calder',
						roles: [
							{
								uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
								name: 'Polonius'
							}
						]
					}
				]
			};
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].roles[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ name: 'David Calder', roles: [{ foo: 'bar', name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].roles[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ name: 'David Calder', roles: [{ foo: '', name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].roles[0].foo).to.equal(null);

		});

		it('will assign null value to non-uuid properties with false values', async () => {

			const { prepareAsParams } = await createSubject();
			const instance = { cast: [{ name: 'David Calder', roles: [{ foo: false, name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
			assert.notCalled(stubs.neo4j.int);
			expect(result.cast[0].roles[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('will not add position property', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: '', name: 'Polonius' }] }] };
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.cast[0]).to.not.have.property('position');
				expect(result.cast[0].roles[0]).to.not.have.property('position');

			});

			it('will add model property with value from model getter method', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								applyModelGetter({ foo: '', name: 'Polonius' })
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(result.cast[0].roles[0].model).to.equal('BASE');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								{ uuid: '', name: 'Polonius' },
								{ uuid: '', name: 'Gravedigger' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				assert.calledTwice(stubs.getRandomUuidModule.getRandomUuid);
				assert.calledTwice(stubs.neo4j.int);
				assert.calledWithExactly(stubs.neo4j.int.firstCall, 0);
				assert.calledWithExactly(stubs.neo4j.int.secondCall, 1);
				expect(result.cast[0]).to.not.have.property('position');
				expect(result.cast[0].roles[0]).to.have.property('position');
				expect(result.cast[0].roles[0].position).to.equal(0);
				expect(result.cast[0].roles[1]).to.have.property('position');
				expect(result.cast[0].roles[1].position).to.equal(1);

			});

			it('will add model property with value from model getter method', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								applyModelGetter({ foo: '', name: 'Polonius' }),
								applyModelGetter({ foo: '', name: 'Gravedigger' })
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(result.cast[0].roles[0].model).to.equal('BASE');

			});

		});

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								{ uuid: '', name: '' },
								{ uuid: '', name: 'Polonius' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				assert.calledOnce(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.cast[0].roles.length).to.equal(1);
				expect(result.cast[0].roles[0].name).to.equal('Polonius');
				expect(result.cast[0].roles[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an absent name property or empty string name value regardless of whether they have named children', () => {

			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					foos: [
						{
							name: 'Foobar',
							productions: [
								{ uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' }
							],
							subProductions: [
								{ uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.foos[0].productions.length).to.equal(1);
				expect(result.foos[0].productions[0]).to.not.have.property('name');
				expect(result.foos[0].productions[0]).to.not.have.property('position');
				expect(result.foos[0].subProductions.length).to.equal(1);
				expect(result.foos[0].subProductions[0]).to.not.have.property('name');
				expect(result.foos[0].subProductions[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an absent name property empty string name value providing they have named children', () => {

			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					foos: [
						{
							name: 'Foobar',
							characterGroups: [
								{ name: '', characters: [{ name: 'Malene' }] }
							],
							nominations: [
								{ entities: [{ name: 'Simon Baker' }] }
							],
							producerCredits: [
								{ name: '', entities: [{ name: 'National Theatre Company' }] }
							],
							writingCredits: [
								{ name: '', entities: [{ name: 'Henrik Ibsen' }] }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.foos[0].characterGroups.length).to.equal(1);
				expect(result.foos[0].characterGroups[0].name).to.be.null;
				expect(result.foos[0].characterGroups[0]).to.not.have.property('position');
				expect(result.foos[0].nominations.length).to.equal(1);
				expect(result.foos[0].nominations[0]).to.not.have.property('name');
				expect(result.foos[0].nominations[0]).to.not.have.property('position');
				expect(result.foos[0].producerCredits.length).to.equal(1);
				expect(result.foos[0].producerCredits[0].name).to.be.null;
				expect(result.foos[0].producerCredits[0]).to.not.have.property('position');
				expect(result.foos[0].writingCredits.length).to.equal(1);
				expect(result.foos[0].writingCredits[0].name).to.be.null;
				expect(result.foos[0].writingCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items must have at least one named child', () => {

			it('filters out objects that do not have any named children (e.g. entities, characters)', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					foos: [
						{
							name: 'Foobar',
							characterGroups: [
								{ name: 'The Rentheims', characters: [{ name: '' }] },
								{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
								{ name: 'The Foldals' }
							],
							creativeCredits: [
								{ name: 'Director', entities: [{ name: '' }] },
								{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
								{ name: 'Lighting Designer' }
							],
							crewCredits: [
								{ name: 'Production Manager', entities: [{ name: '' }] },
								{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
								{ name: 'Costume Supervisor' }
							],
							nominations: [
								{ entities: [{ name: '' }] },
								{ entities: [{ name: 'Simon Baker' }] },
								{ productions: [{ uuid: '' }] },
								{ productions: [{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }] },
								{ materials: [{ name: '' }] },
								{ materials: [{ name: 'Hairspray' }] },
								{
									entities: [{ name: '' }],
									productions: [{ uuid: '' }],
									materials: [{ name: '' }]
								},
								{
									entities: [{ name: 'Steve C Kennedy' }],
									productions: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }],
									materials: [{ name: 'Hairspray' }]
								},
								{}
							],
							producerCredits: [
								{ name: 'in partnership with', entities: [{ name: '' }] },
								{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
								{ name: 'translation by' }
							],
							writingCredits: [
								{ name: 'adaptation by', entities: [{ name: '' }] },
								{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
								{ name: 'translation by' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				expect(stubs.neo4j.int.callCount).to.equal(4);
				expect(result.foos[0].characterGroups.length).to.equal(1);
				expect(result.foos[0].characterGroups[0]).to.not.have.property('position');
				expect(result.foos[0].characterGroups[0].name).to.equal('The Borkmans');
				expect(result.foos[0].creativeCredits.length).to.equal(1);
				expect(result.foos[0].creativeCredits[0]).to.not.have.property('position');
				expect(result.foos[0].creativeCredits[0].name).to.equal('Designer');
				expect(result.foos[0].crewCredits.length).to.equal(1);
				expect(result.foos[0].crewCredits[0]).to.not.have.property('position');
				expect(result.foos[0].crewCredits[0].name).to.equal('Stage Manager');
				expect(result.foos[0].nominations.length).to.equal(4);
				expect(result.foos[0].nominations[0]).to.not.have.property('name');
				expect(result.foos[0].nominations[0].position).to.equal(0);
				expect(result.foos[0].producerCredits.length).to.equal(1);
				expect(result.foos[0].producerCredits[0]).to.not.have.property('position');
				expect(result.foos[0].producerCredits[0].name).to.equal('in association with');
				expect(result.foos[0].writingCredits.length).to.equal(1);
				expect(result.foos[0].writingCredits[0]).to.not.have.property('position');
				expect(result.foos[0].writingCredits[0].name).to.equal('version by');

			});

		});

		context('object is in array where items do not require any named children', () => {

			it('retains objects whether they have named children (e.g. roles) or not', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					productions: [
						{
							name: 'Henry IV, Part 1',
							cast: [
								{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
								{ name: 'Matthew Macfadyen', roles: [] },
								{ name: 'Samuel Roukin' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.calledThrice(stubs.neo4j.int);
				expect(result.productions[0].cast.length).to.equal(3);

			});

		});

		context('object is in array where items require a url', () => {

			it('retains objects only if they have a non-empty url value', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					subProductions: [
						{
							reviews: [
								{ url: '' },
								{ url: 'https://www.foo.com' },
								{ url: '' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.subProductions[0].reviews.length).to.equal(1);

			});

		});

		context('object is in array where items require a uuid', () => {

			it('retains objects only if they have a non-empty uuid value', async () => {

				const { prepareAsParams } = await createSubject();
				const instance = {
					nominations: [
						{
							productions: [
								{ uuid: '' },
								{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
								{ uuid: '' }
							]
						}
					],
					productions: [
						{
							subProductions: [
								{ uuid: '' },
								{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' },
								{ uuid: '' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				assert.notCalled(stubs.getRandomUuidModule.getRandomUuid);
				assert.notCalled(stubs.neo4j.int);
				expect(result.nominations[0].productions.length).to.equal(1);
				expect(result.productions[0].subProductions.length).to.equal(1);

			});

		});

		it('applies the same uuid value to items in the same array that will need to share the same database entry', async () => {

			stubs.getRandomUuidModule.getRandomUuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd')
				.onCall(4).returns('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
				.onCall(5).returns('ffffffff-ffff-ffff-ffff-ffffffffffff');
			const { prepareAsParams } = await createSubject();
			const instance = {
				characterGroups: [
					{
						characters: [
							applyModelGetter({ uuid: '', name: 'Ferdinand Foo', underlyingName: '', differentiator: '', qualifier: 'younger' }),
							applyModelGetter({ uuid: '', name: 'Bar', underlyingName: 'Beatrice Bar', differentiator: '1', qualifier: 'younger' }),
							applyModelGetter({ uuid: '', name: 'Brandon Baz', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Qux', underlyingName: 'Quincy Qux', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Quux', underlyingName: 'Clara Qux', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Ferdinand Foo', underlyingName: '', differentiator: '', qualifier: 'older' }),
							applyModelGetter({ uuid: '', name: 'Beatrice', underlyingName: 'Beatrice Bar', differentiator: '1', qualifier: 'older' }),
							applyModelGetter({ uuid: '', name: 'Baz', underlyingName: 'Brandon Baz', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Quincy Qux', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Clara Quux', underlyingName: '', differentiator: '1', qualifier: '' })
						]
					}
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.getRandomUuidModule.getRandomUuid.callCount).to.equal(6);
			expect(stubs.neo4j.int.callCount).to.equal(10);
			expect(result.characterGroups[0].characters[0].uuid).to.equal(result.characterGroups[0].characters[5].uuid);
			expect(result.characterGroups[0].characters[1].uuid).to.equal(result.characterGroups[0].characters[6].uuid);
			expect(result.characterGroups[0].characters[2].uuid).to.equal(result.characterGroups[0].characters[7].uuid);
			expect(result.characterGroups[0].characters[3].uuid).to.equal(result.characterGroups[0].characters[8].uuid);
			expect(result.characterGroups[0].characters[4].uuid).not.to.equal(
				result.characterGroups[0].characters[9].uuid
			);

		});

		it('applies the same uuid value to items in different arrays that will need to share the same database entry', async () => {

			stubs.getRandomUuidModule.getRandomUuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd')
				.onCall(4).returns('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
				.onCall(5).returns('ffffffff-ffff-ffff-ffff-ffffffffffff');
			const { prepareAsParams } = await createSubject();
			const instance = {
				characterGroups: [
					{
						name: 'Montagues',
						characters: [
							applyModelGetter({ uuid: '', name: 'Ferdinand Foo', underlyingName: '', differentiator: '', qualifier: 'younger' }),
							applyModelGetter({ uuid: '', name: 'Bar', underlyingName: 'Beatrice Bar', differentiator: '1', qualifier: 'younger' }),
							applyModelGetter({ uuid: '', name: 'Brandon Baz', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Qux', underlyingName: 'Quincy Qux', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Quux', underlyingName: 'Clara Qux', differentiator: '', qualifier: '' })
						]
					},
					{
						name: 'Capulets',
						characters: [
							applyModelGetter({ uuid: '', name: 'Ferdinand Foo', underlyingName: '', differentiator: '', qualifier: 'older' }),
							applyModelGetter({ uuid: '', name: 'Beatrice', underlyingName: 'Beatrice Bar', differentiator: '1', qualifier: 'older' }),
							applyModelGetter({ uuid: '', name: 'Baz', underlyingName: 'Brandon Baz', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Quincy Qux', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Clara Quux', underlyingName: '', differentiator: '1', qualifier: '' })
						]
					}
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.getRandomUuidModule.getRandomUuid.callCount).to.equal(6);
			expect(stubs.neo4j.int.callCount).to.equal(12);
			expect(result.characterGroups[0].characters[0].uuid).to.equal(result.characterGroups[1].characters[0].uuid);
			expect(result.characterGroups[0].characters[1].uuid).to.equal(result.characterGroups[1].characters[1].uuid);
			expect(result.characterGroups[0].characters[2].uuid).to.equal(result.characterGroups[1].characters[2].uuid);
			expect(result.characterGroups[0].characters[3].uuid).to.equal(result.characterGroups[1].characters[3].uuid);
			expect(result.characterGroups[0].characters[4].uuid).not.to.equal(result.characterGroups[1].characters[4].uuid);

		});

	});

});
