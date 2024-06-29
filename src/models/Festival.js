import FestivalBase from './FestivalBase.js';
import { FestivalSeries } from './index.js';

export default class Festival extends FestivalBase {

	constructor (props = {}) {

		super(props);

		const { festivalSeries } = props;

		this.festivalSeries = new FestivalSeries(festivalSeries);

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.festivalSeries.validateName({ isRequired: false });

		this.festivalSeries.validateDifferentiator();

	}

}
