import type { CamelCase } from '../../common/types/transformRecordToCamelCase.js';
import { toCamelCase } from '../../common/utils/toCamelCase.js';
import { tables } from '../../generated/database.types.js';
import { createToken, registerToken } from '../container/createToken.js';
import type { Provider } from '../container/types.js';
import Logger from '../logger/index.js';
import { Repository, type RepositoryAcceptedTables } from './Repository.js';
import { KeysRepository } from './keys/KeysRepository.js';

const logger = Logger.getInstance().createChildren('Repositories');

type RepositoriesMap = {
	[T in RepositoryAcceptedTables as `${CamelCase<T>}Repository`]: Repository<T>;
};

export const RepositoriesToken = createToken<RepositoriesMap>('Repositories');
export const KeysRepositoryToken = createToken<KeysRepository>('KeysRepository');

export function createRepositories(): Provider<typeof RepositoriesToken> {
	logger.info('Creating repositories');

	const tablesToCreate = Object.keys(tables).filter(
		(table) => !table.startsWith('knex_migrations'),
	);

	const repositories: Partial<RepositoriesMap> = {};

	for (const table of tablesToCreate) {
		const repository = new Repository(table as RepositoryAcceptedTables);
		Reflect.set(repositories, toCamelCase(table) + 'Repository', repository);
		logger.debug(`Repository created for table ${table} (${toCamelCase(table)})`);
	}

	registerToken(KeysRepositoryToken, new KeysRepository());

	registerToken(RepositoriesToken, repositories as RepositoriesMap);

	logger.success('Repositories created');

	return repositories as RepositoriesMap;
}
