import type { JsonWebKey } from 'node:crypto';
import type { SigningKeys } from '../../generated/database-keys.types.js';

export function formatKeyToJwks(
	key: Pick<SigningKeys, 'id' | 'lifetime' | 'x_component' | 'y_component'>,
): JsonWebKey {
	return {
		kty: 'EC',
		crv: key.lifetime === 'short' ? 'P-256' : 'P-521',
		x: key.x_component,
		y: key.y_component,
		use: 'sig',
		kid: key.id,
	};
}
