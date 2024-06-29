import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (material:Material {
				uuid: $uuid,
				name: $name,
				differentiator: $differentiator,
				subtitle: $subtitle,
				format: $format,
				year: $year
			})
		`,
		[ACTIONS.UPDATE]: `
			MATCH (material:Material { uuid: $uuid })

			OPTIONAL MATCH (material)-[originalVersionMaterialRel:SUBSEQUENT_VERSION_OF]->(:Material)

			DELETE originalVersionMaterialRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[writerRel:HAS_WRITING_ENTITY]->(entity:Person|Company)

			DELETE writerRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[sourceMaterialRel:USES_SOURCE_MATERIAL]->(:Material)

			DELETE sourceMaterialRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[subMaterialRel:HAS_SUB_MATERIAL]->(:Material)

			DELETE subMaterialRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[characterRel:DEPICTS]->(:Character)

			DELETE characterRel

			WITH DISTINCT material

			SET
				material.name = $name,
				material.differentiator = $differentiator,
				material.subtitle = $subtitle,
				material.format = $format,
				material.year = $year
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH material

		OPTIONAL MATCH (existingOriginalVersionMaterial:Material { name: $originalVersionMaterial.name })
			WHERE
				(
					$originalVersionMaterial.differentiator IS NULL AND
					existingOriginalVersionMaterial.differentiator IS NULL
				) OR
				$originalVersionMaterial.differentiator = existingOriginalVersionMaterial.differentiator

		FOREACH (item IN CASE WHEN $originalVersionMaterial.name IS NULL THEN [] ELSE [1] END |
			MERGE (originalVersionMaterial:Material {
				uuid: COALESCE(existingOriginalVersionMaterial.uuid, $originalVersionMaterial.uuid),
				name: $originalVersionMaterial.name
			})
				ON CREATE SET originalVersionMaterial.differentiator = $originalVersionMaterial.differentiator

			CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
		)

		WITH material

		UNWIND (CASE $writingCredits WHEN [] THEN [{ entities: [] }] ELSE $writingCredits END) AS writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'PERSON']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'PERSON']
				END AS writingPersonParam

				OPTIONAL MATCH (existingWritingPerson:Person { name: writingPersonParam.name })
					WHERE
						(writingPersonParam.differentiator IS NULL AND existingWritingPerson.differentiator IS NULL) OR
						writingPersonParam.differentiator = existingWritingPerson.differentiator

				FOREACH (item IN CASE WHEN writingPersonParam IS NULL THEN [] ELSE [1] END |
					MERGE (writingPerson:Person {
						uuid: COALESCE(existingWritingPerson.uuid, writingPersonParam.uuid),
						name: writingPersonParam.name
					})
						ON CREATE SET writingPerson.differentiator = writingPersonParam.differentiator

					CREATE (material)-
						[:HAS_WRITING_ENTITY {
							creditPosition: writingCredit.position,
							entityPosition: writingPersonParam.position,
							credit: writingCredit.name,
							creditType: writingCredit.creditType
						}]->(writingPerson)
				)

			WITH DISTINCT material, writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'COMPANY']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'COMPANY']
				END AS writingCompanyParam

				OPTIONAL MATCH (existingWritingCompany:Company { name: writingCompanyParam.name })
					WHERE
						(
							writingCompanyParam.differentiator IS NULL AND
							existingWritingCompany.differentiator IS NULL
						) OR
						writingCompanyParam.differentiator = existingWritingCompany.differentiator

				FOREACH (item IN CASE WHEN writingCompanyParam IS NULL THEN [] ELSE [1] END |
					MERGE (writingCompany:Company {
						uuid: COALESCE(existingWritingCompany.uuid, writingCompanyParam.uuid),
						name: writingCompanyParam.name
					})
						ON CREATE SET writingCompany.differentiator = writingCompanyParam.differentiator

					CREATE (material)-
						[:HAS_WRITING_ENTITY {
							creditPosition: writingCredit.position,
							entityPosition: writingCompanyParam.position,
							credit: writingCredit.name,
							creditType: writingCredit.creditType
						}]->(writingCompany)
				)

			WITH DISTINCT material, writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'MATERIAL']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'MATERIAL']
				END AS sourceMaterialParam

				OPTIONAL MATCH (existingSourceMaterial:Material { name: sourceMaterialParam.name })
					WHERE
						(
							sourceMaterialParam.differentiator IS NULL AND
							existingSourceMaterial.differentiator IS NULL
						) OR
						sourceMaterialParam.differentiator = existingSourceMaterial.differentiator

				FOREACH (item IN CASE WHEN sourceMaterialParam IS NULL THEN [] ELSE [1] END |
					MERGE (sourceMaterial:Material {
						uuid: COALESCE(existingSourceMaterial.uuid, sourceMaterialParam.uuid),
						name: sourceMaterialParam.name
					})
						ON CREATE SET sourceMaterial.differentiator = sourceMaterialParam.differentiator

					CREATE (material)-
						[:USES_SOURCE_MATERIAL {
							creditPosition: writingCredit.position,
							entityPosition: sourceMaterialParam.position,
							credit: writingCredit.name
						}]->(sourceMaterial)
				)

		WITH DISTINCT material

			UNWIND (CASE $subMaterials WHEN [] THEN [null] ELSE $subMaterials END) AS subMaterialParam

				OPTIONAL MATCH (existingSubMaterial:Material { name: subMaterialParam.name })
					WHERE
						(subMaterialParam.differentiator IS NULL AND existingSubMaterial.differentiator IS NULL) OR
						subMaterialParam.differentiator = existingSubMaterial.differentiator

				FOREACH (item IN CASE WHEN subMaterialParam IS NULL THEN [] ELSE [1] END |
					MERGE (subMaterial:Material {
						uuid: COALESCE(existingSubMaterial.uuid, subMaterialParam.uuid),
						name: subMaterialParam.name
					})
						ON CREATE SET
							subMaterial.differentiator = subMaterialParam.differentiator,
							subMaterial.format = subMaterialParam.format,
							subMaterial.year = subMaterialParam.year

					CREATE (material)-[:HAS_SUB_MATERIAL { position: subMaterialParam.position }]->(subMaterial)
				)

		WITH DISTINCT material

		UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroup

			UNWIND (CASE characterGroup.characters WHEN []
				THEN [null]
				ELSE characterGroup.characters
			END) AS characterParam

				OPTIONAL MATCH (existingCharacter:Character {
					name: COALESCE(characterParam.underlyingName, characterParam.name)
				})
					WHERE
						(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
						characterParam.differentiator = existingCharacter.differentiator

				FOREACH (item IN CASE WHEN characterParam IS NULL THEN [] ELSE [1] END |
					MERGE (character:Character {
						uuid: COALESCE(existingCharacter.uuid, characterParam.uuid),
						name: COALESCE(characterParam.underlyingName, characterParam.name)
					})
						ON CREATE SET character.differentiator = characterParam.differentiator

					CREATE (material)-
						[:DEPICTS {
							groupPosition: characterGroup.position,
							characterPosition: characterParam.position,
							displayName: CASE WHEN characterParam.underlyingName IS NULL
								THEN null
								ELSE characterParam.name
							END,
							qualifier: characterParam.qualifier,
							group: characterGroup.name
						}]->(character)
				)

		WITH DISTINCT material

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export {
	getCreateQuery,
	getUpdateQuery
};
