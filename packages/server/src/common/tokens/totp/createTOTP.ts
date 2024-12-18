import { authenticator } from 'otplib';
import { CONFIG } from '../../../config.js';
import type { Users } from '../../../generated/database.types.js';

export interface CreateUserMfaSecretResult {
	secret: string;
	uri: string;
}

export function createUserMfaSecret(user: Users): CreateUserMfaSecretResult {
	const secret = authenticator.generateSecret(CONFIG.TOKEN.TOTP.KEY_LENGTH);
	const uri = authenticator.keyuri(user.email, CONFIG.APP_NAME, secret);

	return {
		secret,
		uri,
	};
}
