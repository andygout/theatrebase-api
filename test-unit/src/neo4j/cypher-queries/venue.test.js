import { expect } from 'chai';

import * as cypherQueriesVenue from '../../../../src/neo4j/cypher-queries/venue/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Venue module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesVenue.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (venue:Venue { uuid: $uuid, name: $name, differentiator: $differentiator })
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (venue)-[:HAS_SUB_VENUE { position: subVenueParam.position }]->(subVenue)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					venue.uuid AS uuid,
					venue.name AS name,
					venue.differentiator AS differentiator,
					COLLECT(
						CASE WHEN subVenue IS NULL
							THEN null
							ELSE subVenue { .name, .differentiator }
						END
					) + [{}] AS subVenues
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesVenue.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (venue:Venue { uuid: $uuid })

				OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(:Venue)

				DELETE subVenueRel

				WITH DISTINCT venue

				SET
					venue.name = $name,
					venue.differentiator = $differentiator
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (venue)-[:HAS_SUB_VENUE { position: subVenueParam.position }]->(subVenue)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					venue.uuid AS uuid,
					venue.name AS name,
					venue.differentiator AS differentiator,
					COLLECT(
						CASE WHEN subVenue IS NULL
							THEN null
							ELSE subVenue { .name, .differentiator }
						END
					) + [{}] AS subVenues
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
