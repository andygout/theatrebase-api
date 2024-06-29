import {
	getDuplicateBaseInstanceIndices,
	getDuplicateNameIndices,
	getDuplicateUuidIndices,
	getDuplicateUrlIndices
} from '../lib/get-duplicate-indices.js';
import { isValidDate } from '../lib/is-valid-date.js';
import { getTrimmedOrEmptyString } from '../lib/strings.js';
import Entity from './Entity.js';
import {
	CastMember,
	CreativeCredit,
	CrewCredit,
	FestivalBase,
	MaterialBase,
	ProducerCredit,
	Review,
	Season,
	SubProductionIdentifier,
	VenueBase
} from './index.js';
import { MODELS } from '../utils/constants.js';

export default class Production extends Entity {

	constructor (props = {}) {

		super(props);

		const {
			subtitle,
			startDate,
			pressDate,
			endDate,
			material,
			venue,
			season,
			festival,
			subProductions,
			producerCredits,
			cast,
			creativeCredits,
			crewCredits,
			reviews
		} = props;

		this.subtitle = getTrimmedOrEmptyString(subtitle);

		this.startDate = getTrimmedOrEmptyString(startDate);

		this.pressDate = getTrimmedOrEmptyString(pressDate);

		this.endDate = getTrimmedOrEmptyString(endDate);

		this.material = new MaterialBase(material);

		this.venue = new VenueBase(venue);

		this.season = new Season(season);

		this.festival = new FestivalBase(festival);

		this.subProductions = subProductions
			? subProductions.map(subProduction => new SubProductionIdentifier(subProduction))
			: [];

		this.producerCredits = producerCredits
			? producerCredits.map(producerCredit => new ProducerCredit(producerCredit))
			: [];

		this.cast = cast
			? cast.map(castMember => new CastMember(castMember))
			: [];

		this.creativeCredits = creativeCredits
			? creativeCredits.map(creativeCredit => new CreativeCredit(creativeCredit))
			: [];

		this.crewCredits = crewCredits
			? crewCredits.map(crewCredit => new CrewCredit(crewCredit))
			: [];

		this.reviews = reviews
			? reviews.map(review => new Review(review))
			: [];

	}

	get model () {

		return MODELS.PRODUCTION;

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateSubtitle();

		this.validateDates();

		this.material.validateName({ isRequired: false });

		this.material.validateDifferentiator();

		this.venue.validateName({ isRequired: false });

		this.venue.validateDifferentiator();

		this.season.validateName({ isRequired: false });

		this.season.validateDifferentiator();

		this.festival.validateName({ isRequired: false });

		this.festival.validateDifferentiator();

		const duplicateSubProductionIdentifierIndices = getDuplicateUuidIndices(this.subProductions);

		this.subProductions.forEach((subProductionIdentifier, index) => {

			subProductionIdentifier.validateUuid();

			subProductionIdentifier.validateNoAssociationWithSelf({ uuid: this.uuid });

			subProductionIdentifier.validateUniquenessInGroup(
				{ isDuplicate: duplicateSubProductionIdentifierIndices.includes(index), properties: new Set(['uuid']) }
			);

		});

		const duplicateProducerCreditIndices = getDuplicateNameIndices(this.producerCredits);

		this.producerCredits.forEach((producerCredit, index) =>
			producerCredit.runInputValidations({ isDuplicate: duplicateProducerCreditIndices.includes(index) })
		);

		const duplicateCastMemberIndices = getDuplicateBaseInstanceIndices(this.cast);

		this.cast.forEach((castMember, index) =>
			castMember.runInputValidations({ isDuplicate: duplicateCastMemberIndices.includes(index) })
		);

		const duplicateCreativeCreditIndices = getDuplicateNameIndices(this.creativeCredits);

		this.creativeCredits.forEach((creativeCredit, index) =>
			creativeCredit.runInputValidations({ isDuplicate: duplicateCreativeCreditIndices.includes(index) })
		);

		const duplicateCrewCreditIndices = getDuplicateNameIndices(this.crewCredits);

		this.crewCredits.forEach((crewCredit, index) =>
			crewCredit.runInputValidations({ isDuplicate: duplicateCrewCreditIndices.includes(index) })
		);

		const duplicateReviewUrlIndices = getDuplicateUrlIndices(this.reviews);

		this.reviews.forEach((review, index) => review.runInputValidations({ isDuplicate: duplicateReviewUrlIndices.includes(index) }));

	}

	validateDates () {

		const formatErrorText = 'Value must be in date format';

		const isValidStartDate = isValidDate(this.startDate);
		const isValidPressDate = isValidDate(this.pressDate);
		const isValidEndDate = isValidDate(this.endDate);

		if (Boolean(this.startDate) && !isValidStartDate) {
			this.addPropertyError('startDate', formatErrorText);
		}

		if (Boolean(this.pressDate) && !isValidPressDate) {
			this.addPropertyError('pressDate', formatErrorText);
		}

		if (Boolean(this.endDate) && !isValidEndDate) {
			this.addPropertyError('endDate', formatErrorText);
		}

		if (isValidStartDate && isValidEndDate && this.startDate > this.endDate) {

			this.addPropertyError('startDate', 'Start date must not be after end date');
			this.addPropertyError('endDate', 'End date must not be before start date');

		}

		if (isValidStartDate && isValidPressDate && this.startDate > this.pressDate) {

			this.addPropertyError('startDate', 'Start date must not be after press date');
			this.addPropertyError('pressDate', 'Press date must not be before start date');

		}

		if (isValidPressDate && isValidEndDate && this.pressDate > this.endDate) {

			this.addPropertyError('pressDate', 'Press date must not be after end date');
			this.addPropertyError('endDate', 'End date must not be before press date');

		}

	}

	async runDatabaseValidations () {

		for (const subProductionIdentifier of this.subProductions) {
			await subProductionIdentifier.runDatabaseValidations({ subjectProductionUuid: this.uuid });
		}

	}

}
