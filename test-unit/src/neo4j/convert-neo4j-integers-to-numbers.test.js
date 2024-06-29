import { expect } from 'chai';
import neo4j from 'neo4j-driver';

import { convertNeo4jIntegersToNumbers } from '../../../src/neo4j/convert-neo4j-integers-to-numbers.js';

describe('Convert Neo4j Integers To Numbers module', () => {

	describe('Neo4j integers', () => {

		context('Neo4j integer is input value', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = neo4j.int(1);
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.equal(1);

			});

		});

		context('Neo4j integer is top level property', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = { foo: neo4j.int(1) };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: 1 });

			});

		});

		context('Neo4j integer is top level property where input value is an array', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = [{ foo: neo4j.int(1) }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: 1 }]);

			});

		});

		context('Neo4j integer is nested level property', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = { foo: { bar: neo4j.int(1) } };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: { bar: 1 } });

			});

		});

		context('Neo4j integer is nested level property where input value is an array', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = [{ foo: { bar: neo4j.int(1) } }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: { bar: 1 } }]);

			});

		});

		context('Neo4j integer is property in array at top level', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = { foo: [{ bar: neo4j.int(1) }] };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: [{ bar: 1 }] });

			});

		});

		context('Neo4j integer is property in array at top level where input value is an array', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = [{ foo: [{ bar: neo4j.int(1) }] }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: [{ bar: 1 }] }]);

			});

		});

		context('Neo4j integer is property in array at nested level (nested in object)', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = { foo: { bar: [{ baz: neo4j.int(1) }] } };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: { bar: [{ baz: 1 }] } });

			});

		});

		context('Neo4j integer is property in array at nested level (nested in object) where input value is an array', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = [{ foo: { bar: [{ baz: neo4j.int(1) }] } }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: { bar: [{ baz: 1 }] } }]);

			});

		});

		context('Neo4j integer is property in array at nested level (nested in array)', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = { foo: [{ bar: [{ baz: neo4j.int(1) }] }] };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: [{ bar: [{ baz: 1 }] }] });

			});

		});

		context('Neo4j integer is property in array at nested level (nested in array) where input value is an array', () => {

			it('converts Neo4j integer to number', () => {

				const inputValue = [{ foo: [{ bar: [{ baz: neo4j.int(1) }] }] }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: [{ bar: [{ baz: 1 }] }] }]);

			});

		});

	});

	describe('Empty objects', () => {

		context('Empty object in array as input value', () => {

			it('leaves empty object value untouched', () => {

				const inputValue = [{}];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{}]);

			});

		});

		context('Empty object in array at top level', () => {

			it('leaves empty object value untouched', () => {

				const inputValue = { foo: [{}] };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: [{}] });

			});

		});

		context('Empty object in array at top level where input value is an array', () => {

			it('leaves empty object value untouched', () => {

				const inputValue = [{ foo: [{}] }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: [{}] }]);

			});

		});

		context('Empty object in array at nested level (nested in object)', () => {

			it('leaves empty object value untouched', () => {

				const inputValue = { foo: { bar: [{}] } };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: { bar: [{}] } });

			});

		});

		context('Empty object in array at nested level (nested in object) where input value is an array', () => {

			it('leaves empty object value untouched', () => {

				const inputValue = [{ foo: { bar: [{}] } }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: { bar: [{}] } }]);

			});

		});

		context('Empty object in array at nested level (nested in array)', () => {

			it('leaves empty object value untouched', () => {

				const inputValue = { foo: [{ bar: [{}] }] };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: [{ bar: [{}] }] });

			});

		});

		context('Empty object in array at nested level (nested in array) where input value is an array', () => {

			it('leaves empty object value untouched', () => {

				const inputValue = [{ foo: [{ bar: [{}] }] }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: [{ bar: [{}] }] }]);

			});

		});

	});

	describe('Strings', () => {

		context('String in array as input value', () => {

			it('leaves string value untouched', () => {

				const inputValue = ['string'];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal(['string']);

			});

		});

		context('String in array at top level', () => {

			it('leaves string value untouched', () => {

				const inputValue = { foo: ['string'] };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: ['string'] });

			});

		});

		context('String in array at top level where input value is an array', () => {

			it('leaves string value untouched', () => {

				const inputValue = [{ foo: ['string'] }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: ['string'] }]);

			});

		});

		context('String in array at nested level (nested in object)', () => {

			it('leaves string value untouched', () => {

				const inputValue = { foo: { bar: ['string'] } };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: { bar: ['string'] } });

			});

		});

		context('String in array at nested level (nested in object) where input value is an array', () => {

			it('leaves string value untouched', () => {

				const inputValue = [{ foo: { bar: ['string'] } }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: { bar: ['string'] } }]);

			});

		});

		context('String in array at nested level (nested in array)', () => {

			it('leaves string value untouched', () => {

				const inputValue = { foo: [{ bar: ['string'] }] };
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal({ foo: [{ bar: ['string'] }] });

			});

		});

		context('String in array at nested level (nested in array) where input value is an array', () => {

			it('leaves string value untouched', () => {

				const inputValue = [{ foo: [{ bar: ['string'] }] }];
				const result = convertNeo4jIntegersToNumbers(inputValue);
				expect(result).to.deep.equal([{ foo: [{ bar: ['string'] }] }]);

			});

		});

	});

});
