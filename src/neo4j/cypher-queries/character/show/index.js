import getShowQuery from './show.js';
import getShowMaterialsQuery from './show-materials.js';
import getShowProductionsQuery from './show-productions.js';

export default () => [
	getShowQuery(),
	getShowMaterialsQuery(),
	getShowProductionsQuery()
];
