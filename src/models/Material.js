import { getDuplicateBaseInstanceIndices, getDuplicateNameIndices } from '../lib/get-duplicate-indices.js';
import { isValidYear } from '../lib/is-valid-year.js';
import { getTrimmedOrEmptyString } from '../lib/strings.js';
import MaterialBase from './MaterialBase.js';
import { CharacterGroup, OriginalVersionMaterial, SubMaterial, WritingCredit } from './index.js';

export default class Material extends MaterialBase {

	constructor (props = {}) {

		super(props);

		const {
			subtitle,
			format,
			year,
			originalVersionMaterial,
			writingCredits,
			subMaterials,
			characterGroups
		} = props;

		this.subtitle = getTrimmedOrEmptyString(subtitle);

		this.format = getTrimmedOrEmptyString(format);

		this.year = parseInt(year) || getTrimmedOrEmptyString(year);

		this.originalVersionMaterial = new OriginalVersionMaterial(originalVersionMaterial);

		this.writingCredits = writingCredits
			? writingCredits.map(writingCredit => new WritingCredit(writingCredit))
			: [];

		this.subMaterials = subMaterials
			? subMaterials.map(subMaterial => new SubMaterial(subMaterial))
			: [];

		this.characterGroups = characterGroups
			? characterGroups.map(characterGroup => new CharacterGroup(characterGroup))
			: [];

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.validateSubtitle();

		this.validateFormat({ isRequired: false });

		this.validateYear({ isRequired: false });

		this.originalVersionMaterial.validateName({ isRequired: false });

		this.originalVersionMaterial.validateDifferentiator();

		this.originalVersionMaterial.validateNoAssociationWithSelf(
			{ name: this.name, differentiator: this.differentiator }
		);

		const duplicateWritingCreditIndices = getDuplicateNameIndices(this.writingCredits);

		this.writingCredits.forEach((writingCredit, index) =>
			writingCredit.runInputValidations({
				isDuplicate: duplicateWritingCreditIndices.includes(index),
				subject: { name: this.name, differentiator: this.differentiator }
			})
		);

		const duplicateSubMaterialIndices = getDuplicateBaseInstanceIndices(this.subMaterials);

		this.subMaterials.forEach((subMaterial, index) => {

			subMaterial.validateName({ isRequired: false });

			subMaterial.validateDifferentiator();

			subMaterial.validateNoAssociationWithSelf({ name: this.name, differentiator: this.differentiator });

			subMaterial.validateUniquenessInGroup({ isDuplicate: duplicateSubMaterialIndices.includes(index) });

		});

		this.characterGroups.forEach(characterGroup => characterGroup.runInputValidations());

	}

	validateFormat (opts) {

		this.validateStringForProperty('format', { isRequired: opts.isRequired });

	}

	validateYear () {

		if (Boolean(this.year) && !isValidYear(this.year))
			this.addPropertyError('year', 'Value must be a valid year');

	}

	async runDatabaseValidations () {

		await this.validateUniquenessInDatabase();

		await this.originalVersionMaterial.runDatabaseValidations({ subjectMaterialUuid: this.uuid });

		for (const writingCredit of this.writingCredits) {
			await writingCredit.runDatabaseValidations({ subjectMaterialUuid: this.uuid });
		}

		for (const subMaterial of this.subMaterials) {
			await subMaterial.runDatabaseValidations({ subjectMaterialUuid: this.uuid });
		}

	}

}
