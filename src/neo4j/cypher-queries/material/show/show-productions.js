export default () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL*0..1]-(:Material)<-[:PRODUCTION_OF]-(production:Production)

	WITH COLLECT(production) AS productions

	UNWIND (CASE productions WHEN [] THEN [null] ELSE productions END) AS production

		OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

		OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

		OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(:Material)<-[sourcingMaterialRel:PRODUCTION_OF]-(production)

		WITH
			production,
			venue,
			surVenue,
			surProduction,
			surProductionRel,
			surSurProduction,
			surSurProductionRel,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS usesSourcingMaterial
			ORDER BY
				production.startDate DESC,
				COALESCE(surSurProduction.name, surProduction.name, production.name),
				surSurProductionRel.position DESC,
				surProductionRel.position DESC,
				venue.name

		WITH
			COLLECT(
				CASE production WHEN NULL
					THEN null
					ELSE production {
						model: 'PRODUCTION',
						.uuid,
						.name,
						.startDate,
						.endDate,
						usesSourcingMaterial,
						venue: CASE venue WHEN NULL
							THEN null
							ELSE venue {
								model: 'VENUE',
								.uuid,
								.name,
								surVenue: CASE surVenue WHEN NULL
									THEN null
									ELSE surVenue { model: 'VENUE', .uuid, .name }
								END
							}
						END,
						surProduction: CASE surProduction WHEN NULL
							THEN null
							ELSE surProduction {
								model: 'PRODUCTION',
								.uuid,
								.name,
								surProduction: CASE surSurProduction WHEN NULL
									THEN null
									ELSE surSurProduction { model: 'PRODUCTION', .uuid, .name }
								END
							}
						END
					}
				END
			) AS productions

	RETURN
		[
			production IN productions WHERE NOT production.usesSourcingMaterial |
			production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
		] AS productions,
		[
			production IN productions WHERE production.usesSourcingMaterial |
			production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
		] AS sourcingMaterialProductions
`;
