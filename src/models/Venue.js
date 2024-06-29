import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-indices.js';
import VenueBase from './VenueBase.js';
import { SubVenue } from './index.js';

export default class Venue extends VenueBase {

	constructor (props = {}) {

		super(props);

		const { subVenues } = props;

		this.subVenues = subVenues
			? subVenues.map(subVenue => new SubVenue(subVenue))
			: [];

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		const duplicateSubVenueIndices = getDuplicateBaseInstanceIndices(this.subVenues);

		this.subVenues.forEach((subVenue, index) => {

			subVenue.validateName({ isRequired: false });

			subVenue.validateDifferentiator();

			subVenue.validateNoAssociationWithSelf({ name: this.name, differentiator: this.differentiator });

			subVenue.validateUniquenessInGroup({ isDuplicate: duplicateSubVenueIndices.includes(index) });

		});

	}

	async runDatabaseValidations () {

		await this.validateUniquenessInDatabase();

		for (const subVenue of this.subVenues) {
			await subVenue.runDatabaseValidations({ subjectVenueUuid: this.uuid });
		}

	}

}
