import type * as Sentry from '@sentry/node';
import type { Request, Response } from 'express';

export interface AppContext {
	authUser: any;
	req: Request;
	res: Response;
	sentrySpan: Sentry.Span;
	token: string;
}
