import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-indices.js';
import { prepareAsParams } from '../lib/prepare-as-params.js';
import Entity from './Entity.js';
import { Award, AwardCeremonyCategory } from './index.js';
import { validationQueries } from '../neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../neo4j/query.js';
import { MODELS } from '../utils/constants.js';

export default class AwardCeremony extends Entity {

	constructor (props = {}) {

		super(props);

		const { award, categories } = props;

		this.award = new Award(award);

		this.categories = categories
			? categories.map(category => new AwardCeremonyCategory(category))
			: [];

	}

	get model () {

		return MODELS.AWARD_CEREMONY;

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.award.validateName({ isRequired: false });

		this.award.validateDifferentiator();

		const duplicateCategoryIndices = getDuplicateBaseInstanceIndices(this.categories);

		this.categories.forEach((category, index) =>
			category.runInputValidations({ isDuplicate: duplicateCategoryIndices.includes(index) })
		);

	}

	async runDatabaseValidations () {

		await this.validateAwardContextualUniquenessInDatabase();

		for (const category of this.categories) await category.runDatabaseValidations();

	}

	async validateAwardContextualUniquenessInDatabase () {

		const { getAwardContextualDuplicateRecordCheckQuery } = validationQueries;

		const preparedParams = prepareAsParams(this);

		const { isDuplicateRecord } = await neo4jQuery({
			query: getAwardContextualDuplicateRecordCheckQuery(),
			params: {
				uuid: preparedParams.uuid,
				name: preparedParams.name,
				award: {
					name: preparedParams.award.name,
					differentiator: preparedParams.award.differentiator
				}
			}
		});

		if (isDuplicateRecord) {

			const uniquenessErrorMessage = 'Award ceremony already exists for given award';

			this.addPropertyError('name', uniquenessErrorMessage);

			this.award.addPropertyError('name', uniquenessErrorMessage);

			this.award.addPropertyError('differentiator', uniquenessErrorMessage);

		}

	}

}
