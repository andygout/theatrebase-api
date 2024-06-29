import { MODEL_TO_NODE_LABEL_MAP } from '../../../utils/constants.js';

export default model => `
	MATCH (n:${MODEL_TO_NODE_LABEL_MAP[model]})

	RETURN
		'${model}' AS model,
		n.uuid AS uuid,
		n.name AS name

	ORDER BY
		n.name

	LIMIT 1000
`;
