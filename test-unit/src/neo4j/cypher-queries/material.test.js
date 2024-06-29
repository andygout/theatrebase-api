import { expect } from 'chai';

import * as cypherQueriesMaterial from '../../../../src/neo4j/cypher-queries/material/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Material module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesMaterial.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (material:Material {
					uuid: $uuid,
					name: $name,
					differentiator: $differentiator,
					subtitle: $subtitle,
					format: $format,
					year: $year
				})
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					material.uuid AS uuid,
					material.name AS name,
					material.differentiator AS differentiator,
					material.subtitle AS subtitle,
					material.format AS format,
					material.year AS year,
					{
						name: COALESCE(originalVersionMaterial.name, ''),
						differentiator: COALESCE(originalVersionMaterial.differentiator, '')
					} AS originalVersionMaterial,
					writingCredits,
					subMaterials,
					COLLECT(
						CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
							THEN null
							ELSE { name: characterGroupName, characters: characters }
						END
					) + [{ characters: [{}] }] AS characterGroups
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesMaterial.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (material:Material { uuid: $uuid })

				OPTIONAL MATCH (material)-[originalVersionMaterialRel:SUBSEQUENT_VERSION_OF]->(:Material)

				DELETE originalVersionMaterialRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[writerRel:HAS_WRITING_ENTITY]->(entity:Person|Company)

				DELETE writerRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[sourceMaterialRel:USES_SOURCE_MATERIAL]->(:Material)

				DELETE sourceMaterialRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[subMaterialRel:HAS_SUB_MATERIAL]->(:Material)

				DELETE subMaterialRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[characterRel:DEPICTS]->(:Character)

				DELETE characterRel

				WITH DISTINCT material

				SET
					material.name = $name,
					material.differentiator = $differentiator,
					material.subtitle = $subtitle,
					material.format = $format,
					material.year = $year
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					material.uuid AS uuid,
					material.name AS name,
					material.differentiator AS differentiator,
					material.subtitle AS subtitle,
					material.format AS format,
					material.year AS year,
					{
						name: COALESCE(originalVersionMaterial.name, ''),
						differentiator: COALESCE(originalVersionMaterial.differentiator, '')
					} AS originalVersionMaterial,
					writingCredits,
					subMaterials,
					COLLECT(
						CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
							THEN null
							ELSE { name: characterGroupName, characters: characters }
						END
					) + [{ characters: [{}] }] AS characterGroups
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
