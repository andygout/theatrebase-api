export default () => `
	MATCH (person:Person { uuid: $uuid })

	CALL {
		WITH person

		OPTIONAL MATCH (person)
			<-[:HAS_WRITING_ENTITY { creditType: 'RIGHTS_GRANTOR' }]
			-(material:Material)-[:HAS_SUB_MATERIAL*0..2]-(nominatedRightsGrantorMaterial:Material)
			<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
			<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)
			WHERE
				(material)-[:HAS_SUB_MATERIAL*0..2]->(nominatedRightsGrantorMaterial:Material) OR
				(material)<-[:HAS_SUB_MATERIAL*0..2]-(nominatedRightsGrantorMaterial:Material)

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

		WITH nominatedRightsGrantorMaterial, nomineeRel, category, categoryRel, ceremony, nominatedEntityRel,
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
					nominatedRightsGrantorMaterial,
					nomineeRel,
					category,
					categoryRel,
					ceremony,
					nominatedEntityRel,
					nominatedEntity,
					nominatedMember
					ORDER BY nominatedMemberRel.memberPosition

				WITH
					nominatedRightsGrantorMaterial,
					nomineeRel,
					category,
					categoryRel,
					ceremony,
					nominatedEntityRel,
					nominatedEntity,
					COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

		WITH
			nominatedRightsGrantorMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntityRel,
			nominatedEntity,
			nominatedMembers
			ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

		WITH nominatedRightsGrantorMaterial, nomineeRel, category, categoryRel, ceremony,
			COLLECT(
				CASE WHEN nominatedEntity IS NULL
					THEN null
					ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
				END
			) AS nominatedEntities

		WITH nominatedRightsGrantorMaterial, nomineeRel, category, categoryRel, ceremony,
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
			nominatedRightsGrantorMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductionRel,
			nominatedProduction,
			venue,
			surVenue,
			surProduction,
			surSurProduction
			ORDER BY nominatedProductionRel.productionPosition

		WITH nominatedRightsGrantorMaterial, nomineeRel, category, categoryRel, ceremony, nominatedEntities,
			COLLECT(
				CASE WHEN nominatedProduction IS NULL
					THEN null
					ELSE nominatedProduction {
						model: 'PRODUCTION',
						.uuid,
						.name,
						.startDate,
						.endDate,
						venue: CASE WHEN venue IS NULL
							THEN null
							ELSE venue {
								model: 'VENUE',
								.uuid,
								.name,
								surVenue: CASE WHEN surVenue IS NULL
									THEN null
									ELSE surVenue { model: 'VENUE', .uuid, .name }
								END
							}
						END,
						surProduction: CASE WHEN surProduction IS NULL
							THEN null
							ELSE surProduction {
								model: 'PRODUCTION',
								.uuid,
								.name,
								surProduction: CASE WHEN surSurProduction IS NULL
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
				nominatedMaterialRel.uuid <> nominatedRightsGrantorMaterial.uuid

		OPTIONAL MATCH (nominatedMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSurMaterial:Material)

		WITH
			nominatedRightsGrantorMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductions,
			nominatedMaterialRel,
			nominatedMaterial,
			nominatedSurMaterial
			ORDER BY nominatedMaterialRel.materialPosition

		WITH
			nominatedRightsGrantorMaterial,
			nomineeRel,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductions,
			COLLECT(
				CASE WHEN nominatedMaterial IS NULL
					THEN null
					ELSE nominatedMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE WHEN nominatedSurMaterial IS NULL
							THEN null
							ELSE nominatedSurMaterial { model: 'MATERIAL', .uuid, .name }
						END
					}
				END
			) AS nominatedMaterials
			ORDER BY nomineeRel.nominationPosition, nomineeRel.materialPosition

		OPTIONAL MATCH (nominatedRightsGrantorMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedRightsGrantorSurMaterial:Material)

		OPTIONAL MATCH (nominatedRightsGrantorSurMaterial)
			<-[:HAS_SUB_MATERIAL]-(nominatedRightsGrantorSurSurMaterial:Material)

		WITH
			nomineeRel.isWinner AS isWinner,
			nomineeRel.customType AS customType,
			category,
			categoryRel,
			ceremony,
			nominatedEntities,
			nominatedProductions,
			nominatedMaterials,
			COLLECT(
				CASE WHEN nominatedRightsGrantorMaterial IS NULL
					THEN null
					ELSE nominatedRightsGrantorMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE WHEN nominatedRightsGrantorSurMaterial IS NULL
							THEN null
							ELSE nominatedRightsGrantorSurMaterial {
								model: 'MATERIAL',
								.uuid,
								.name,
								surMaterial: CASE WHEN nominatedRightsGrantorSurSurMaterial IS NULL
									THEN null
									ELSE nominatedRightsGrantorSurSurMaterial { model: 'MATERIAL', .uuid, .name }
								END
							}
						END
					}
				END
			) AS nominatedRightsGrantorMaterials

		WITH category, categoryRel, ceremony,
			COLLECT({
				model: 'NOMINATION',
				isWinner: COALESCE(isWinner, false),
				type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
				entities: nominatedEntities,
				productions: nominatedProductions,
				materials: nominatedMaterials,
				recipientRightsGrantorMaterials: nominatedRightsGrantorMaterials
			}) AS nominations
			ORDER BY categoryRel.position

		WITH ceremony, COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
			ORDER BY ceremony.name DESC

		OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

		WITH award, COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
			ORDER BY award.name

		RETURN
			COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS rightsGrantorMaterialAwards
	}

	RETURN
		rightsGrantorMaterialAwards
`;
