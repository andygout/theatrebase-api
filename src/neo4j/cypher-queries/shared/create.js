import { getEditQuery } from './index.js';
import { MODEL_TO_NODE_LABEL_MAP } from '../../../utils/constants.js';

export default model => `
	CREATE (n:${MODEL_TO_NODE_LABEL_MAP[model]} { uuid: $uuid, name: $name, differentiator: $differentiator })

	WITH n

	${getEditQuery(model)}
`;
