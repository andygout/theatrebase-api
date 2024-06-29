import { prepareAsParams } from '../lib/prepare-as-params.js';
import MaterialBase from './MaterialBase.js';
import { validationQueries } from '../neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../neo4j/query.js';

export default class SubMaterial extends MaterialBase {

	constructor (props = {}) {

		super(props);

	}

	async runDatabaseValidations ({ subjectMaterialUuid = null }) {

		if (this.name) {

			const { getSubMaterialChecksQuery } = validationQueries;

			const preparedParams = prepareAsParams(this);

			const {
				isAssignedToSurMaterial,
				isSurSurMaterial,
				isSurMaterialOfSubjectMaterial,
				isSubjectMaterialASubSubMaterial
			} = await neo4jQuery({
				query: getSubMaterialChecksQuery(),
				params: {
					name: preparedParams.name,
					differentiator: preparedParams.differentiator,
					subjectMaterialUuid
				}
			});

			if (isAssignedToSurMaterial) {
				this.addPropertyError(
					'name',
					'Material with these attributes is already assigned to another sur-material'
				);
				this.addPropertyError(
					'differentiator',
					'Material with these attributes is already assigned to another sur-material'
				);
			}

			if (isSurSurMaterial) {
				this.addPropertyError(
					'name',
					'Material with these attributes is the sur-most material of a three-tiered material collection'
				);
				this.addPropertyError(
					'differentiator',
					'Material with these attributes is the sur-most material of a three-tiered material collection'
				);
			}

			if (isSurMaterialOfSubjectMaterial) {
				this.addPropertyError(
					'name',
					'Material with these attributes is this material\'s sur-material'
				);
				this.addPropertyError(
					'differentiator',
					'Material with these attributes is this material\'s sur-material'
				);
			}

			if (isSubjectMaterialASubSubMaterial) {
				this.addPropertyError(
					'name',
					'Sub-material cannot be assigned to a three-tiered material collection'
				);
				this.addPropertyError(
					'differentiator',
					'Sub-material cannot be assigned to a three-tiered material collection'
				);
			}

		}

		return;

	}

}
