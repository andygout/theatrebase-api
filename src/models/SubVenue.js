import { prepareAsParams } from '../lib/prepare-as-params.js';
import VenueBase from './VenueBase.js';
import { validationQueries } from '../neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../neo4j/query.js';

export default class SubVenue extends VenueBase {

	constructor (props = {}) {

		super(props);

	}

	async runDatabaseValidations ({ subjectVenueUuid = null }) {

		if (this.name) {

			const { getSubVenueChecksQuery } = validationQueries;

			const preparedParams = prepareAsParams(this);

			const {
				isAssignedToSurVenue,
				isSurVenue,
				isSubjectVenueASubVenue
			} = await neo4jQuery({
				query: getSubVenueChecksQuery(),
				params: {
					name: preparedParams.name,
					differentiator: preparedParams.differentiator,
					subjectVenueUuid
				}
			});

			if (isAssignedToSurVenue) {
				this.addPropertyError(
					'name',
					'Venue with these attributes is already assigned to another sur-venue'
				);
				this.addPropertyError(
					'differentiator',
					'Venue with these attributes is already assigned to another sur-venue'
				);
			}

			if (isSurVenue) {
				this.addPropertyError(
					'name',
					'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
				);
				this.addPropertyError(
					'differentiator',
					'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
				);
			}

			if (isSubjectVenueASubVenue) {
				this.addPropertyError(
					'name',
					'Sub-venue cannot be assigned to a two-tiered venue collection'
				);
				this.addPropertyError(
					'differentiator',
					'Sub-venue cannot be assigned to a two-tiered venue collection'
				);
			}

		}

		return;

	}

}
