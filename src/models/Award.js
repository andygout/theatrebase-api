import Entity from './Entity.js';
import { MODELS } from '../utils/constants.js';

export default class Award extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.AWARD;

	}

}
