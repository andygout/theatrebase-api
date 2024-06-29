import { MODEL_TO_NODE_LABEL_MAP } from '../../../utils/constants.js';

export default model => {

	const label = MODEL_TO_NODE_LABEL_MAP[model];

	return `
		MATCH (:${label} { uuid: $uuid })

		OPTIONAL MATCH (deletableInstance:${label} { uuid: $uuid })
			WHERE NOT (deletableInstance)-[]-()

		OPTIONAL MATCH (undeletableInstance:${label} { uuid: $uuid })
			-[]-(undeleteableInstanceAssociate)

		UNWIND
			CASE WHEN undeleteableInstanceAssociate IS NULL
				THEN [null]
				ELSE LABELS(undeleteableInstanceAssociate)
			END AS associateLabel

			WITH
				DISTINCT(associateLabel) AS distinctAssociateLabel,
				undeletableInstance,
				deletableInstance
				ORDER BY distinctAssociateLabel

			WITH
				undeletableInstance,
				deletableInstance,
				deletableInstance IS NOT NULL AS isDeleted,
				deletableInstance.name AS deletableInstanceName,
				deletableInstance.differentiator AS deletableInstancedifferentiator,
				COLLECT(distinctAssociateLabel) AS associatedModels

			DETACH DELETE deletableInstance

		RETURN
			CASE WHEN isDeleted
				THEN deletableInstanceName
				ELSE undeletableInstance.name
			END AS name,
			CASE WHEN isDeleted
				THEN deletableInstancedifferentiator
				ELSE undeletableInstance.differentiator
			END AS differentiator,
			isDeleted,
			associatedModels
	`;

};
