import { angular, browser, common, node, prettier, typescript } from 'eslint-config-neon';
/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const globalConfig = [
	{
		ignores: [
			'.yarn/',
			'dist/',
			'node_modules/',
			'locales/',
			'!locales/en-US/',
			'src/generated/graphql.types.ts',
			'src/generated/database.types.ts',
			'src/modules/**/generated/module-types.graphql.ts',
		],
	},
	...[
		...common,
		...browser,
		...node,
		...typescript,
		...prettier,
		{
			rules: {
				'n/no-sync': 'off',
				'@typescript-eslint/prefer-nullish-coalescing': 'error',
				'no-restricted-imports': [
					'error',
					{
						name: '@apollo/client',
						message:
							'Importing Apollo Client directly is not allowed. Use the @apollo/client/core package instead.',
					},
				],
				'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
				'rxjs/no-implicit-any-catch': 'off',
				'@typescript-eslint/no-unused-vars': 'error',
				'no-restricted-globals': 'off',
				'unicorn/prefer-node-protocol': 'off',
			},
		},
	].map((config) => ({
		...config,
		files: [
			...(config.files ?? []),
			'src/**/*.ts',
			'seeds/**/*.ts',
			'migrations/**/*.ts',
			'codegen.ts',
		],
		languageOptions: {
			...config.languageOptions,
			parserOptions: {
				...config.languageOptions?.parserOptions,
				project: 'tsconfig.eslint.json',
			},
		},
	})),
];

export default globalConfig;
