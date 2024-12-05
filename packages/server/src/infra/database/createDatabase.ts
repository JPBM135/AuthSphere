import knex, { type Knex } from 'knex';
import { assertConfig } from '../../common/assertConfig/assertConfig.js';
import { CONFIG } from '../../config.js';
import { createToken, registerToken } from '../container/createToken.js';
import type { Provider } from '../container/types.js';
import Logger from '../logger/index.js';

const logger = Logger.getInstance().createChildren('Database');

export const DatabaseToken = createToken<Knex>('Database');

export async function createDatabase(): Promise<Provider<typeof DatabaseToken>> {
	assertConfig(CONFIG.DATABASE.HOST, 'DATABASE.HOST');
	assertConfig(CONFIG.DATABASE.USER, 'DATABASE.USER');
	assertConfig(CONFIG.DATABASE.PASSWORD, 'DATABASE.PASSWORD');
	assertConfig(CONFIG.DATABASE.NAME, 'DATABASE.NAME');
	assertConfig(CONFIG.DATABASE.PORT, 'DATABASE.PORT');

	logger.info('Creating database connection');

	const database = knex({
		client: 'pg',
		connection: {
			host: CONFIG.DATABASE.HOST,
			user: CONFIG.DATABASE.USER,
			password: CONFIG.DATABASE.PASSWORD,
			database: CONFIG.DATABASE.NAME,
			port: Number(CONFIG.DATABASE.PORT),
		},
		log: {
			error: (...args) => logger.error('Knex error:', ...args),
			warn: (...args) => logger.warn('Knex warning:', ...args),
			debug: (...args) => logger.debug('Knex debug:', ...args),
		},
	});

	logger.debug('Setting database timezone to UTC');

	await database.raw(/* sql*/ 'SET TIME ZONE "UTC"');

	registerToken(DatabaseToken, database);

	logger.success('Database connection established');

	return database;
}
