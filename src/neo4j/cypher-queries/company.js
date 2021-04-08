const getShowQuery = () => `
	MATCH (company:Company { uuid: $uuid })

	OPTIONAL MATCH (company)<-[:WRITTEN_BY|USES_SOURCE_MATERIAL*1..2]-(material:Material)

	WITH company, COLLECT(DISTINCT(material)) AS materials

	UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

		OPTIONAL MATCH (company)<-[writerRel:WRITTEN_BY]-(material)

		OPTIONAL MATCH (company)<-[:WRITTEN_BY]-(:Material)<-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (company)<-[:WRITTEN_BY]-(:Material)<-[sourcingMaterialRel:USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (material)-[entityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

		WITH
			company,
			material,
			writerRel.creditType AS creditType,
			CASE writerRel WHEN NULL THEN false ELSE true END AS hasDirectCredit,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			entityRel,
			entity,
			sourceMaterialWriterRel,
			sourceMaterialWriter
			ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

		WITH
			company,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE sourceMaterialWriter {
						model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))),
						uuid: CASE sourceMaterialWriter.uuid WHEN company.uuid
							THEN null
							ELSE sourceMaterialWriter.uuid
						END,
						.name
					}
				END
			) AS sourceMaterialWriters

		WITH
			company,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			COLLECT(
				CASE SIZE(sourceMaterialWriters) WHEN 0
					THEN null
					ELSE {
						model: 'writingCredit',
						name: COALESCE(sourceMaterialWritingCreditName, 'by'),
						entities: sourceMaterialWriters
					}
				END
			) AS sourceMaterialWritingCredits
			ORDER BY entityRel.creditPosition, entityRel.entityPosition

		WITH
			company,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel.credit AS writingCreditName,
			[entity IN COLLECT(
				CASE entity WHEN NULL
					THEN null
					ELSE entity {
						model: TOLOWER(HEAD(LABELS(entity))),
						uuid: CASE entity.uuid WHEN company.uuid THEN null ELSE entity.uuid END,
						.name,
						.format,
						sourceMaterialWritingCredits: sourceMaterialWritingCredits
					}
				END
			) | CASE entity.model WHEN 'material'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH company, material, creditType, hasDirectCredit, isSubsequentVersion, isSourcingMaterial,
			COLLECT(
				CASE SIZE(entities) WHEN 0
					THEN null
					ELSE {
						model: 'writingCredit',
						name: COALESCE(writingCreditName, 'by'),
						entities: entities
					}
				END
			) AS writingCredits
			ORDER BY material.name

		WITH company,
			COLLECT(
				CASE material WHEN NULL
					THEN null
					ELSE material {
						model: 'material',
						.uuid,
						.name,
						.format,
						writingCredits: writingCredits,
						creditType: creditType,
						hasDirectCredit: hasDirectCredit,
						isSubsequentVersion: isSubsequentVersion,
						isSourcingMaterial: isSourcingMaterial
					}
				END
			) AS materials

	OPTIONAL MATCH (company)<-[creativeRel:HAS_CREATIVE_TEAM_MEMBER]-(creativeProduction:Production)

	UNWIND (CASE WHEN creativeRel IS NOT NULL AND EXISTS(creativeRel.creditedMemberUuids)
		THEN creativeRel.creditedMemberUuids
		ELSE [null]
	END) AS creditedMemberUuid

		OPTIONAL MATCH (creativeProduction)-[creditedMemberRel:HAS_CREATIVE_TEAM_MEMBER]->
			(creditedMember:Person { uuid: creditedMemberUuid })
			WHERE creativeRel.creditPosition IS NULL OR creativeRel.creditPosition = creditedMemberRel.creditPosition

		WITH company, materials, creativeRel, creativeProduction, creditedMember
			ORDER BY creditedMemberRel.memberPosition

		WITH company, materials, creativeRel, creativeProduction,
			COLLECT(creditedMember { model: 'person', .uuid, .name }) AS creditedMembers

	OPTIONAL MATCH (creativeProduction)-[coCreativeEntityRel:HAS_CREATIVE_TEAM_MEMBER]->(coCreativeEntity)
		WHERE
			(coCreativeEntity:Person OR coCreativeEntity:Company) AND
			coCreativeEntityRel.creditedCompanyUuid IS NULL AND
			(creativeRel.creditPosition IS NULL OR creativeRel.creditPosition = coCreativeEntityRel.creditPosition) AND
			coCreativeEntity.uuid <> company.uuid

	UNWIND (CASE WHEN coCreativeEntityRel IS NOT NULL AND EXISTS(coCreativeEntityRel.creditedMemberUuids)
		THEN [uuid IN coCreativeEntityRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCreativeCompanyCreditedMemberUuid

		OPTIONAL MATCH (creativeProduction)-[coCreativeCompanyCreditedMemberRel:HAS_CREATIVE_TEAM_MEMBER]->
			(coCreativeCompanyCreditedMember:Person { uuid: coCreativeCompanyCreditedMemberUuid })
			WHERE
				coCreativeEntityRel.creditPosition IS NULL OR
				coCreativeEntityRel.creditPosition = coCreativeCompanyCreditedMemberRel.creditPosition

		WITH
			company,
			materials,
			creativeRel,
			creativeProduction,
			creditedMembers,
			coCreativeEntityRel,
			coCreativeEntity,
			coCreativeCompanyCreditedMember
			ORDER BY coCreativeCompanyCreditedMemberRel.memberPosition

		WITH company, materials, creativeRel, creativeProduction, creditedMembers, coCreativeEntityRel, coCreativeEntity,
			COLLECT(coCreativeCompanyCreditedMember {
				model: 'person',
				.uuid,
				.name
			}) AS coCreativeCompanyCreditedMembers
			ORDER BY coCreativeEntityRel.entityPosition

	WITH company, materials, creativeRel, creativeProduction, creditedMembers,
		[coCreditedEntity IN COLLECT(
			CASE coCreativeEntity WHEN NULL
				THEN null
				ELSE coCreativeEntity {
					model: TOLOWER(HEAD(LABELS(coCreativeEntity))),
					.uuid,
					.name,
					creditedMembers: coCreativeCompanyCreditedMembers
				}
			END
		) | CASE coCreditedEntity.model WHEN 'company'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities
		ORDER BY creativeRel.creditPosition

	OPTIONAL MATCH (creativeProduction)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH company, materials, creativeProduction, theatre, surTheatre,
		COLLECT({
			model: 'creativeCredit',
			name: creativeRel.credit,
			creditedMembers: creditedMembers,
			coCreditedEntities: coCreditedEntities
		}) AS creativeCredits
		ORDER BY creativeProduction.name, theatre.name

	WITH company, materials,
		COLLECT(
			CASE creativeProduction WHEN NULL
				THEN null
				ELSE creativeProduction {
					model: 'production',
					.uuid,
					.name,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE theatre {
							model: 'theatre',
							.uuid,
							.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE surTheatre { model: 'theatre', .uuid, .name }
							END
						}
					END,
					creativeCredits: creativeCredits
				}
			END
		) AS creativeProductions

	OPTIONAL MATCH (company)<-[crewRel:HAS_CREW_MEMBER]-(production:Production)

	UNWIND (CASE WHEN crewRel IS NOT NULL AND EXISTS(crewRel.creditedMemberUuids)
		THEN crewRel.creditedMemberUuids
		ELSE [null]
	END) AS creditedMemberUuid

		OPTIONAL MATCH (production)-[creditedMemberRel:HAS_CREW_MEMBER]->
			(creditedMember:Person { uuid: creditedMemberUuid })
			WHERE crewRel.creditPosition IS NULL OR crewRel.creditPosition = creditedMemberRel.creditPosition

		WITH company, materials, creativeProductions, crewRel, production, creditedMember
			ORDER BY creditedMemberRel.memberPosition

		WITH company, materials, creativeProductions, crewRel, production,
			COLLECT(creditedMember { model: 'person', .uuid, .name }) AS creditedMembers

	OPTIONAL MATCH (production)-[coCrewEntityRel:HAS_CREW_MEMBER]->(coCrewEntity)
		WHERE
			(coCrewEntity:Person OR coCrewEntity:Company) AND
			coCrewEntityRel.creditedCompanyUuid IS NULL AND
			(crewRel.creditPosition IS NULL OR crewRel.creditPosition = coCrewEntityRel.creditPosition) AND
			coCrewEntity.uuid <> company.uuid

	UNWIND (CASE WHEN coCrewEntityRel IS NOT NULL AND EXISTS(coCrewEntityRel.creditedMemberUuids)
		THEN [uuid IN coCrewEntityRel.creditedMemberUuids]
		ELSE [null]
	END) AS coCrewCompanyCreditedMemberUuid

		OPTIONAL MATCH (production)-[coCrewCompanyCreditedMemberRel:HAS_CREW_MEMBER]->
			(coCrewCompanyCreditedMember:Person { uuid: coCrewCompanyCreditedMemberUuid })
			WHERE
				coCrewEntityRel.creditPosition IS NULL OR
				coCrewEntityRel.creditPosition = coCrewCompanyCreditedMemberRel.creditPosition

		WITH
			company,
			materials,
			creativeProductions,
			crewRel,
			production,
			creditedMembers,
			coCrewEntityRel,
			coCrewEntity,
			coCrewCompanyCreditedMember
			ORDER BY coCrewCompanyCreditedMemberRel.memberPosition

		WITH
			company,
			materials,
			creativeProductions,
			crewRel,
			production,
			creditedMembers,
			coCrewEntityRel,
			coCrewEntity,
			COLLECT(coCrewCompanyCreditedMember {
				model: 'person',
				.uuid,
				.name
			}) AS coCrewCompanyCreditedMembers
			ORDER BY coCrewEntityRel.entityPosition

	WITH company, materials, creativeProductions, crewRel, production, creditedMembers,
		[coCreditedEntity IN COLLECT(
			CASE coCrewEntity WHEN NULL
				THEN null
				ELSE coCrewEntity {
					model: TOLOWER(HEAD(LABELS(coCrewEntity))),
					.uuid,
					.name,
					creditedMembers: coCrewCompanyCreditedMembers
				}
			END
		) | CASE coCreditedEntity.model WHEN 'company'
			THEN coCreditedEntity
			ELSE coCreditedEntity { .model, .uuid, .name }
		END] AS coCreditedEntities
		ORDER BY crewRel.creditPosition

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH company, materials, creativeProductions, production, theatre, surTheatre,
		COLLECT({
			model: 'crewCredit',
			name: crewRel.credit,
			creditedMembers: creditedMembers,
			coCreditedEntities: coCreditedEntities
		}) AS crewCredits
		ORDER BY production.name, theatre.name

	RETURN
		'company' AS model,
		company.uuid AS uuid,
		company.name AS name,
		company.differentiator AS differentiator,
		[
			material IN materials WHERE
				material.hasDirectCredit AND
				NOT material.isSubsequentVersion AND
				material.creditType IS NULL |
			material { .model, .uuid, .name, .format, .writingCredits }
		] AS materials,
		[
			material IN materials WHERE material.isSubsequentVersion |
			material { .model, .uuid, .name, .format, .writingCredits }
		] AS subsequentVersionMaterials,
		[
			material IN materials WHERE
				material.isSourcingMaterial OR
				material.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
			material { .model, .uuid, .name, .format, .writingCredits }
		] AS sourcingMaterials,
		[
			material IN materials WHERE material.creditType = 'RIGHTS_GRANTOR' |
			material { .model, .uuid, .name, .format, .writingCredits }
		] AS rightsGrantorMaterials,
		creativeProductions,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
					model: 'production',
					.uuid,
					.name,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE theatre {
							model: 'theatre',
							.uuid,
							.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE surTheatre { model: 'theatre', .uuid, .name }
							END
						}
					END,
					crewCredits: crewCredits
				}
			END
		) AS crewProductions
`;

export {
	getShowQuery
};
