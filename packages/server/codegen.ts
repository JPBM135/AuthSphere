import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: './src/**/schema/*.graphql.ts',
	generates: {
		'./src/generated/graphql.types.ts': {
			config: {
				useIndexSignature: true,
				useTypeImports: true,
				scalars: {
					DateTime: 'string',
				},
			},
			plugins: ['typescript', 'typescript-operations', 'typescript-resolvers'],
		},
	},
};
export default config;
