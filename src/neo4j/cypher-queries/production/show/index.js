import getShowQuery from './show.js';
import getShowAwardsQuery from './show-awards.js';

export default () => [
	getShowQuery(),
	getShowAwardsQuery()
];
