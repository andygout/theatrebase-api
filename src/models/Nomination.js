import { getDuplicateEntities, isEntityInArray } from '../lib/get-duplicate-entity-info.js';
import { getDuplicateBaseInstanceIndices, getDuplicateUuidIndices } from '../lib/get-duplicate-indices.js';
import { getTrimmedOrEmptyString } from '../lib/strings.js';
import Base from './Base.js';
import { CompanyWithMembers, MaterialBase, NominatedProductionIdentifier, Person } from './index.js';
import { MODELS } from '../utils/constants.js';

export default class Nomination extends Base {

	constructor (props = {}) {

		super(props);

		const { isWinner, customType, entities, productions, materials } = props;

		this.isWinner = Boolean(isWinner);

		this.customType = getTrimmedOrEmptyString(customType);

		this.entities = entities
			? entities.map(entity => {
				switch (entity.model) {
					case MODELS.COMPANY:
						return new CompanyWithMembers(entity);
					default:
						return new Person(entity);
				}
			})
			: [];

		this.productions = productions
			? productions.map(production => new NominatedProductionIdentifier(production))
			: [];

		this.materials = materials
			? materials.map(material => new MaterialBase(material))
			: [];

	}

	get model () {

		return MODELS.NOMINATION;

	}

	runInputValidations () {

		this.validateCustomType({ isRequired: false });

		const duplicateEntities = getDuplicateEntities(this.entities);

		this.entities.forEach(entity => {

			entity.validateName({ isRequired: false });

			entity.validateDifferentiator();

			entity.validateUniquenessInGroup({ isDuplicate: isEntityInArray(entity, duplicateEntities) });

			if (entity.model === MODELS.COMPANY) entity.runInputValidations({ duplicateEntities });

		});

		const duplicateProductionIdentifierIndices = getDuplicateUuidIndices(this.productions);

		this.productions.forEach((nominatedProductionIdentifier, index) => {

			nominatedProductionIdentifier.validateUuid();

			nominatedProductionIdentifier.validateUniquenessInGroup(
				{ isDuplicate: duplicateProductionIdentifierIndices.includes(index), properties: new Set(['uuid']) }
			);

		});

		const duplicateMaterialIndices = getDuplicateBaseInstanceIndices(this.materials);

		this.materials.forEach((material, index) => {

			material.validateName({ isRequired: false });

			material.validateDifferentiator();

			material.validateUniquenessInGroup({ isDuplicate: duplicateMaterialIndices.includes(index) });

		});

	}

	validateCustomType (opts) {

		this.validateStringForProperty('customType', { isRequired: opts.isRequired });

	}

	async runDatabaseValidations () {

		for (const nominatedProductionIdentifier of this.productions) {
			await nominatedProductionIdentifier.runDatabaseValidations();
		}

	}

}
