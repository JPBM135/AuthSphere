import { type IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { AuthSchemaDefinition } from './auth/index.js';
import { CommonSchemaDefinition } from './common/index.js';

export const schemaDefinition: IExecutableSchemaDefinition = {
	typeDefs: [AuthSchemaDefinition.typeDefs, CommonSchemaDefinition.typeDefs],
	resolvers: {
		...CommonSchemaDefinition.resolvers,
		...AuthSchemaDefinition.resolvers,
	},
};
