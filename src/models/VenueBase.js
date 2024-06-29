import Entity from './Entity.js';
import { MODELS } from '../utils/constants.js';

export default class VenueBase extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.VENUE;

	}

}
