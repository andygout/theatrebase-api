import getShowQuery from './show.js';
import getShowAwardsQuery from './show-awards.js';
import getShowAwardsForSubsequentVersionMaterialsQuery from './show-awards-for-subsequent-version-materials.js';
import getShowAwardsForSourcingMaterialsQuery from './show-awards-for-sourcing-materials.js';
import getShowAwardsForRightsGrantorMaterialsQuery from './show-awards-for-rights-grantor-materials.js';
import getShowMaterialsQuery from './show-materials.js';
import getShowProductionsOfMaterialsQuery from './show-productions-of-materials.js';
import getShowProductionsQuery from './show-productions.js';

export default () => [
	getShowQuery(),
	getShowAwardsQuery(),
	getShowAwardsForSubsequentVersionMaterialsQuery(),
	getShowAwardsForSourcingMaterialsQuery(),
	getShowAwardsForRightsGrantorMaterialsQuery(),
	getShowMaterialsQuery(),
	getShowProductionsOfMaterialsQuery(),
	getShowProductionsQuery()
];
