import process from 'process';

const env = process.env.NODE_ENV || 'development';

/**
 * @type { Record<string, import("knex").Knex.Config> }
 */
export const development = {
	default: {
		client: 'postgresql',
		connection: {
			host: '127.0.0.1',
			database: 'authsphere',
			user: 'postgres',
			password: 'test',
			port: 4_433,
		},
		pool: {
			min: 1,
			max: 2,
		},
		migrations: {
			tableName: 'knex_migrations',
			loadExtensions: ['.mjs'],
			stub: 'bin/templates/migration-template.mjs',
		},
		seeds: {
			directory: './dist-seeds',
		},
	},
	secure: {
		client: 'postgresql',
		connection: {
			host: '127.0.0.1',
			database: 'authsphere_keys',
			user: 'postgres',
			password: 'test',
			port: 4_433,
		},
		pool: {
			min: 1,
			max: 2,
		},
		migrations: {
			tableName: 'knex_migrations',
			loadExtensions: ['.mjs'],
			stub: 'bin/templates/migration-template.mjs',
			directory: './migrations-keys',
		},
		seeds: {
			directory: './dist-seeds',
		},
	},
};

export const production = {};

export default { development, production }[env] ??
	new Error(`No configuration found for environment: ${env}`);
