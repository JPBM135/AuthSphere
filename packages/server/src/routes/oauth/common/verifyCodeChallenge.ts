export function verifyCodeChallenge(state: string): boolean {
	if (state.length < 32) {
		return false;
	}

	if (state.length > 128) {
		return false;
	}

	return /[\dA-Za-z-]+/.test(state);
}
