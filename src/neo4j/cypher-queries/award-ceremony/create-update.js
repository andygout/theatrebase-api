import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

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

		FOREACH (item IN CASE WHEN $award.name IS NULL THEN [] ELSE [1] END |
			MERGE (award:Award {
				uuid: COALESCE(existingAward.uuid, $award.uuid),
				name: $award.name
			})
				ON CREATE SET award.differentiator = $award.differentiator

			CREATE (ceremony)<-[:PRESENTED_AT]-(award)
		)

		WITH DISTINCT ceremony

		UNWIND (CASE $categories WHEN [] THEN [{ nominations: [] }] ELSE $categories END) AS categoryParam

			FOREACH (item IN CASE WHEN categoryParam.name IS NULL THEN [] ELSE [1] END |
				CREATE (:AwardCeremonyCategory { name: categoryParam.name })
					<-[:PRESENTS_CATEGORY { position: categoryParam.position }]-(ceremony)
			)

			WITH ceremony, categoryParam

			OPTIONAL MATCH (category:AwardCeremonyCategory { name: categoryParam.name })
				<-[:PRESENTS_CATEGORY]-(ceremony)

			UNWIND (CASE categoryParam.nominations WHEN []
				THEN [{ entities: [], productions: [], materials: [] }]
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

					FOREACH (item IN CASE WHEN nomineePersonParam IS NULL THEN [] ELSE [1] END |
						MERGE (nomineePerson:Person {
							uuid: COALESCE(existingNomineePerson.uuid, nomineePersonParam.uuid),
							name: nomineePersonParam.name
						})
							ON CREATE SET nomineePerson.differentiator = nomineePersonParam.differentiator

						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								entityPosition: nomineePersonParam.position,
								isWinner: nomination.isWinner,
								customType: nomination.customType
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

					FOREACH (item IN CASE WHEN nomineeCompanyParam IS NULL THEN [] ELSE [1] END |
						MERGE (nomineeCompany:Company {
							uuid: COALESCE(existingNomineeCompany.uuid, nomineeCompanyParam.uuid),
							name: nomineeCompanyParam.name
						})
							ON CREATE SET nomineeCompany.differentiator = nomineeCompanyParam.differentiator

						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								entityPosition: nomineeCompanyParam.position,
								isWinner: nomination.isWinner,
								customType: nomination.customType
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

						FOREACH (item IN CASE WHEN nominatedMemberParam IS NULL THEN [] ELSE [1] END |
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

					FOREACH (item IN CASE WHEN existingNomineeProduction IS NULL THEN [] ELSE [1] END |
						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								productionPosition: nomineeProductionParam.position,
								isWinner: nomination.isWinner,
								customType: nomination.customType
							}]->(existingNomineeProduction)
					)

				WITH DISTINCT ceremony, category, nomination

				UNWIND
					(CASE nomination.materials WHEN []
						THEN [null]
						ELSE nomination.materials
					END) AS nomineeMaterialParam

					OPTIONAL MATCH (existingNomineeMaterial:Material { name: nomineeMaterialParam.name })
						WHERE
							(
								nomineeMaterialParam.differentiator IS NULL AND
								existingNomineeMaterial.differentiator IS NULL
							) OR
							nomineeMaterialParam.differentiator = existingNomineeMaterial.differentiator

					FOREACH (item IN CASE WHEN nomineeMaterialParam IS NULL THEN [] ELSE [1] END |
						MERGE (nomineeMaterial:Material {
							uuid: COALESCE(existingNomineeMaterial.uuid, nomineeMaterialParam.uuid),
							name: nomineeMaterialParam.name
						})
							ON CREATE SET nomineeMaterial.differentiator = nomineeMaterialParam.differentiator

						CREATE (category)-
							[:HAS_NOMINEE {
								nominationPosition: nomination.position,
								materialPosition: nomineeMaterialParam.position,
								isWinner: nomination.isWinner,
								customType: nomination.customType
							}]->(nomineeMaterial)
					)

		WITH DISTINCT ceremony

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export {
	getCreateQuery,
	getUpdateQuery
};
