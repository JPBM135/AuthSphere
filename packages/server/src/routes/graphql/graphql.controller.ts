import { expressMiddleware } from '@apollo/server/express4';
import type { IRouter } from 'express';
import { createContext } from '../../common/context/createContext.js';
import type { AppContext } from '../../common/types/appContext.js';
import { ApolloToken } from '../../infra/apollo/createApollo.js';
import { resolveToken } from '../../infra/container/resolveToken.js';

export function registerGraphqlRoutes(router: IRouter) {
	const apollo = resolveToken(ApolloToken);

	router.use(
		'/graphql',
		expressMiddleware<AppContext>(apollo, {
			context: createContext,
		}),
	);
}
