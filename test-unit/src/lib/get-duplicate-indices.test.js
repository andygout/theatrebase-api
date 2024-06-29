import { expect } from 'chai';

import {
	getDuplicateBaseInstanceIndices,
	getDuplicateCharacterIndices,
	getDuplicateEntityIndices,
	getDuplicateNameIndices,
	getDuplicateUuidIndices,
	getDuplicateRoleIndices,
	getDuplicateUrlIndices
} from '../../../src/lib/get-duplicate-indices.js';
import applyModelGetter from '../../test-helpers/apply-model-getter.js';

describe('Get Duplicate Indices module', () => {

	describe('getDuplicateBaseInstanceIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateBaseInstanceIndices(
					[
						{ name: 'Foo', differentiator: '1' },
						{ name: 'Bar', differentiator: '' },
						{ name: 'Baz', differentiator: '' },
						{ name: 'Qux', differentiator: '' },
						{ name: 'Baz', differentiator: '1' },
						{ name: 'Foo', differentiator: '2' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

				const result = getDuplicateBaseInstanceIndices(
					[
						{ name: 'Foo', differentiator: '1' },
						{ name: '', differentiator: '' },
						{ name: 'Bar', differentiator: '' },
						{ name: 'Baz', differentiator: '' },
						{ name: '', differentiator: '' },
						{ name: 'Qux', differentiator: '' },
						{ name: 'Baz', differentiator: '' },
						{ name: 'Foo', differentiator: '1' }
					]
				);

				expect(result).to.deep.equal([0, 3, 6, 7]);

			});

		});

	});

	describe('getDuplicateCharacterIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateCharacterIndices(
					[
						{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: '' },
						{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: '' },
						{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: '' },
						{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger' },
						{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older' },
						{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'older' },
						{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'younger' },
						{ name: 'Foo', underlyingName: '', differentiator: '2', qualifier: 'older' },
						{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: '' },
						{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: '' },
						{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: '' },
						{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'younger' },
						{ name: 'Bar', underlyingName: '', differentiator: '', qualifier: 'older' },
						{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older' },
						{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'younger' },
						{ name: 'Bar', underlyingName: '', differentiator: '2', qualifier: 'older' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

				const result = getDuplicateCharacterIndices(
					[
						{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: '', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: 'Baz', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: 'Foo', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: '', underlyingName: '', differentiator: '1', qualifier: 'younger' },
						{ name: 'Qux', underlyingName: '', differentiator: '1', qualifier: 'younger' }
					]
				);

				expect(result).to.deep.equal([0, 1, 4, 5]);

			});

			it('considers entries where the name value matches (even when underlyingName value differs) as duplicates', () => {

				const result = getDuplicateCharacterIndices(
					[
						{ name: 'Foo', underlyingName: 'Bar', differentiator: '', qualifier: '' },
						{ name: 'Foo', underlyingName: 'Baz', differentiator: '', qualifier: '' }
					]
				);

				expect(result).to.deep.equal([0, 1]);

			});

			it('considers entries where the evaluated underlying name matches as duplicates', () => {

				const result = getDuplicateCharacterIndices(
					[
						{ name: 'Foo', underlyingName: '', differentiator: '', qualifier: '' },
						{ name: 'Bar', underlyingName: 'Foo', differentiator: '', qualifier: '' },
						{ name: 'Baz', underlyingName: '', differentiator: '', qualifier: '' },
						{ name: 'Qux', underlyingName: 'Quux', differentiator: '', qualifier: '' },
						{ name: 'Quuz', underlyingName: 'Quux', differentiator: '', qualifier: '' }
					]
				);

				expect(result).to.deep.equal([0, 1, 3, 4]);

			});

		});

	});

	describe('getDuplicateEntityIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateEntityIndices(
					[
						applyModelGetter({ name: 'Foo', differentiator: '' }, ''),
						applyModelGetter({ name: 'Foo', differentiator: '1' }, ''),
						applyModelGetter({ name: 'Foo', differentiator: '2' }, ''),
						applyModelGetter({ name: 'Foo', differentiator: '' }, 'COMPANY'),
						applyModelGetter({ name: 'Foo', differentiator: '1' }, 'COMPANY'),
						applyModelGetter({ name: 'Foo', differentiator: '2' }, 'COMPANY'),
						applyModelGetter({ name: 'Foo', differentiator: '' }, 'MATERIAL'),
						applyModelGetter({ name: 'Foo', differentiator: '1' }, 'MATERIAL'),
						applyModelGetter({ name: 'Foo', differentiator: '2' }, 'MATERIAL'),
						applyModelGetter({ name: 'Bar', differentiator: '' }, ''),
						applyModelGetter({ name: 'Bar', differentiator: '1' }, ''),
						applyModelGetter({ name: 'Bar', differentiator: '2' }, ''),
						applyModelGetter({ name: 'Bar', differentiator: '' }, 'COMPANY'),
						applyModelGetter({ name: 'Bar', differentiator: '1' }, 'COMPANY'),
						applyModelGetter({ name: 'Bar', differentiator: '2' }, 'COMPANY'),
						applyModelGetter({ name: 'Bar', differentiator: '' }, 'MATERIAL'),
						applyModelGetter({ name: 'Bar', differentiator: '1' }, 'MATERIAL'),
						applyModelGetter({ name: 'Bar', differentiator: '2' }, 'MATERIAL')
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

				const result = getDuplicateEntityIndices(
					[
						applyModelGetter({ name: 'Foo', differentiator: '1' }, ''),
						applyModelGetter({ name: 'Bar', differentiator: '1' }, 'MATERIAL'),
						applyModelGetter({ name: 'Bar', differentiator: '1' }, 'COMPANY'),
						applyModelGetter({ name: '', differentiator: '1' }, ''),
						applyModelGetter({ name: 'Baz', differentiator: '1' }, ''),
						applyModelGetter({ name: 'Foo', differentiator: '1' }, ''),
						applyModelGetter({ name: 'Bar', differentiator: '1' }, 'MATERIAL'),
						applyModelGetter({ name: '', differentiator: '1' }, ''),
						applyModelGetter({ name: 'Qux', differentiator: '1' }, '')
					]
				);

				expect(result).to.deep.equal([0, 1, 5, 6]);

			});

		});

	});

	describe('getDuplicateNameIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateNameIndices(
					[
						{ name: 'Foo' },
						{ name: 'Bar' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

				const result = getDuplicateNameIndices(
					[
						{ name: 'Foo' },
						{ name: 'Bar' },
						{ name: '' },
						{ name: 'Foo' }
					]
				);

				expect(result).to.deep.equal([0, 3]);

			});

		});

	});

	describe('getDuplicateRoleIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateRoleIndices(
					[
						{ name: 'Foo', characterName: '', characterDifferentiator: '', qualifier: '' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: '' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '2', qualifier: '' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '', qualifier: 'younger' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '', qualifier: 'older' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: 'older' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '2', qualifier: 'younger' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '2', qualifier: 'older' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '', qualifier: '' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: '' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '2', qualifier: '' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '', qualifier: 'older' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: 'older' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '2', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '2', qualifier: 'older' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string name values', () => {

				const result = getDuplicateRoleIndices(
					[
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: '', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Baz', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Foo', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Bar', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: '', characterName: '', characterDifferentiator: '1', qualifier: 'younger' },
						{ name: 'Qux', characterName: '', characterDifferentiator: '1', qualifier: 'younger' }
					]
				);

				expect(result).to.deep.equal([0, 1, 4, 5]);

			});

			it('considers entries where the name value matches (even when characterName value differs) as duplicates', () => {

				const result = getDuplicateRoleIndices(
					[
						{ name: 'Foo', characterName: 'Bar', characterDifferentiator: '', qualifier: '' },
						{ name: 'Foo', characterName: 'Baz', characterDifferentiator: '', qualifier: '' }
					]
				);

				expect(result).to.deep.equal([0, 1]);

			});

			it('considers entries where the evaluated character name matches as duplicates', () => {

				const result = getDuplicateRoleIndices(
					[
						{ name: 'Foo', characterName: '', characterDifferentiator: '', qualifier: '' },
						{ name: 'Bar', characterName: 'Foo', characterDifferentiator: '', qualifier: '' },
						{ name: 'Baz', characterName: '', characterDifferentiator: '', qualifier: '' },
						{ name: 'Qux', characterName: 'Quux', characterDifferentiator: '', qualifier: '' },
						{ name: 'Quuz', characterName: 'Quux', characterDifferentiator: '', qualifier: '' }
					]
				);

				expect(result).to.deep.equal([0, 1, 3, 4]);

			});

		});

	});

	describe('getDuplicateUrlIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateUrlIndices(
					[
						{ url: 'https://www.foo.com' },
						{ url: 'https://www.bar.com' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string url values', () => {

				const result = getDuplicateUrlIndices(
					[
						{ url: 'https://www.foo.com' },
						{ url: 'https://www.bar.com' },
						{ url: '' },
						{ url: 'https://www.foo.com' }
					]
				);

				expect(result).to.deep.equal([0, 3]);

			});

		});

	});

	describe('getDuplicateUuidIndices function', () => {

		context('duplicates do not exist', () => {

			it('returns an empty array', () => {

				const result = getDuplicateUuidIndices(
					[
						{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
						{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }
					]
				);

				expect(result).to.deep.equal([]);

			});

		});

		context('duplicates exist', () => {

			it('returns an array of indices of duplicate items, ignoring items with empty string uuid values', () => {

				const result = getDuplicateUuidIndices(
					[
						{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
						{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' },
						{ uuid: '' },
						{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
					]
				);

				expect(result).to.deep.equal([0, 3]);

			});

		});

	});

});
