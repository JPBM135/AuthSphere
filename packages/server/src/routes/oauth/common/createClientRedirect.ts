import { URL } from 'node:url';
import { assertConfig } from '../../../common/assert/assertConfig.js';
import { CONFIG } from '../../../config.js';

export function createClientRedirect(clientId: string, state: string): string {
	assertConfig(CONFIG.CLIENT_URL, 'CLIENT_URL');
	const baseUrl = new URL(CONFIG.CLIENT_URL + '/HASH_REPLACE/login');
	baseUrl.searchParams.append('clientId', clientId);
	baseUrl.searchParams.append('oAuthToken', state);

	return baseUrl.href.replace('/HASH_REPLACE/', '/#/');
}
