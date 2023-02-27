export default () => `
	MATCH (company:Company { uuid: $uuid })

	OPTIONAL MATCH (company)<-[:HAS_WRITING_ENTITY]-(:Material)
		<-[:SUBSEQUENT_VERSION_OF]-(nominatedSubsequentVersionMaterial:Material)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (nominatedSubsequentVersionMaterial)
		<-[:HAS_SUB_MATERIAL]-(nominatedSubsequentVersionSurMaterial:Material)

	OPTIONAL MATCH (nominatedSubsequentVersionSurMaterial)
		<-[:HAS_SUB_MATERIAL]-(nominatedSubsequentVersionSurSurMaterial:Material)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(subsequentVersionMaterialAward:Award)

	OPTIONAL MATCH (category)-[nominatedEntityRel:HAS_NOMINEE]->(nominatedEntity)
		WHERE
			(
				(nominatedEntity:Person AND nominatedEntityRel.nominatedCompanyUuid IS NULL) OR
				nominatedEntity:Company
			) AND
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedEntityRel.nominationPosition
			)

	WITH
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nominatedSubsequentVersionSurSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntityRel,
		COLLECT(nominatedEntity {
			model: TOUPPER(HEAD(LABELS(nominatedEntity))),
			.uuid,
			.name,
			nominatedMemberUuids: nominatedEntityRel.nominatedMemberUuids
		}) AS nominatedEntities

	UNWIND (CASE nominatedEntities WHEN [] THEN [null] ELSE nominatedEntities END) AS nominatedEntity

		UNWIND (COALESCE(nominatedEntity.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nominatedEntityRel.nominationPosition IS NULL OR
					nominatedEntityRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH
				nominatedSubsequentVersionMaterial,
				nominatedSubsequentVersionSurMaterial,
				nominatedSubsequentVersionSurSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				subsequentVersionMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				nominatedSubsequentVersionMaterial,
				nominatedSubsequentVersionSurMaterial,
				nominatedSubsequentVersionSurSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				subsequentVersionMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nominatedSubsequentVersionSurSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nominatedSubsequentVersionSurSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) AS nominatedEntities

	WITH
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nominatedSubsequentVersionSurSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		[nominatedEntity IN nominatedEntities | CASE nominatedEntity.model WHEN 'COMPANY'
			THEN nominatedEntity
			ELSE nominatedEntity { .model, .uuid, .name }
		END] AS nominatedEntities

	OPTIONAL MATCH (category)-[nominatedProductionRel:HAS_NOMINEE]->(nominatedProduction:Production)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedProductionRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedProduction)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	OPTIONAL MATCH (nominatedProduction)<-[:HAS_SUB_PRODUCTION]-(surProduction:Production)

	OPTIONAL MATCH (surProduction)<-[:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

	WITH
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nominatedSubsequentVersionSurSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue,
		surProduction,
		surSurProduction
		ORDER BY nominatedProductionRel.productionPosition

	WITH
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nominatedSubsequentVersionSurSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		COLLECT(
			CASE nominatedProduction WHEN NULL
				THEN null
				ELSE nominatedProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
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
		) AS nominatedProductions

	OPTIONAL MATCH (category)-[nominatedMaterialRel:HAS_NOMINEE]->(nominatedMaterial:Material)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedMaterialRel.nominationPosition
			) AND
			nominatedMaterialRel.uuid <> nominatedSubsequentVersionMaterial.uuid

	OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

	WITH
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nominatedSubsequentVersionSurSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial,
		nominatedSurMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nominatedSubsequentVersionSurSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductions,
		COLLECT(
			CASE nominatedMaterial WHEN NULL
				THEN null
				ELSE nominatedMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE nominatedSurMaterial WHEN NULL
						THEN null
						ELSE nominatedSurMaterial { model: 'MATERIAL', .uuid, .name }
					END
				}
			END
		) AS nominatedMaterials
		ORDER BY nomineeRel.nominationPosition, nomineeRel.materialPosition

	WITH
		nomineeRel.isWinner AS isWinner,
		nomineeRel.customType AS customType,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterials,
		COLLECT(
			CASE nominatedSubsequentVersionMaterial WHEN NULL
				THEN null
				ELSE nominatedSubsequentVersionMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE nominatedSubsequentVersionSurMaterial WHEN NULL
						THEN null
						ELSE nominatedSubsequentVersionSurMaterial {
							model: 'MATERIAL',
							.uuid,
							.name,
							surMaterial: CASE nominatedSubsequentVersionSurSurMaterial WHEN NULL
								THEN null
								ELSE nominatedSubsequentVersionSurSurMaterial { model: 'MATERIAL', .uuid, .name }
							END
						}
					END
				}
			END
		) AS nominatedSubsequentVersionMaterials

	WITH
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(isWinner, false),
			type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
			entities: nominatedEntities,
			productions: nominatedProductions,
			materials: nominatedMaterials,
			subsequentVersionMaterials: nominatedSubsequentVersionMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		ceremony,
		subsequentVersionMaterialAward,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		subsequentVersionMaterialAward,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY subsequentVersionMaterialAward.name

	RETURN
		COLLECT(subsequentVersionMaterialAward {
			model: 'AWARD',
			.uuid,
			.name,
			ceremonies
		}) AS subsequentVersionMaterialAwards
`;