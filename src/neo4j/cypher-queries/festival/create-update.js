import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (festival:Festival { uuid: $uuid, name: $name, differentiator: $differentiator })
		`,
		[ACTIONS.UPDATE]: `
			MATCH (festival:Festival { uuid: $uuid })

			OPTIONAL MATCH (festival)-[festivalSeriesRel:PART_OF_FESTIVAL_SERIES]->(:FestivalSeries)

			DELETE festivalSeriesRel

			WITH DISTINCT festival

			SET
				festival.name = $name,
				festival.differentiator = $differentiator
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH festival

		OPTIONAL MATCH (existingFestivalSeries:FestivalSeries { name: $festivalSeries.name })
			WHERE
				($festivalSeries.differentiator IS NULL AND existingFestivalSeries.differentiator IS NULL) OR
				$festivalSeries.differentiator = existingFestivalSeries.differentiator

		FOREACH (item IN CASE WHEN $festivalSeries.name IS NULL THEN [] ELSE [1] END |
			MERGE (festivalSeries:FestivalSeries {
				uuid: COALESCE(existingFestivalSeries.uuid, $festivalSeries.uuid),
				name: $festivalSeries.name
			})
				ON CREATE SET festivalSeries.differentiator = $festivalSeries.differentiator

			CREATE (festival)-[:PART_OF_FESTIVAL_SERIES]->(festivalSeries)
		)

		WITH DISTINCT festival

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export {
	getCreateQuery,
	getUpdateQuery
};
