import type { users_logins_mfas_types } from '../../generated/database.types.js';
import { AuthStepType } from '../../generated/graphql.types.js';

export function convertUserMfaToGqlMfa(mfa: users_logins_mfas_types): AuthStepType {
	switch (mfa) {
		case 'email':
			return AuthStepType.TwoFactorEmail;
		case 'authenticator_app':
			return AuthStepType.TwoFactorAuthenticatorApp;
		case 'passkey':
			return AuthStepType.TwoFactorPasskey;
		default:
			throw new Error(`Unknown MFA type: ${mfa}`);
	}
}

export function convertGqlMfaToUserMfa(mfa: AuthStepType): users_logins_mfas_types {
	switch (mfa) {
		case AuthStepType.TwoFactorEmail:
			return 'email';
		case AuthStepType.TwoFactorAuthenticatorApp:
			return 'authenticator_app';
		case AuthStepType.TwoFactorPasskey:
			return 'passkey';
		default:
			throw new Error(`Unknown MFA type: ${mfa}`);
	}
}
