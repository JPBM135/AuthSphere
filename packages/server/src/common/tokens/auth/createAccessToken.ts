import { randomUUID } from 'node:crypto';
import { URL } from 'node:url';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../../../config.js';
import type { Clients } from '../../../generated/database.types.js';
import { AuthTokenType } from '../../../generated/graphql.types.js';
import { resolveToken } from '../../../infra/container/resolveToken.js';
import { KeysRepositoryToken } from '../../../infra/repositories/createRespositories.js';
import { TimeSpan } from '../../timespan/TimeSpan.js';
import type { AccessOrRefreshTokenPayload, TokenResponse } from './types.js';

export async function createAccessToken(
	ip: string,
	userAgent: string,
	client: Clients,
	userId: string,
	nonce?: string | null,
): Promise<TokenResponse<AuthTokenType.Access>> {
	const keysRepository = resolveToken(KeysRepositoryToken);
	const latestShortLivedKey = await keysRepository.getLatestKeyWithPrivate({
		ip,
		lifetime: 'short',
		userAgent,
		userId,
	});

	if (!latestShortLivedKey) {
		throw new Error('No short lived key found');
	}

	const jti = randomUUID();
	const nowSeconds = TimeSpan.fromNow().seconds();

	const payload: AccessOrRefreshTokenPayload = {
		iss: CONFIG.API_URL + `/${client.slug}`,
		sub: userId,
		aud: new URL(client.aud_url).origin,
		exp: TimeSpan.fromNow().add(CONFIG.TOKEN.ACCESS.EXPIRATION).seconds(),
		iat: nowSeconds,
		jti,
		nbf: nowSeconds,
	};

	if (nonce) {
		payload.nonce = nonce;
	}

	return {
		jwtId: jti,
		type: AuthTokenType.Access,
		token: jwt.sign(payload, latestShortLivedKey.private_key, {
			algorithm: 'ES256',
			keyid: latestShortLivedKey.id,
		}),
	};
}
