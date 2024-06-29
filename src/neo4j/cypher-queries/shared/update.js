import { getEditQuery } from './index.js';
import { MODEL_TO_NODE_LABEL_MAP } from '../../../utils/constants.js';

export default model => `
	MATCH (n:${MODEL_TO_NODE_LABEL_MAP[model]} { uuid: $uuid })
		SET
			n.name = $name,
			n.differentiator = $differentiator

	WITH n

	${getEditQuery(model)}
`;
