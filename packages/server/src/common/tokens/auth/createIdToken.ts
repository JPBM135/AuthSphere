import { randomUUID } from 'node:crypto';
import { URL } from 'node:url';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../../../config.js';
import type { Clients, Users } from '../../../generated/database.types.js';
import { AuthTokenType } from '../../../generated/graphql.types.js';
import { resolveToken } from '../../../infra/container/resolveToken.js';
import { KeysRepositoryToken } from '../../../infra/repositories/createRespositories.js';
import { TimeSpan } from '../../timespan/TimeSpan.js';
import type { IdTokenPayload, TokenResponse } from './types.js';

export async function createIdToken(
	ip: string,
	userAgent: string,
	client: Clients,
	user: Users,
	nonce?: string | null,
): Promise<TokenResponse<AuthTokenType.Id>> {
	const keysRepository = resolveToken(KeysRepositoryToken);
	const latestShortLivedKey = await keysRepository.getLatestKeyWithPrivate({
		ip,
		lifetime: 'short',
		userAgent,
		userId: user.id,
	});

	if (!latestShortLivedKey) {
		throw new Error('No short lived key found');
	}

	const jti = randomUUID();
	const nowSeconds = TimeSpan.fromNow().seconds();

	const payload: IdTokenPayload = {
		iss: CONFIG.API_URL + `/${client.slug}`,
		sub: user.id,
		aud: new URL(client.aud_url).origin,
		exp: TimeSpan.fromNow().add(CONFIG.TOKEN.AUTHORIZATION_CODE.EXPIRATION).seconds(),
		iat: nowSeconds,
		jti,
		nbf: nowSeconds,
		email: user.email,
		given_name: user.first_name,
		family_name: user.last_name,
		picture: user.avatar_url ?? null,
	};

	if (nonce) {
		payload.nonce = nonce;
	}

	return {
		jwtId: jti,
		type: AuthTokenType.Id,
		token: jwt.sign(payload, latestShortLivedKey.private_key, {
			algorithm: 'ES256',
			keyid: latestShortLivedKey.id,
		}),
	};
}
