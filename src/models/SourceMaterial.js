import { prepareAsParams } from '../lib/prepare-as-params.js';
import MaterialBase from './MaterialBase.js';
import { validationQueries } from '../neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../neo4j/query.js';

export default class SourceMaterial extends MaterialBase {

	constructor (props = {}) {

		super(props);

	}

	async runDatabaseValidations ({ subjectMaterialUuid = null }) {

		if (this.name) {

			const { getSourceMaterialChecksQuery } = validationQueries;

			const preparedParams = prepareAsParams(this);

			const {
				isSourcingMaterialOfSubjectMaterial
			} = await neo4jQuery({
				query: getSourceMaterialChecksQuery(),
				params: {
					name: preparedParams.name,
					differentiator: preparedParams.differentiator,
					subjectMaterialUuid
				}
			});

			if (isSourcingMaterialOfSubjectMaterial) {
				this.addPropertyError(
					'name',
					'Material with these attributes is this material\'s sourcing material'
				);
				this.addPropertyError(
					'differentiator',
					'Material with these attributes is this material\'s sourcing material'
				);
			}

		}

		return;

	}

}
