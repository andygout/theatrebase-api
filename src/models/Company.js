import Entity from './Entity.js';
import { MODELS } from '../utils/constants.js';

export default class Company extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.COMPANY;

	}

}
