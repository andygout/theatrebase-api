import { isEntityInArray } from '../lib/get-duplicate-entity-info.js';
import Company from './Company.js';
import { Person } from './index.js';

export default class CompanyWithMembers extends Company {

	constructor (props = {}) {

		super(props);

		const { members } = props;

		this.members = members
			? members.map(member => new Person(member))
			: [];

	}

	runInputValidations (opts) {

		this.validateNamePresenceIfNamedChildren(this.members);

		this.members.forEach(member => {

			member.validateName({ isRequired: false });

			member.validateDifferentiator();

			member.validateUniquenessInGroup({ isDuplicate: isEntityInArray(member, opts.duplicateEntities) });

		});

	}

}
