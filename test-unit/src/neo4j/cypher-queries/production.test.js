import { expect } from 'chai';

import * as cypherQueriesProduction from '../../../../src/neo4j/cypher-queries/production/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Production module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (production:Production {
					uuid: $uuid,
					name: $name,
					subtitle: $subtitle,
					startDate: $startDate,
					pressDate: $pressDate,
					endDate: $endDate
				})
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (production)-[:PRODUCTION_OF]->(material)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					production.uuid AS uuid,
					production.name AS name,
					production.subtitle AS subtitle,
					production.startDate AS startDate,
					production.pressDate AS pressDate,
					production.endDate AS endDate,
					{ name: COALESCE(material.name, ''), differentiator: COALESCE(material.differentiator, '') } AS material,
					{ name: COALESCE(venue.name, ''), differentiator: COALESCE(venue.differentiator, '') } AS venue,
					{ name: COALESCE(season.name, ''), differentiator: COALESCE(season.differentiator, '') } AS season,
					{ name: COALESCE(festival.name, ''), differentiator: COALESCE(festival.differentiator, '') } AS festival,
					subProductions,
					producerCredits,
					cast,
					creativeCredits,
					crewCredits,
					COLLECT(
						CASE WHEN publicationRel IS NULL
							THEN null
							ELSE {
								url: publicationRel.url,
								date: publicationRel.date,
								publication: publication { .name, .differentiator },
								critic: critic { .name, .differentiator }
							}
						END
					) + [{}] AS reviews
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[relationship]-()
					WHERE NOT EXISTS((production)<-[relationship:HAS_SUB_PRODUCTION]-(:Production))

				DELETE relationship

				WITH DISTINCT production

				SET
					production.name = $name,
					production.subtitle = $subtitle,
					production.startDate = $startDate,
					production.pressDate = $pressDate,
					production.endDate = $endDate
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (production)-[:PLAYS_AT]->(venue)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					production.uuid AS uuid,
					production.name AS name,
					production.subtitle AS subtitle,
					production.startDate AS startDate,
					production.pressDate AS pressDate,
					production.endDate AS endDate,
					{ name: COALESCE(material.name, ''), differentiator: COALESCE(material.differentiator, '') } AS material,
					{ name: COALESCE(venue.name, ''), differentiator: COALESCE(venue.differentiator, '') } AS venue,
					{ name: COALESCE(season.name, ''), differentiator: COALESCE(season.differentiator, '') } AS season,
					{ name: COALESCE(festival.name, ''), differentiator: COALESCE(festival.differentiator, '') } AS festival,
					subProductions,
					producerCredits,
					cast,
					creativeCredits,
					crewCredits,
					COLLECT(
						CASE WHEN publicationRel IS NULL
							THEN null
							ELSE {
								url: publicationRel.url,
								date: publicationRel.date,
								publication: publication { .name, .differentiator },
								critic: critic { .name, .differentiator }
							}
						END
					) + [{}] AS reviews
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
