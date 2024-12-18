import { resolvers } from './resolvers.js';
import { schema } from './schema/common.graphql.js';

export const CommonSchemaDefinition = {
	typeDefs: schema,
	resolvers,
};
