import '../../common/types/knex.js';
import knex, { type Knex } from 'knex';
import { assertConfig } from '../../common/assert/assertConfig.js';
import { CONFIG } from '../../config.js';
import { createToken, registerToken } from '../container/createToken.js';
import type { Provider } from '../container/types.js';
import Logger from '../logger/index.js';

const logger = Logger.getInstance().createChildren('Database');

export const DatabaseToken = createToken<Knex>('Database');
export const SecureDatabaseToken = createToken<Knex>('SecureDatabase');

export async function createDatabase(): Promise<Provider<typeof DatabaseToken>> {
	assertConfig(CONFIG.DATABASE.DEFAULT.HOST, 'DATABASE.DEFAULT.HOST');
	assertConfig(CONFIG.DATABASE.DEFAULT.USER, 'DATABASE.DEFAULT.USER');
	assertConfig(CONFIG.DATABASE.DEFAULT.PASSWORD, 'DATABASE.DEFAULT.PASSWORD');
	assertConfig(CONFIG.DATABASE.DEFAULT.NAME, 'DATABASE.DEFAULT.NAME');
	assertConfig(CONFIG.DATABASE.DEFAULT.PORT, 'DATABASE.DEFAULT.PORT');
	assertConfig(CONFIG.DATABASE.SECURE.HOST, 'DATABASE.SECURE.HOST');
	assertConfig(CONFIG.DATABASE.SECURE.USER, 'DATABASE.SECURE.USER');
	assertConfig(CONFIG.DATABASE.SECURE.PASSWORD, 'DATABASE.SECURE.PASSWORD');
	assertConfig(CONFIG.DATABASE.SECURE.NAME, 'DATABASE.SECURE.NAME');
	assertConfig(CONFIG.DATABASE.SECURE.PORT, 'DATABASE.SECURE.PORT');

	logger.info('Creating database connection');

	const database = knex({
		client: 'pg',
		connection: {
			host: CONFIG.DATABASE.DEFAULT.HOST,
			user: CONFIG.DATABASE.DEFAULT.USER,
			password: CONFIG.DATABASE.DEFAULT.PASSWORD,
			database: CONFIG.DATABASE.DEFAULT.NAME,
			port: Number(CONFIG.DATABASE.DEFAULT.PORT),
		},
		log: {
			error: (...args) => logger.error('Knex error:', ...args),
			warn: (...args) => logger.warn('Knex warning:', ...args),
			debug: (...args) => logger.debug('Knex debug:', ...args),
		},
	});

	const secureDatabase = knex({
		client: 'pg',
		connection: {
			host: CONFIG.DATABASE.SECURE.HOST,
			user: CONFIG.DATABASE.SECURE.USER,
			password: CONFIG.DATABASE.SECURE.PASSWORD,
			database: CONFIG.DATABASE.SECURE.NAME,
			port: Number(CONFIG.DATABASE.SECURE.PORT),
		},
		log: {
			error: (...args) => logger.error('Knex error:', ...args),
			warn: (...args) => logger.warn('Knex warning:', ...args),
			debug: (...args) => logger.debug('Knex debug:', ...args),
		},
	});

	logger.debug('Setting database timezone to UTC');

	await database.raw(/* sql*/ 'SET TIME ZONE "UTC"');
	await secureDatabase.raw(/* sql*/ 'SET TIME ZONE "UTC"');

	registerToken(DatabaseToken, database);
	registerToken(SecureDatabaseToken, secureDatabase);

	logger.success('Database connection established');

	return database;
}
