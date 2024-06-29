import { getDuplicateEntityIndices } from '../lib/get-duplicate-indices.js';
import Base from './Base.js';
import { Company, Person, SourceMaterial } from './index.js';
import { CREDIT_TYPES, MODELS } from '../utils/constants.js';

export default class WritingCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { creditType, entities } = props;

		this.creditType = CREDIT_TYPES[creditType] || null;

		this.entities = entities
			? entities.map(entity => {
				switch (entity.model) {
					case MODELS.COMPANY:
						return new Company(entity);
					case MODELS.MATERIAL:
						return new SourceMaterial(entity);
					default:
						return new Person(entity);
				}
			})
			: [];

	}

	get model () {

		return MODELS.WRITING_CREDIT;

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		const duplicateWritingEntityIndices = getDuplicateEntityIndices(this.entities);

		this.entities.forEach((entity, index) => {

			entity.validateName({ isRequired: false });

			entity.validateDifferentiator();

			entity.validateUniquenessInGroup({ isDuplicate: duplicateWritingEntityIndices.includes(index) });

			if (entity.model === MODELS.MATERIAL) {

				entity.validateNoAssociationWithSelf(
					{ name: opts.subject.name, differentiator: opts.subject.differentiator }
				);

			}

		});

	}

	async runDatabaseValidations ({ subjectMaterialUuid = null }) {

		for (const entity of this.entities) {

			if (entity.model === MODELS.MATERIAL) {

				await entity.runDatabaseValidations({ subjectMaterialUuid });

			}

		}

	}

}
