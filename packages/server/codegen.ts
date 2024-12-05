/* eslint-disable n/no-sync */
import { readFileSync, writeFileSync } from 'node:fs';
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: './src/modules/**/typedefs/graphql.ts',
	generates: {
		'./src/modules/': {
			preset: 'graphql-modules',
			config: {
				useIndexSignature: true,
				useTypeImports: true,
			},
			presetConfig: {
				baseTypesPath: '../generated/graphql.types.ts',
				filename: 'generated/module-types.graphql.ts',
			},
			plugins: [
				{
					add: {
						content: `/* eslint-disable @typescript-eslint/no-namespace */`,
					},
				},
				'typescript',
				'typescript-operations',
				'typescript-resolvers',
			],
			hooks: {
				afterOneFileWrite: [
					(filePath: string) => {
						// console.log('source', args);

						if (filePath.includes('module-types.graphql.ts')) {
							const content = readFileSync(filePath, 'utf8');
							const newContent = content.replaceAll(
								'generated/graphql.types',
								'generated/graphql.types.js',
							);

							writeFileSync(filePath, newContent);
						}
					},
				],
			},
		},
	},
};
export default config;
