import { getDuplicateRoleIndices } from '../lib/get-duplicate-indices.js';
import Person from './Person.js';
import { Role } from './index.js';

export default class CastMember extends Person {

	constructor (props = {}) {

		super(props);

		const { roles } = props;

		this.roles = roles
			? roles.map(role => new Role(role))
			: [];

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateDifferentiator();

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		this.validateNamePresenceIfNamedChildren(this.roles);

		const duplicateRoleIndices = getDuplicateRoleIndices(this.roles);

		this.roles.forEach((role, index) => {

			role.validateName({ isRequired: false });

			role.validateCharacterName();

			role.validateCharacterDifferentiator();

			role.validateQualifier();

			role.validateRoleNameCharacterNameDisparity();

			role.validateUniquenessInGroup({ isDuplicate: duplicateRoleIndices.includes(index) });

		});

	}

}
