import getShowQuery from './show.js';
import getShowProductionsQuery from './show-productions.js';

export default () => [
	getShowQuery(),
	getShowProductionsQuery()
];
