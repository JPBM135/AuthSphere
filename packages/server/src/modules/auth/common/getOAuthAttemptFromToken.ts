import { StateTokenAudience } from '../../../common/tokens/state/createStateToken.js';
import { decodeStateToken } from '../../../common/tokens/state/decodeStateToken.js';
import { verifyStateToken } from '../../../common/tokens/state/verifyStateToken.js';
import type { OauthAttempts } from '../../../generated/database.types.js';
import type { Repository } from '../../../infra/repositories/Repository.js';

export async function getOAuthAttemptFromToken(
	token: string | null,
	repository: Repository<'oauth_attempts'>,
): Promise<OauthAttempts | null> {
	if (!token) {
		return null;
	}

	const payload = decodeStateToken(token);

	if (!payload) {
		return null;
	}

	const oAuthAttempt = await repository.getOrThrow(payload.jti as string);

	if (oAuthAttempt.status !== 'created') {
		return null;
	}

	const verifyResult = verifyStateToken(
		token,
		oAuthAttempt.token_hash,
		StateTokenAudience.OAuthAuthorize,
	);

	if (!verifyResult) {
		return null;
	}

	await repository.update(oAuthAttempt.id, {
		status: 'pending',
	});

	return oAuthAttempt;
}
