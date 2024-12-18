import { Buffer } from 'node:buffer';
import { createHmac, randomBytes } from 'node:crypto';
import { CONFIG } from '../../../config.js';
import type { JwtClaims } from '../../../routes/well-known/enums.js';
import { TimeSpan } from '../../timespan/TimeSpan.js';
import type { JwtPayload } from '../types.js';

export type StateTokenPayload = JwtPayload<
	JwtClaims.Aud | JwtClaims.Exp | JwtClaims.Iat | JwtClaims.Jti
>;

export enum StateTokenAudience {
	Auth = 'auth',
	OAuthAuthorize = 'oauth_authorize',
}

export interface StateTokenResult {
	hash: string;
	token: string;
}

const EXPIRATION_BASED_ON_AUDIENCE: Record<StateTokenAudience, TimeSpan> = {
	[StateTokenAudience.Auth]: CONFIG.TOKEN.STATE.EXPIRATION,
	[StateTokenAudience.OAuthAuthorize]: CONFIG.TOKEN.STATE.EXPIRATION_OAUTH_AUTHORIZATION,
};

export function generateState(id: string, aud: StateTokenAudience): StateTokenResult {
	const payload: StateTokenPayload = {
		jti: id,
		iat: TimeSpan.fromNow().seconds(),
		aud,
		exp: TimeSpan.fromNow().add(EXPIRATION_BASED_ON_AUDIENCE[aud]).seconds(),
	};

	const secret = randomBytes(CONFIG.TOKEN.STATE.KEY_LENGTH).toString('base64url');

	const token = [Buffer.from(JSON.stringify(payload)).toString('base64url'), secret].join('.');
	const hash = createHmac('sha256', secret).update(token).digest('base64url');

	return { token, hash };
}
