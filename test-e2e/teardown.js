import { shutDown } from '../src/app.js';

export async function mochaGlobalTeardown () {

	shutDown();

}
