import ProductionTeamCredit from './ProductionTeamCredit.js';
import { MODELS } from '../utils/constants.js';

export default class CreativeCredit extends ProductionTeamCredit {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.CREATIVE_CREDIT;

	}

}
