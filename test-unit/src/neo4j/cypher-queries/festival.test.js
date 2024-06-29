import { expect } from 'chai';

import * as cypherQueriesFestival from '../../../../src/neo4j/cypher-queries/festival/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Festival module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesFestival.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (festival:Festival { uuid: $uuid, name: $name, differentiator: $differentiator })
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (festival)-[:PART_OF_FESTIVAL_SERIES]->(festivalSeries)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					festival.uuid AS uuid,
					festival.name AS name,
					festival.differentiator AS differentiator,
					{
						name: COALESCE(festivalSeries.name, ''),
						differentiator: COALESCE(festivalSeries.differentiator, '')
					} AS festivalSeries
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesFestival.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (festival:Festival { uuid: $uuid })

				OPTIONAL MATCH (festival)-[festivalSeriesRel:PART_OF_FESTIVAL_SERIES]->(:FestivalSeries)

				DELETE festivalSeriesRel

				WITH DISTINCT festival

				SET
					festival.name = $name,
					festival.differentiator = $differentiator
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (festival)-[:PART_OF_FESTIVAL_SERIES]->(festivalSeries)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					festival.uuid AS uuid,
					festival.name AS name,
					festival.differentiator AS differentiator,
					{
						name: COALESCE(festivalSeries.name, ''),
						differentiator: COALESCE(festivalSeries.differentiator, '')
					} AS festivalSeries
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
