import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import ApolloServerSentryPlugin from '../../common/plugins/apolloServerSentry.js';
import type { AppContext } from '../../common/types/appContext.js';
import { CONFIG } from '../../config.js';
import { schemaDefinition } from '../../modules/schema.js';
import { createToken, registerToken } from '../container/createToken.js';
import type { Provider } from '../container/types.js';
import Logger from '../logger/index.js';

const logger = Logger.getInstance().createChildren('Apollo');

export const ApolloToken = createToken<ApolloServer<AppContext>>('Apollo');

export async function createApollo(): Promise<Provider<typeof ApolloToken>> {
	logger.info('Creating executable schema');

	const schema = makeExecutableSchema(schemaDefinition);

	logger.info('Creating Apollo Server');

	const server = new ApolloServer<AppContext>({
		introspection: CONFIG.ENVIRONMENT.IS_DEVELOPMENT,
		includeStacktraceInErrorResponses: CONFIG.ENVIRONMENT.IS_DEVELOPMENT,
		schema,
		logger: {
			debug: (...args) => logger.debug('Apollo Server debug:', ...args),
			error: (...args) => logger.error('Apollo Server error:', ...args),
			info: (...args) => logger.info('Apollo Server info:', ...args),
			warn: (...args) => logger.warn('Apollo Server warn:', ...args),
		},
		plugins: [ApolloServerSentryPlugin()],
	});

	await server.start();

	registerToken(ApolloToken, server);

	logger.success('Apollo server created');

	return server;
}
