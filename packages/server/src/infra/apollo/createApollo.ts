import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createContext } from '../../common/context/createContext.js';
import ApolloServerSentryPlugin from '../../common/plugins/apolloServerSentry.js';
import PerformancePlugin from '../../common/plugins/performancePlugin.js';
import type { AppContext } from '../../common/types/appContext.js';
import { CONFIG } from '../../config.js';
import { createToken, registerToken } from '../container/createToken.js';
import { resolveToken } from '../container/resolveToken.js';
import type { Provider } from '../container/types.js';
import { ExpressToken } from '../express/createExpress.js';
import Logger from '../logger/index.js';

const logger = Logger.getInstance().createChildren('Apollo');

export const ApolloToken = createToken<ApolloServer<AppContext>>('Apollo');

export async function createApollo(): Promise<Provider<typeof ApolloToken>> {
	const app = resolveToken(ExpressToken);

	logger.info('Creating executable schema');

	const schema = makeExecutableSchema({
		typeDefs: /* GraphQL */ `
			type Query {
				_hello: String!
			}
		`,
		resolvers: {
			Query: {
				_hello: () => 'Hello, world!',
			},
		},
	});

	logger.info('Creating Apollo Server');

	const server = new ApolloServer<AppContext>({
		introspection: CONFIG.ENVIRONMENT.IS_DEVELOPMENT,
		includeStacktraceInErrorResponses: CONFIG.ENVIRONMENT.IS_DEVELOPMENT,
		schema,
		plugins: [ApolloServerSentryPlugin(), PerformancePlugin()],
	});

	logger.info('Adding /graphql endpoint to express app');

	await server.start();

	app.use(
		'/graphql',
		expressMiddleware<AppContext>(server, {
			context: createContext,
		}),
	);

	registerToken(ApolloToken, server);

	logger.success('Apollo server created');

	return server;
}
