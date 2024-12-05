import type * as Sentry from '@sentry/node';

export interface AppContext {
	sentrySpan: Sentry.Span;
	token: string;
}
