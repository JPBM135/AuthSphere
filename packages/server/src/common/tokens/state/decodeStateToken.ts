import { Buffer } from 'node:buffer';
import type { StateTokenPayload } from './createStateToken.js';

export function decodeStateToken(token: string): StateTokenPayload | null {
	const payload = token.split('.')[0];

	if (!payload) {
		return null;
	}

	try {
		return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
	} catch {
		return null;
	}
}
