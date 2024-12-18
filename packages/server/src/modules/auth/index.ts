import { resolvers } from './resolvers.js';
import { schema } from './schema/auth.graphql.js';

export const AuthSchemaDefinition = {
	typeDefs: schema,
	resolvers,
};
