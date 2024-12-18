import type { HttpStatusCodes } from '../response/enums/httpStatusCodes.js';
import type { SendResponseError } from '../response/sendResponse.js';
import type { ErrorCodes } from './errorCodes.js';

export class HttpError extends Error implements SendResponseError {
	public code!: ErrorCodes;

	public status!: HttpStatusCodes;

	public constructor(message: string, code: ErrorCodes, status: HttpStatusCodes) {
		super(message);

		this.code = code;
		this.status = status;
	}
}
