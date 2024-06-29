import ProductionIdentifier from './ProductionIdentifier.js';
import { validationQueries } from '../neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../neo4j/query.js';

export default class SubProductionIdentifier extends ProductionIdentifier {

	constructor (props = {}) {

		super(props);

	}

	async runDatabaseValidations ({ subjectProductionUuid = null }) {

		if (this.uuid) {

			const { getSubProductionChecksQuery } = validationQueries;

			const {
				isExistent,
				isAssignedToSurProduction,
				isSurSurProduction,
				isSurProductionOfSubjectProduction,
				isSubjectProductionASubSubProduction
			} = await neo4jQuery({
				query: getSubProductionChecksQuery(),
				params: { uuid: this.uuid, subjectProductionUuid }
			});

			if (!isExistent) {
				this.addPropertyError('uuid', 'Production with this UUID does not exist');
			}

			if (isAssignedToSurProduction) {
				this.addPropertyError(
					'uuid',
					'Production with this UUID is already assigned to another sur-production'
				);
			}

			if (isSurSurProduction) {
				this.addPropertyError(
					'uuid',
					'Production with this UUID is the sur-most production of a three-tiered production collection'
				);
			}

			if (isSurProductionOfSubjectProduction) {
				this.addPropertyError('uuid', 'Production with this UUID is this production\'s sur-production');
			}

			if (isSubjectProductionASubSubProduction) {
				this.addPropertyError(
					'uuid',
					'Sub-production cannot be assigned to a three-tiered production collection'
				);
			}

		}

		return;

	}

}
