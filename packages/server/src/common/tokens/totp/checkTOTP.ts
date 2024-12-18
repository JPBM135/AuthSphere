import { authenticator } from 'otplib';

export function verifyUserMfaSecret(secret: string, providedOtp: string): boolean {
	try {
		return authenticator.check(providedOtp, secret);
	} catch {
		return false;
	}
}
