// @ts-check

import {
  angular,
  browser,
  common,
  node,
  prettier,
  rxjs,
  rxjsangular,
  typescript,
} from 'eslint-config-neon';
import merge from 'lodash.merge';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const globalConfig = [
  {
    ignores: ['.yarn/', 'node_modules/', '.git/', 'dist/', '.angular/', 'coverage/'],
  },
  ...[
    ...common,
    ...browser,
    ...node,
    ...typescript,
    ...angular,
    ...rxjs,
    ...rxjsangular,
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
  ].map((config) =>
    merge(config, {
      files: ['src/**/*.ts', 'src/**/*.spec.ts'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          project: './tsconfig.eslint.json',
          tsconfigRootDir: import.meta.dirname,
        },
      },
    }),
  ),
  ...angular.map((config) =>
    merge(config, {
      files: ['src/**/*.html'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          project: './tsconfig.eslint.json',
          tsconfigRootDir: import.meta.dirname,
        },
      },
    }),
  ),
  {
    files: ['src/**/*.html'],
    rules: {
      '@angular-eslint/template/no-call-expression': 'off',
    },
  },
];

export default globalConfig;
