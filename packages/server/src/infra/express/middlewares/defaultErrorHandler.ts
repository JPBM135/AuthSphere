import type { Request, Response, NextFunction } from 'express';
import { SendResponseBuilder } from '../../../common/response/sendResponse.js';
import { resolveToken } from '../../container/resolveToken.js';
import type { Logger } from '../../logger/index.js';
import { SentryToken } from '../../sentry/createSentry.js';

export function internalErrorHandler(
	logger: Logger,
): (error: Error, req: Request, res: Response, next: NextFunction) => void {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (error: Error, _: Request, res: Response, __: NextFunction) => {
		const sentry = resolveToken(SentryToken);

		sentry.captureException(error);
		logger.error('Error occurred while processing request', error);
		SendResponseBuilder.create(res).withError(error).send();
	};
}
