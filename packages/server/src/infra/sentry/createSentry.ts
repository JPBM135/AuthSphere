import process from 'node:process';
import * as Sentry from '@sentry/node';
import { CONFIG } from '../../config.js';
import { createToken, registerToken } from '../container/createToken.js';
import type { Provider } from '../container/types.js';
import Logger from '../logger/index.js';

const logger = Logger.getInstance().createChildren('Sentry');

export const SentryToken = createToken<typeof Sentry>('Sentry');

export function createSentry(): Provider<typeof SentryToken> {
	logger.info('Creating Sentry');

	Sentry.init({
		dsn: CONFIG.SENTRY.DSN ?? undefined,
		enabled: CONFIG.ENVIRONMENT.IS_PRODUCTION,
		environment: CONFIG.NODE_ENV,
		ignoreErrors: [/You must be signed in to view this resource/],
		debug: process.argv.includes('--debug'),
		integrations: [
			Sentry.httpIntegration(),
			Sentry.graphqlIntegration(),
			Sentry.onUncaughtExceptionIntegration(),
			Sentry.expressIntegration(),
			Sentry.knexIntegration(),
		],
		tracesSampleRate: CONFIG.SENTRY.REPLAY_AND_SAMPLE_RATE,
		profilesSampleRate: CONFIG.SENTRY.REPLAY_AND_SAMPLE_RATE,
		onFatalError(error) {
			logger.error('Fatal error', error);
		},
	});

	logger.success('Sentry created');

	registerToken(SentryToken, Sentry);

	return Sentry;
}
