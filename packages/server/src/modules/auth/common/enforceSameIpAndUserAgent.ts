import type { Request } from 'express';
import { ErrorCodes } from '../../../common/errors/errorCodes.js';
import { throwGraphqlError } from '../../../common/errors/throwGraphqlError.js';
import {
	extractIpFromRequest,
	extractUserAgentFromRequest,
} from '../../../common/utils/extractFromRequest.js';
import type { LoginsAttempts } from '../../../generated/database.types.js';

export function enforceSameIpAndUserAgent(req: Request, authAttempt: LoginsAttempts) {
	const reqIp = extractIpFromRequest(req);

	if (reqIp !== authAttempt.ip_address) {
		throwGraphqlError('Forbidden', ErrorCodes.ServerForbidden);
	}

	const reqUserAgent = extractUserAgentFromRequest(req);

	if (reqUserAgent !== authAttempt.user_agent) {
		throwGraphqlError('Forbidden', ErrorCodes.ServerForbidden);
	}
}
