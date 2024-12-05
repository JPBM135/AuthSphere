import process from 'node:process';
import { ApolloToken } from '../../infra/apollo/createApollo.js';
import { resolveToken } from '../../infra/container/resolveToken.js';
import { DatabaseToken } from '../../infra/database/createDatabase.js';
import { SentryToken } from '../../infra/sentry/createSentry.js';

export async function handleProcessDestroy(): Promise<void> {
	const [apollo, database, sentry] = [
		resolveToken(ApolloToken),
		resolveToken(DatabaseToken),
		resolveToken(SentryToken),
	];

	await apollo.stop();
	await database.destroy();
	await sentry.close();

	process.exit(0);
}
