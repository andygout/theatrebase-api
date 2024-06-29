import getShowQuery from './show.js';
import getShowAwardsQuery from './show-awards.js';
import getShowAwardsForSubsequentVersionMaterialsQuery from './show-awards-for-subsequent-version-materials.js';
import getShowAwardsForSourcingMaterialsQuery from './show-awards-for-sourcing-materials.js';
import getShowMaterialsQuery from './show-materials.js';
import getShowProductionsQuery from './show-productions.js';

export default () => [
	getShowQuery(),
	getShowAwardsQuery(),
	getShowAwardsForSubsequentVersionMaterialsQuery(),
	getShowAwardsForSourcingMaterialsQuery(),
	getShowMaterialsQuery(),
	getShowProductionsQuery()
];
