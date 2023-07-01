import { getEditQuery } from '.';
import { ACTIONS } from '../../../utils/constants';

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: 'CREATE (venue:Venue { uuid: $uuid, name: $name, differentiator: $differentiator })',
		[ACTIONS.UPDATE]: `
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

			FOREACH (item IN CASE WHEN subVenueParam IS NULL THEN [] ELSE [1] END |
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

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export {
	getCreateQuery,
	getUpdateQuery
};
