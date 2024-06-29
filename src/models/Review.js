import { isValidDate } from '../lib/is-valid-date.js';
import { getTrimmedOrEmptyString } from '../lib/strings.js';
import Base from './Base.js';
import { Company, Person } from './index.js';
import { MODELS } from '../utils/constants.js';

export default class Review extends Base {

	constructor (props = {}) {

		super(props);

		const { url, date, publication, critic } = props;

		this.url = getTrimmedOrEmptyString(url);

		this.date = getTrimmedOrEmptyString(date);

		this.publication = new Company(publication);

		this.critic = new Person(critic);

	}

	get model () {

		return MODELS.REVIEW;

	}

	runInputValidations (opts) {

		this.validateUrl({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate, properties: new Set(['url']) });

		this.validateUrlPresenceIfNamedChildren([this.publication, this.critic]);

		this.validateDate();

		this.publication.validateName({ isRequired: Boolean(this.url) });

		this.publication.validateDifferentiator();

		this.critic.validateName({ isRequired: Boolean(this.url) });

		this.critic.validateDifferentiator();

	}

	validateUrl (opts) {

		this.validateStringForProperty('url', { isRequired: opts.isRequired });

		try {

			new URL(this.url);

		} catch {

			const isStringWithLength = Boolean(this.url);

			if (isStringWithLength) this.addPropertyError('url', 'URL must be a valid URL');

		}

	}

	validateUrlPresenceIfNamedChildren (children) {

		this.validatePropertyPresenceIfNamedChildren('url', children);

	}

	validateDate () {

		if (Boolean(this.date) && !isValidDate(this.date))
			this.addPropertyError('date', 'Value must be in date format');

	}

}
