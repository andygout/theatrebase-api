const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: 'CREATE (venue:Venue { uuid: $uuid, name: $name, differentiator: $differentiator })',
		update: `
			MATCH (venue:Venue { uuid: $uuid })

			OPTIONAL MATCH (venue)-[relationship:HAS_SUB_VENUE]->(:Venue)

			DELETE relationship

			WITH DISTINCT venue

			SET
				venue.name = $name,
				venue.differentiator = $differentiator
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH venue

		UNWIND (CASE $subVenues WHEN [] THEN [null] ELSE $subVenues END) AS subVenueParam

			OPTIONAL MATCH (existingVenue:Venue { name: subVenueParam.name })
				WHERE
					(subVenueParam.differentiator IS NULL AND existingVenue.differentiator IS NULL) OR
					subVenueParam.differentiator = existingVenue.differentiator

			FOREACH (item IN CASE subVenueParam WHEN NULL THEN [] ELSE [1] END |
				MERGE (subVenue:Venue {
					uuid: COALESCE(existingVenue.uuid, subVenueParam.uuid),
					name: subVenueParam.name
				})
					ON CREATE SET subVenue.differentiator = subVenueParam.differentiator

				CREATE (venue)-[:HAS_SUB_VENUE { position: subVenueParam.position }]->(subVenue)
			)

		WITH DISTINCT venue

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (venue:Venue { uuid: $uuid })

	OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(subVenue:Venue)

	WITH venue, subVenueRel, subVenue
		ORDER BY subVenueRel.position

	RETURN
		'venue' AS model,
		venue.uuid AS uuid,
		venue.name AS name,
		venue.differentiator AS differentiator,
		COLLECT(
			CASE subVenue WHEN NULL
				THEN null
				ELSE subVenue { .name, .differentiator }
			END
		) + [{}] AS subVenues
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (venue:Venue { uuid: $uuid })

	OPTIONAL MATCH (surVenue:Venue)-[:HAS_SUB_VENUE]->(venue)

	WITH venue,
		CASE surVenue WHEN NULL
			THEN null
			ELSE surVenue { model: 'venue', .uuid, .name }
		END AS surVenue

	OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(subVenue:Venue)

	WITH venue, surVenue, subVenue
		ORDER BY subVenueRel.position

	WITH venue, surVenue,
		COLLECT(
			CASE subVenue WHEN NULL
				THEN null
				ELSE subVenue { model: 'venue', .uuid, .name }
			END
		) AS subVenues

	OPTIONAL MATCH path=
		(venue)-[:HAS_SUB_VENUE*0..1]->(subVenueForProduction:Venue)<-[:PLAYS_AT]-(production:Production)

	WITH
		venue,
		surVenue,
		subVenues,
		subVenueForProduction,
		LENGTH(path) AS venueToProductionPathLength,
		production
		ORDER BY production.startDate DESC, production.name

	RETURN
		'venue' AS model,
		venue.uuid AS uuid,
		venue.name AS name,
		venue.differentiator AS differentiator,
		surVenue,
		subVenues,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE production {
					model: 'production',
					.uuid,
					.name,
					.startDate,
					.endDate,
					subVenue: CASE venueToProductionPathLength WHEN 2
						THEN subVenueForProduction { model: 'venue', .uuid, .name }
						ELSE null
					END
				}
			END
		) AS productions
`;

const getListQuery = () => `
	MATCH (venue:Venue)
		WHERE NOT (:Venue)-[:HAS_SUB_VENUE]->(venue)

	OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(subVenue:Venue)

	WITH venue, subVenue
		ORDER BY subVenueRel.position

	RETURN
		'venue' AS model,
		venue.uuid AS uuid,
		venue.name AS name,
		COLLECT(
			CASE subVenue WHEN NULL
				THEN null
				ELSE subVenue { model: 'venue', .uuid, .name }
			END
		) AS subVenues

	ORDER BY venue.name

	LIMIT 100
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
