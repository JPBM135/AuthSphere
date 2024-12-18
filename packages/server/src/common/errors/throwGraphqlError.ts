import {} from '@apollo/server';
import { createGraphQLError } from '@graphql-tools/utils';

export function throwGraphqlError(message: string, code: string): never {
	throw createGraphQLError(message, { extensions: { code } });
}
