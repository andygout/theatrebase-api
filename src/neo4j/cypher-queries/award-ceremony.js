import { ACTIONS } from '../../utils/constants';

const getAwardContextualDuplicateRecordCountQuery = () => `
	MATCH (ceremony:AwardCeremony { name: $name })<-[:PRESENTED_AT]-(award:Award { name: $award.name })
		WHERE
			(
				$uuid IS NULL OR
				$uuid <> ceremony.uuid
			) AND
			(
				($award.differentiator IS NULL AND award.differentiator IS NULL) OR
				$award.differentiator = award.differentiator
			)

	RETURN SIGN(COUNT(ceremony)) AS duplicateRecordCount
`;

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (ceremony:AwardCeremony { uuid: $uuid, name: $name })
		`,
		[ACTIONS.UPDATE]: `
			MATCH (ceremony:AwardCeremony { uuid: $uuid })

			OPTIONAL MATCH (ceremony)-[:PRESENTS_CATEGORY]->(category:AwardCeremonyCategory)

			DETACH DELETE category

			WITH ceremony

			OPTIONAL MATCH (ceremony)<-[awardRel:PRESENTED_AT]-(:Award)

			DELETE awardRel

			WITH DISTINCT ceremony

			SET ceremony.name = $name
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH ceremony

		OPTIONAL MATCH (existingAward:Award { name: $award.name })
			WHERE
				($award.differentiator IS NULL AND existingAward.differentiator IS NULL) OR
				$award.differentiator = existingAward.differentiator

		FOREACH (item IN CASE $award.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (award:Award {
				uuid: COALESCE(existingAward.uuid, $award.uuid),
				name: $award.name
			})
				ON CREATE SET award.differentiator = $award.differentiator

			CREATE (ceremony)<-[:PRESENTED_AT]-(award)
		)

		WITH DISTINCT ceremony

		UNWIND (CASE $categories WHEN [] THEN [{ nominations: [] }] ELSE $categories END) AS categoryParam

			FOREACH (item IN CASE categoryParam.name WHEN NULL THEN [] ELSE [1] END |
				CREATE (:AwardCeremonyCategory { name: categoryParam.name })
					<-[:PRESENTS_CATEGORY { position: categoryParam.position }]-(ceremony)
			)

			WITH ceremony, categoryParam

			OPTIONAL MATCH (category:AwardCeremonyCategory { name: categoryParam.name })
				<-[:PRESENTS_CATEGORY]-(ceremony)

			UNWIND (CASE categoryParam.nominations WHEN []
				THEN [{ entities: [], productions: [] }]
				ELSE categoryParam.nominations
			END) AS nomination

				UNWIND
					CASE SIZE([entity IN nomination.entities WHERE entity.model = 'PERSON']) WHEN 0
						THEN [null]
						ELSE [entity IN nomination.entities WHERE entity.model = 'PERSON']
					END AS nomineePersonParam

					OPTIONAL MATCH (existingNomineePerson:Person { name: nomineePersonParam.name })
						WHERE
							(
								nomineePersonParam.differentiator IS NULL AND
								existingNomineePerson.differentiator IS NULL
							) OR
							nomineePersonParam.differentiator = existingNomineePerson.differentiator

					FOREACH (item IN CASE nomineePersonParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (nomineePerson:Person {
							uuid: COALESCE(existingNomineePerson.uuid, nomineePersonParam.uuid),
							name: nomineePersonParam.name
						})
							ON CREATE SET nomineePerson.differentiator = nomineePersonParam.differentiator

						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								entityPosition: nomineePersonParam.position,
								isWinner: nomination.isWinner
							}]->(nomineePerson)
					)

				WITH DISTINCT ceremony, category, nomination

				UNWIND
					CASE SIZE([entity IN nomination.entities WHERE entity.model = 'COMPANY']) WHEN 0
						THEN [null]
						ELSE [entity IN nomination.entities WHERE entity.model = 'COMPANY']
					END AS nomineeCompanyParam

					OPTIONAL MATCH (existingNomineeCompany:Company { name: nomineeCompanyParam.name })
						WHERE
							(
								nomineeCompanyParam.differentiator IS NULL AND
								existingNomineeCompany.differentiator IS NULL
							) OR
							nomineeCompanyParam.differentiator = existingNomineeCompany.differentiator

					FOREACH (item IN CASE nomineeCompanyParam WHEN NULL THEN [] ELSE [1] END |
						MERGE (nomineeCompany:Company {
							uuid: COALESCE(existingNomineeCompany.uuid, nomineeCompanyParam.uuid),
							name: nomineeCompanyParam.name
						})
							ON CREATE SET nomineeCompany.differentiator = nomineeCompanyParam.differentiator

						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								entityPosition: nomineeCompanyParam.position,
								isWinner: nomination.isWinner
							}]->(nomineeCompany)
					)

					WITH DISTINCT ceremony, category, nomination, nomineeCompanyParam

					UNWIND
						CASE WHEN nomineeCompanyParam IS NOT NULL AND SIZE(nomineeCompanyParam.members) > 0
							THEN nomineeCompanyParam.members
							ELSE [null]
						END AS nominatedMemberParam

						OPTIONAL MATCH (nominatedCompany:Company { name: nomineeCompanyParam.name })
							WHERE
								(
									nomineeCompanyParam.differentiator IS NULL AND
									nominatedCompany.differentiator IS NULL
								) OR
								nomineeCompanyParam.differentiator = nominatedCompany.differentiator

						OPTIONAL MATCH (nominatedCompany)<-[nominatedCompanyRel:HAS_NOMINEE]-(category)
							WHERE
								nomination.position IS NULL OR
								nomination.position = nominatedCompanyRel.nominationPosition

						OPTIONAL MATCH (existingPerson:Person { name: nominatedMemberParam.name })
							WHERE
								(
									nominatedMemberParam.differentiator IS NULL AND
									existingPerson.differentiator IS NULL
								) OR
								nominatedMemberParam.differentiator = existingPerson.differentiator

						FOREACH (item IN CASE WHEN SIZE(nomineeCompanyParam.members) > 0
							THEN [1]
							ELSE []
						END | SET nominatedCompanyRel.nominatedMemberUuids = [])

						FOREACH (item IN CASE nominatedMemberParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (nominatedMember:Person {
								uuid: COALESCE(existingPerson.uuid, nominatedMemberParam.uuid),
								name: nominatedMemberParam.name
							})
								ON CREATE SET nominatedMember.differentiator = nominatedMemberParam.differentiator

							CREATE (category)-
								[:HAS_NOMINEE {
									nominationPosition: nomination.position,
									memberPosition: nominatedMemberParam.position,
									nominatedCompanyUuid: nominatedCompany.uuid
								}]->(nominatedMember)

							SET nominatedCompanyRel.nominatedMemberUuids =
								nominatedCompanyRel.nominatedMemberUuids + nominatedMember.uuid
						)

				WITH DISTINCT ceremony, category, nomination

				UNWIND
					(CASE nomination.productions WHEN []
						THEN [null]
						ELSE nomination.productions
					END) AS nomineeProductionParam

					OPTIONAL MATCH (existingNomineeProduction:Production { uuid: nomineeProductionParam.uuid })

					FOREACH (item IN CASE existingNomineeProduction WHEN NULL THEN [] ELSE [1] END |
						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								productionPosition: nomineeProductionParam.position,
								isWinner: nomination.isWinner
							}]->(existingNomineeProduction)
					)

		WITH DISTINCT ceremony

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getEditQuery = () => `
	MATCH (ceremony:AwardCeremony { uuid: $uuid })

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (ceremony)-[categoryRel:PRESENTS_CATEGORY]->(category:AwardCeremonyCategory)

	OPTIONAL MATCH (category)-[nomineeRel:HAS_NOMINEE]->(nominee)
		WHERE
			(nominee:Person AND nomineeRel.nominatedCompanyUuid IS NULL) OR
			nominee:Company OR
			nominee:Production

	WITH ceremony, award, categoryRel, category, nomineeRel,
		COLLECT(nominee {
			model: TOUPPER(HEAD(LABELS(nominee))),
			.uuid,
			.name,
			.differentiator,
			nominatedMemberUuids: nomineeRel.nominatedMemberUuids
		}) AS nominees

	UNWIND (CASE nominees WHEN [] THEN [null] ELSE nominees END) AS nominee

		UNWIND (COALESCE(nominee.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nomineeRel.nominationPosition IS NULL OR
					nomineeRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH ceremony, award, categoryRel, category, nomineeRel, nominee, nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH ceremony, award, categoryRel, category, nomineeRel, nominee,
				COLLECT(nominatedMember { .name, .differentiator }) + [{}] AS nominatedMembers

	WITH ceremony, award, categoryRel, category, nomineeRel, nominee, nominatedMembers
		ORDER BY nomineeRel.nominationPosition, nomineeRel.entityPosition, nomineeRel.productionPosition

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel.nominationPosition AS nominationPosition,
		nomineeRel.isWinner AS isWinner,
		[nominee IN COLLECT(
			CASE nominee WHEN NULL
				THEN null
				ELSE nominee { .model, .uuid, .name, .differentiator, members: nominatedMembers }
			END
		) | CASE nominee.model
			WHEN 'COMPANY' THEN nominee { .model, .name, .differentiator, .members }
			WHEN 'PERSON' THEN nominee { .model, .name, .differentiator }
			WHEN 'PRODUCTION' THEN nominee { .model, .uuid }
		END] + [{}] AS nominees

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		isWinner,
		[nominee IN nominees WHERE nominee.model = 'PERSON' OR nominee.model = 'COMPANY'] + [{}] AS nomineeEntities,
		[nominee IN nominees WHERE nominee.model = 'PRODUCTION'] + [{ uuid: '' }] AS nomineeProductions

	WITH ceremony, award, categoryRel, category,
		COLLECT(
			CASE WHEN SIZE(nomineeEntities) = 1 AND SIZE(nomineeProductions) = 1
				THEN null
				ELSE { isWinner: COALESCE(isWinner, false), entities: nomineeEntities, productions: nomineeProductions }
			END
		) + [{ entities: [{}], productions: [{ uuid: '' }] }] AS nominations
		ORDER BY categoryRel.position

	RETURN
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		{ name: COALESCE(award.name, ''), differentiator: COALESCE(award.differentiator, '') } AS award,
		COLLECT(
			CASE category WHEN NULL
				THEN null
				ELSE category { .name, nominations }
			END
		) + [{ nominations: [{ entities: [{}], productions: [{ uuid: '' }] }] }] AS categories
`;

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

const getShowQuery = () => `
	MATCH (ceremony:AwardCeremony { uuid: $uuid })

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (ceremony)-[categoryRel:PRESENTS_CATEGORY]->(category:AwardCeremonyCategory)

	OPTIONAL MATCH (category)-[nomineeRel:HAS_NOMINEE]->(nominee)
		WHERE
			(nominee:Person AND nomineeRel.nominatedCompanyUuid IS NULL) OR
			nominee:Company OR
			nominee:Production

	OPTIONAL MATCH (nominee)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH ceremony, award, categoryRel, category, nomineeRel,
		COLLECT(nominee {
			model: TOUPPER(HEAD(LABELS(nominee))),
			.uuid,
			.name,
			.startDate,
			.endDate,
			nominatedMemberUuids: nomineeRel.nominatedMemberUuids,
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
			END
		}) AS nominees

	UNWIND (CASE nominees WHEN [] THEN [null] ELSE nominees END) AS nominee

		UNWIND (COALESCE(nominee.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nomineeRel.nominationPosition IS NULL OR
					nomineeRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH ceremony, award, categoryRel, category, nomineeRel, nominee, nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH ceremony, award, categoryRel, category, nomineeRel, nominee,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH ceremony, award, categoryRel, category, nomineeRel, nominee, nominatedMembers
		ORDER BY nomineeRel.nominationPosition, nomineeRel.entityPosition, nomineeRel.productionPosition

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		nomineeRel.nominationPosition AS nominationPosition,
		nomineeRel.isWinner AS isWinner,
		[nominee IN COLLECT(
			CASE nominee WHEN NULL
				THEN null
				ELSE nominee { .model, .uuid, .name, members: nominatedMembers, .startDate, .endDate, .venue }
			END
		) | CASE nominee.model
			WHEN 'COMPANY' THEN nominee { .model, .uuid, .name, .members }
			WHEN 'PERSON' THEN nominee { .model, .uuid, .name }
			WHEN 'PRODUCTION' THEN nominee { .model, .uuid, .name, .startDate, .endDate, .venue }
		END] AS nominees

	WITH
		ceremony,
		award,
		categoryRel,
		category,
		isWinner,
		[nominee IN nominees WHERE nominee.model = 'PERSON' OR nominee.model = 'COMPANY'] AS nomineeEntities,
		[nominee IN nominees WHERE nominee.model = 'PRODUCTION'] AS nomineeProductions

	WITH ceremony, award, categoryRel, category,
		COLLECT(
			CASE WHEN SIZE(nomineeEntities) = 0 AND SIZE(nomineeProductions) = 0
				THEN null
				ELSE {
					model: 'NOMINATION',
					isWinner: COALESCE(isWinner, false),
					entities: nomineeEntities,
					productions: nomineeProductions
				}
			END
		) AS nominations
		ORDER BY categoryRel.position

	RETURN
		'AWARD_CEREMONY' AS model,
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		CASE award WHEN NULL THEN null ELSE award { model: 'AWARD', .uuid, .name } END AS award,
		COLLECT(
			CASE category WHEN NULL
				THEN null
				ELSE category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }
			END
		) AS categories
`;

const getListQuery = () => `
	MATCH (ceremony:AwardCeremony)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	RETURN
		'AWARD_CEREMONY' AS model,
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		CASE award WHEN NULL THEN null ELSE award { model: 'AWARD', .uuid, .name } END AS award

	ORDER BY ceremony.name DESC, award.name

	LIMIT 100
`;

export {
	getAwardContextualDuplicateRecordCountQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
