import type { Response } from 'express';
import { HttpStatusCodes } from '../response/enums/httpStatusCodes.js';
import { SendResponseBuilder } from '../response/sendResponse.js';
import type { ErrorCodes } from './errorCodes.js';

export function throwNotFoundHttpError(res: Response, code: ErrorCodes, message: string) {
	SendResponseBuilder.create(res)
		.withStatus(HttpStatusCodes.NotFound)
		.withError({ code, message })
		.send();
}

export function throwInternalErrorHttpError(res: Response, code: ErrorCodes, message: string) {
	SendResponseBuilder.create(res)
		.withStatus(HttpStatusCodes.InternalServerError)
		.withError({ code, message })
		.send();
}
