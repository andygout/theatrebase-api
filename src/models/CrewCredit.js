import ProductionTeamCredit from './ProductionTeamCredit.js';
import { MODELS } from '../utils/constants.js';

export default class CrewCredit extends ProductionTeamCredit {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.CREW_CREDIT;

	}

}
