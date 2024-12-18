import { ErrorCodes } from '../../../../common/errors/errorCodes.js';
import { throwGraphqlError } from '../../../../common/errors/throwGraphqlError.js';
import { verifyUserMfaSecret } from '../../../../common/tokens/totp/checkTOTP.js';
import type { UsersLoginsMfas } from '../../../../generated/database.types.js';
import { setAuthAttemptStatus } from '../setLoginAttemptStatus.js';

export async function verifyUserAuthenticatorCode(
	code: string,
	userMfa: UsersLoginsMfas,
	authAttemptId: string,
	mfaAttemptId: string,
) {
	const isValidMfa = verifyUserMfaSecret(userMfa.secret, code);

	if (!isValidMfa) {
		await setAuthAttemptStatus('failure', authAttemptId, mfaAttemptId);
		throwGraphqlError('Invalid code', ErrorCodes.AuthInvalidMfaCode);
	}
}
