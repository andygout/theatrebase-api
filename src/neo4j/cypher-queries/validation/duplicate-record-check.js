import { MODEL_TO_NODE_LABEL_MAP } from '../../../utils/constants.js';

export default model => `
	MATCH (n:${MODEL_TO_NODE_LABEL_MAP[model]} { name: $name })
		WHERE
			(
				($differentiator IS NULL AND n.differentiator IS NULL) OR
				$differentiator = n.differentiator
			) AND
			(
				$uuid IS NULL OR
				$uuid <> n.uuid
			)

	RETURN
		TOBOOLEAN(COUNT(n)) AS isDuplicateRecord
`;
