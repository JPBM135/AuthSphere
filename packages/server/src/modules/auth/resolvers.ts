import type { AuthSphereResolverMap } from '../interfaces.js';
import { nextStepAuth } from './mutations/nextStepAuth.js';
import { startAuth } from './mutations/startAuth.js';

export const resolvers: AuthSphereResolverMap<null, 'nextStepAuth' | 'startAuth', null> = {
	Mutation: {
		startAuth,
		nextStepAuth,
	},
};
