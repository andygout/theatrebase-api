import { expect } from 'chai';

import * as cypherQueriesAwardCeremonies from '../../../../src/neo4j/cypher-queries/award-ceremony/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Award Ceremony module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesAwardCeremonies.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (ceremony:AwardCeremony { uuid: $uuid, name: $name })
			`);

			const middleSegment = removeExcessWhitespace(`
				WITH ceremony
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					ceremony.uuid AS uuid,
					ceremony.name AS name,
					{ name: COALESCE(award.name, ''), differentiator: COALESCE(award.differentiator, '') } AS award,
					COLLECT(
						CASE WHEN category IS NULL
							THEN null
							ELSE category { .name, nominations }
						END
					) + [{
						nominations: [{
							entities: [{}],
							productions: [{ uuid: '' }],
							materials: [{}]
						}]
					}] AS categories
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesAwardCeremonies.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (ceremony:AwardCeremony { uuid: $uuid })

				OPTIONAL MATCH (ceremony)-[:PRESENTS_CATEGORY]->(category:AwardCeremonyCategory)

				DETACH DELETE category

				WITH ceremony

				OPTIONAL MATCH (ceremony)<-[awardRel:PRESENTED_AT]-(:Award)

				DELETE awardRel

				WITH DISTINCT ceremony

				SET ceremony.name = $name
			`);

			const middleSegment = removeExcessWhitespace(`
				WITH ceremony
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					ceremony.uuid AS uuid,
					ceremony.name AS name,
					{ name: COALESCE(award.name, ''), differentiator: COALESCE(award.differentiator, '') } AS award,
					COLLECT(
						CASE WHEN category IS NULL
							THEN null
							ELSE category { .name, nominations }
						END
					) + [{
						nominations: [{
							entities: [{}],
							productions: [{ uuid: '' }],
							materials: [{}]
						}]
					}] AS categories
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
