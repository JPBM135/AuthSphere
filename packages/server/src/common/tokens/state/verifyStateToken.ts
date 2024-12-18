import { Buffer } from 'node:buffer';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { TimeSpan } from '../../timespan/TimeSpan.js';
import type { StateTokenAudience } from './createStateToken.js';
import { decodeStateToken } from './decodeStateToken.js';

export function verifyStateToken(token: string, hash: string, aud: StateTokenAudience): boolean {
	const [payload, secret] = token.split('.');

	if (!payload || !secret) {
		return false;
	}

	const calculatedHash = createHmac('sha256', secret).update(token).digest('base64url');

	if (!timingSafeEqual(Buffer.from(hash, 'base64url'), Buffer.from(calculatedHash, 'base64url'))) {
		return false;
	}

	const decodedPayload = decodeStateToken(token);

	if (!decodedPayload) {
		return false;
	}

	if (decodedPayload.aud !== aud) {
		return false;
	}

	return TimeSpan.fromSeconds(decodedPayload.exp as number).isFuture();
}
