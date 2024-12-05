import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { resolveToken } from '../../infra/container/resolveToken.js';
import { SentryToken } from '../../infra/sentry/createSentry.js';
import type { AppContext } from '../types/appContext.js';

export async function createContext(context: ExpressContextFunctionArgument): Promise<AppContext> {
	const sentry = resolveToken(SentryToken);

	return {
		token: context.req.headers.token as string,
		sentrySpan: sentry.startInactiveSpan({
			op: 'graphql',
			name: 'graphql',
		}),
	};
}
