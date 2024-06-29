import ProductionIdentifier from './ProductionIdentifier.js';
import { MODELS } from '../utils/constants.js';

export default class NominatedProductionIdentifier extends ProductionIdentifier {

	constructor (props = {}) {

		super(props);

	}

	async runDatabaseValidations () {

		if (this.uuid) {

			const isExistent = await this.confirmExistenceInDatabase({ model: MODELS.PRODUCTION });

			if (!isExistent) {
				this.addPropertyError('uuid', 'Production with this UUID does not exist');
			}

		}

		return;

	}

}
