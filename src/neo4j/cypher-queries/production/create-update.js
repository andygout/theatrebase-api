import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (production:Production {
				uuid: $uuid,
				name: $name,
				subtitle: $subtitle,
				startDate: $startDate,
				pressDate: $pressDate,
				endDate: $endDate
			})
		`,
		[ACTIONS.UPDATE]: `
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
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH production

		OPTIONAL MATCH (existingMaterial:Material { name: $material.name })
			WHERE
				($material.differentiator IS NULL AND existingMaterial.differentiator IS NULL) OR
				$material.differentiator = existingMaterial.differentiator

		FOREACH (item IN CASE WHEN $material.name IS NULL THEN [] ELSE [1] END |
			MERGE (material:Material {
				uuid: COALESCE(existingMaterial.uuid, $material.uuid),
				name: $material.name
			})
				ON CREATE SET material.differentiator = $material.differentiator

			CREATE (production)-[:PRODUCTION_OF]->(material)
		)

		WITH production

		OPTIONAL MATCH (existingVenue:Venue { name: $venue.name })
			WHERE
				($venue.differentiator IS NULL AND existingVenue.differentiator IS NULL) OR
				$venue.differentiator = existingVenue.differentiator

		FOREACH (item IN CASE WHEN $venue.name IS NULL THEN [] ELSE [1] END |
			MERGE (venue:Venue {
				uuid: COALESCE(existingVenue.uuid, $venue.uuid),
				name: $venue.name
			})
				ON CREATE SET venue.differentiator = $venue.differentiator

			CREATE (production)-[:PLAYS_AT]->(venue)
		)

		WITH production

		OPTIONAL MATCH (existingSeason:Season { name: $season.name })
			WHERE
				($season.differentiator IS NULL AND existingSeason.differentiator IS NULL) OR
				$season.differentiator = existingSeason.differentiator

		FOREACH (item IN CASE WHEN $season.name IS NULL THEN [] ELSE [1] END |
			MERGE (season:Season {
				uuid: COALESCE(existingSeason.uuid, $season.uuid),
				name: $season.name
			})
				ON CREATE SET season.differentiator = $season.differentiator

			CREATE (production)-[:PART_OF_SEASON]->(season)
		)

		WITH production

		OPTIONAL MATCH (existingFestival:Festival { name: $festival.name })
			WHERE
				($festival.differentiator IS NULL AND existingFestival.differentiator IS NULL) OR
				$festival.differentiator = existingFestival.differentiator

		FOREACH (item IN CASE WHEN $festival.name IS NULL THEN [] ELSE [1] END |
			MERGE (festival:Festival {
				uuid: COALESCE(existingFestival.uuid, $festival.uuid),
				name: $festival.name
			})
				ON CREATE SET festival.differentiator = $festival.differentiator

			CREATE (production)-[:PART_OF_FESTIVAL]->(festival)
		)

		WITH DISTINCT production

			UNWIND (CASE $subProductions WHEN [] THEN [null] ELSE $subProductions END) AS subProductionParam

				OPTIONAL MATCH (existingSubProduction:Production { uuid: subProductionParam.uuid })

				FOREACH (item IN CASE WHEN existingSubProduction IS NULL THEN [] ELSE [1] END |
					CREATE (production)-[:HAS_SUB_PRODUCTION { position: subProductionParam.position }]->
						(existingSubProduction)
				)

		WITH DISTINCT production

		UNWIND (CASE $producerCredits WHEN [] THEN [{ entities: [] }] ELSE $producerCredits END) AS producerCredit

			UNWIND
				CASE SIZE([entity IN producerCredit.entities WHERE entity.model = 'PERSON']) WHEN 0
					THEN [null]
					ELSE [entity IN producerCredit.entities WHERE entity.model = 'PERSON']
				END AS producerPersonParam

				OPTIONAL MATCH (existingProducerPerson:Person { name: producerPersonParam.name })
					WHERE
						(
							producerPersonParam.differentiator IS NULL AND
							existingProducerPerson.differentiator IS NULL
						) OR
						producerPersonParam.differentiator = existingProducerPerson.differentiator

				FOREACH (item IN CASE WHEN producerPersonParam IS NULL THEN [] ELSE [1] END |
					MERGE (producerPerson:Person {
						uuid: COALESCE(existingProducerPerson.uuid, producerPersonParam.uuid),
						name: producerPersonParam.name
					})
						ON CREATE SET producerPerson.differentiator = producerPersonParam.differentiator

					CREATE (production)-
						[:HAS_PRODUCER_ENTITY {
							creditPosition: producerCredit.position,
							entityPosition: producerPersonParam.position,
							credit: producerCredit.name
						}]->(producerPerson)
				)

			WITH DISTINCT production, producerCredit

			UNWIND
				CASE SIZE([entity IN producerCredit.entities WHERE entity.model = 'COMPANY']) WHEN 0
					THEN [null]
					ELSE [entity IN producerCredit.entities WHERE entity.model = 'COMPANY']
				END AS producerCompanyParam

				OPTIONAL MATCH (existingProducerCompany:Company { name: producerCompanyParam.name })
					WHERE
						(
							producerCompanyParam.differentiator IS NULL AND
							existingProducerCompany.differentiator IS NULL
						) OR
						producerCompanyParam.differentiator = existingProducerCompany.differentiator

				FOREACH (item IN CASE WHEN producerCompanyParam IS NULL THEN [] ELSE [1] END |
					MERGE (producerCompany:Company {
						uuid: COALESCE(existingProducerCompany.uuid, producerCompanyParam.uuid),
						name: producerCompanyParam.name
					})
						ON CREATE SET producerCompany.differentiator = producerCompanyParam.differentiator

					CREATE (production)-
						[:HAS_PRODUCER_ENTITY {
							creditPosition: producerCredit.position,
							entityPosition: producerCompanyParam.position,
							credit: producerCredit.name
						}]->(producerCompany)
				)

				WITH production, producerCredit, producerCompanyParam

				UNWIND
					CASE WHEN producerCompanyParam IS NOT NULL AND SIZE(producerCompanyParam.members) > 0
						THEN producerCompanyParam.members
						ELSE [null]
					END AS creditedMemberParam

					OPTIONAL MATCH (creditedCompany:Company { name: producerCompanyParam.name })
						WHERE
							(producerCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
							producerCompanyParam.differentiator = creditedCompany.differentiator

					OPTIONAL MATCH (creditedCompany)<-[producerCompanyRel:HAS_PRODUCER_ENTITY]-(production)
						WHERE
							producerCredit.position IS NULL OR
							producerCredit.position = producerCompanyRel.creditPosition

					OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
						WHERE
							(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
							creditedMemberParam.differentiator = existingPerson.differentiator

					FOREACH (item IN CASE WHEN SIZE(producerCompanyParam.members) > 0 THEN [1] ELSE [] END |
						SET producerCompanyRel.creditedMemberUuids = []
					)

					FOREACH (item IN CASE WHEN creditedMemberParam IS NULL THEN [] ELSE [1] END |
						MERGE (creditedMember:Person {
							uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
							name: creditedMemberParam.name
						})
							ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

						CREATE (production)-
							[:HAS_PRODUCER_ENTITY {
								creditPosition: producerCredit.position,
								memberPosition: creditedMemberParam.position,
								creditedCompanyUuid: creditedCompany.uuid
							}]->(creditedMember)

						SET producerCompanyRel.creditedMemberUuids =
							producerCompanyRel.creditedMemberUuids + creditedMember.uuid
					)

		WITH DISTINCT production

		UNWIND (CASE $cast WHEN [] THEN [null] ELSE $cast END) AS castMemberParam

			OPTIONAL MATCH (existingPerson:Person { name: castMemberParam.name })
				WHERE
					(castMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
					castMemberParam.differentiator = existingPerson.differentiator

			FOREACH (item IN CASE WHEN castMemberParam IS NULL THEN [] ELSE [1] END |
				MERGE (castMember:Person {
					uuid: COALESCE(existingPerson.uuid, castMemberParam.uuid),
					name: castMemberParam.name
				})
					ON CREATE SET castMember.differentiator = castMemberParam.differentiator

				FOREACH (role IN CASE castMemberParam.roles WHEN [] THEN [{}] ELSE castMemberParam.roles END |
					CREATE (production)
						-[:HAS_CAST_MEMBER {
							castMemberPosition: castMemberParam.position,
							rolePosition: role.position,
							roleName: role.name,
							characterName: role.characterName,
							characterDifferentiator: role.characterDifferentiator,
							qualifier: role.qualifier,
							isAlternate: role.isAlternate
						}]->(castMember)
				)
			)

		WITH DISTINCT production

		UNWIND (CASE $creativeCredits WHEN [] THEN [{ entities: [] }] ELSE $creativeCredits END) AS creativeCredit

			UNWIND
				CASE SIZE([entity IN creativeCredit.entities WHERE entity.model = 'PERSON']) WHEN 0
					THEN [null]
					ELSE [entity IN creativeCredit.entities WHERE entity.model = 'PERSON']
				END AS creativePersonParam

				OPTIONAL MATCH (existingCreativePerson:Person { name: creativePersonParam.name })
					WHERE
						(
							creativePersonParam.differentiator IS NULL AND
							existingCreativePerson.differentiator IS NULL
						) OR
						creativePersonParam.differentiator = existingCreativePerson.differentiator

				FOREACH (item IN CASE WHEN creativePersonParam IS NULL THEN [] ELSE [1] END |
					MERGE (creativePerson:Person {
						uuid: COALESCE(existingCreativePerson.uuid, creativePersonParam.uuid),
						name: creativePersonParam.name
					})
						ON CREATE SET creativePerson.differentiator = creativePersonParam.differentiator

					CREATE (production)-
						[:HAS_CREATIVE_ENTITY {
							creditPosition: creativeCredit.position,
							entityPosition: creativePersonParam.position,
							credit: creativeCredit.name
						}]->(creativePerson)
				)

			WITH DISTINCT production, creativeCredit

			UNWIND
				CASE SIZE([entity IN creativeCredit.entities WHERE entity.model = 'COMPANY']) WHEN 0
					THEN [null]
					ELSE [entity IN creativeCredit.entities WHERE entity.model = 'COMPANY']
				END AS creativeCompanyParam

				OPTIONAL MATCH (existingCreativeCompany:Company { name: creativeCompanyParam.name })
					WHERE
						(
							creativeCompanyParam.differentiator IS NULL AND
							existingCreativeCompany.differentiator IS NULL
						) OR
						creativeCompanyParam.differentiator = existingCreativeCompany.differentiator

				FOREACH (item IN CASE WHEN creativeCompanyParam IS NULL THEN [] ELSE [1] END |
					MERGE (creativeCompany:Company {
						uuid: COALESCE(existingCreativeCompany.uuid, creativeCompanyParam.uuid),
						name: creativeCompanyParam.name
					})
						ON CREATE SET creativeCompany.differentiator = creativeCompanyParam.differentiator

					CREATE (production)-
						[:HAS_CREATIVE_ENTITY {
							creditPosition: creativeCredit.position,
							entityPosition: creativeCompanyParam.position,
							credit: creativeCredit.name
						}]->(creativeCompany)
				)

				WITH production, creativeCredit, creativeCompanyParam

				UNWIND
					CASE WHEN creativeCompanyParam IS NOT NULL AND SIZE(creativeCompanyParam.members) > 0
						THEN creativeCompanyParam.members
						ELSE [null]
					END AS creditedMemberParam

					OPTIONAL MATCH (creditedCompany:Company { name: creativeCompanyParam.name })
						WHERE
							(creativeCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
							creativeCompanyParam.differentiator = creditedCompany.differentiator

					OPTIONAL MATCH (creditedCompany)<-[creativeCompanyRel:HAS_CREATIVE_ENTITY]-(production)
						WHERE
							creativeCredit.position IS NULL OR
							creativeCredit.position = creativeCompanyRel.creditPosition

					OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
						WHERE
							(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
							creditedMemberParam.differentiator = existingPerson.differentiator

					FOREACH (item IN CASE WHEN SIZE(creativeCompanyParam.members) > 0 THEN [1] ELSE [] END |
						SET creativeCompanyRel.creditedMemberUuids = []
					)

					FOREACH (item IN CASE WHEN creditedMemberParam IS NULL THEN [] ELSE [1] END |
						MERGE (creditedMember:Person {
							uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
							name: creditedMemberParam.name
						})
							ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

						CREATE (production)-
							[:HAS_CREATIVE_ENTITY {
								creditPosition: creativeCredit.position,
								memberPosition: creditedMemberParam.position,
								creditedCompanyUuid: creditedCompany.uuid
							}]->(creditedMember)

						SET creativeCompanyRel.creditedMemberUuids =
							creativeCompanyRel.creditedMemberUuids + creditedMember.uuid
					)

		WITH DISTINCT production

		UNWIND (CASE $crewCredits WHEN [] THEN [{ entities: [] }] ELSE $crewCredits END) AS crewCredit

			UNWIND
				CASE SIZE([entity IN crewCredit.entities WHERE entity.model = 'PERSON']) WHEN 0
					THEN [null]
					ELSE [entity IN crewCredit.entities WHERE entity.model = 'PERSON']
				END AS crewPersonParam

				OPTIONAL MATCH (existingCrewPerson:Person { name: crewPersonParam.name })
					WHERE
						(
							crewPersonParam.differentiator IS NULL AND
							existingCrewPerson.differentiator IS NULL
						) OR
						crewPersonParam.differentiator = existingCrewPerson.differentiator

				FOREACH (item IN CASE WHEN crewPersonParam IS NULL THEN [] ELSE [1] END |
					MERGE (crewPerson:Person {
						uuid: COALESCE(existingCrewPerson.uuid, crewPersonParam.uuid),
						name: crewPersonParam.name
					})
						ON CREATE SET crewPerson.differentiator = crewPersonParam.differentiator

					CREATE (production)-
						[:HAS_CREW_ENTITY {
							creditPosition: crewCredit.position,
							entityPosition: crewPersonParam.position,
							credit: crewCredit.name
						}]->(crewPerson)
				)

			WITH DISTINCT production, crewCredit

			UNWIND
				CASE SIZE([entity IN crewCredit.entities WHERE entity.model = 'COMPANY']) WHEN 0
					THEN [null]
					ELSE [entity IN crewCredit.entities WHERE entity.model = 'COMPANY']
				END AS crewCompanyParam

				OPTIONAL MATCH (existingCrewCompany:Company { name: crewCompanyParam.name })
					WHERE
						(
							crewCompanyParam.differentiator IS NULL AND
							existingCrewCompany.differentiator IS NULL
						) OR
						crewCompanyParam.differentiator = existingCrewCompany.differentiator

				FOREACH (item IN CASE WHEN crewCompanyParam IS NULL THEN [] ELSE [1] END |
					MERGE (crewCompany:Company {
						uuid: COALESCE(existingCrewCompany.uuid, crewCompanyParam.uuid),
						name: crewCompanyParam.name
					})
						ON CREATE SET crewCompany.differentiator = crewCompanyParam.differentiator

					CREATE (production)-
						[:HAS_CREW_ENTITY {
							creditPosition: crewCredit.position,
							entityPosition: crewCompanyParam.position,
							credit: crewCredit.name
						}]->(crewCompany)
				)

				WITH production, crewCredit, crewCompanyParam

				UNWIND
					CASE WHEN crewCompanyParam IS NOT NULL AND SIZE(crewCompanyParam.members) > 0
						THEN crewCompanyParam.members
						ELSE [null]
					END AS creditedMemberParam

					OPTIONAL MATCH (creditedCompany:Company { name: crewCompanyParam.name })
						WHERE
							(crewCompanyParam.differentiator IS NULL AND creditedCompany.differentiator IS NULL) OR
							crewCompanyParam.differentiator = creditedCompany.differentiator

					OPTIONAL MATCH (creditedCompany)<-[crewCompanyRel:HAS_CREW_ENTITY]-(production)
						WHERE
							crewCredit.position IS NULL OR
							crewCredit.position = crewCompanyRel.creditPosition

					OPTIONAL MATCH (existingPerson:Person { name: creditedMemberParam.name })
						WHERE
							(creditedMemberParam.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
							creditedMemberParam.differentiator = existingPerson.differentiator

					FOREACH (item IN CASE WHEN SIZE(crewCompanyParam.members) > 0 THEN [1] ELSE [] END |
						SET crewCompanyRel.creditedMemberUuids = []
					)

					FOREACH (item IN CASE WHEN creditedMemberParam IS NULL THEN [] ELSE [1] END |
						MERGE (creditedMember:Person {
							uuid: COALESCE(existingPerson.uuid, creditedMemberParam.uuid),
							name: creditedMemberParam.name
						})
							ON CREATE SET creditedMember.differentiator = creditedMemberParam.differentiator

						CREATE (production)-
							[:HAS_CREW_ENTITY {
								creditPosition: crewCredit.position,
								memberPosition: creditedMemberParam.position,
								creditedCompanyUuid: creditedCompany.uuid
							}]->(creditedMember)

						SET crewCompanyRel.creditedMemberUuids =
							crewCompanyRel.creditedMemberUuids + creditedMember.uuid
					)

		WITH DISTINCT production

		UNWIND (CASE $reviews WHEN [] THEN [null] ELSE $reviews END) AS reviewParam

			OPTIONAL MATCH (existingCompany:Company { name: reviewParam.publication.name })
				WHERE
					(reviewParam.publication.differentiator IS NULL AND existingCompany.differentiator IS NULL) OR
					reviewParam.publication.differentiator = existingCompany.differentiator

			OPTIONAL MATCH (existingPerson:Person { name: reviewParam.critic.name })
				WHERE
					(reviewParam.critic.differentiator IS NULL AND existingPerson.differentiator IS NULL) OR
					reviewParam.critic.differentiator = existingPerson.differentiator

			FOREACH (item IN CASE WHEN reviewParam IS NULL THEN [] ELSE [1] END |
				MERGE (publication:Company {
					uuid: COALESCE(existingCompany.uuid, reviewParam.publication.uuid),
					name: reviewParam.publication.name
				})
					ON CREATE SET publication.differentiator = reviewParam.publication.differentiator

				CREATE (production)-
					[:HAS_REVIEWER {
						position: reviewParam.position,
						criticPersonUuid: COALESCE(existingPerson.uuid, reviewParam.critic.uuid),
						url: reviewParam.url,
						date: reviewParam.date
					}]->(publication)

				MERGE (critic:Person {
					uuid: COALESCE(existingPerson.uuid, reviewParam.critic.uuid),
					name: reviewParam.critic.name
				})
					ON CREATE SET critic.differentiator = reviewParam.critic.differentiator

				CREATE (production)-
					[:HAS_REVIEWER {
						position: reviewParam.position,
						publicationCompanyUuid: COALESCE(existingCompany.uuid, reviewParam.publication.uuid)
					}]->(critic)
			)

		WITH DISTINCT production

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export {
	getCreateQuery,
	getUpdateQuery
};
