import { getTrimmedOrEmptyString } from '../lib/strings.js';
import Entity from './Entity.js';
import { MODELS } from '../utils/constants.js';

export default class ProductionIdentifier extends Entity {

	constructor (props = {}) {

		super(props);

		this.uuid = getTrimmedOrEmptyString(props.uuid);

	}

	get model () {

		return MODELS.PRODUCTION_IDENTIFIER;

	}

	validateUuid () {

		this.validateStringForProperty('uuid', { isRequired: false });

	}

}
