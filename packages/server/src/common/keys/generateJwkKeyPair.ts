import { generateKeyPairSync, createPublicKey } from 'node:crypto';
import { resolveToken } from '../../infra/container/resolveToken.js';
import { SnowflakeToken } from '../../infra/snowflake/createSnowflake.js';

const BUFFER_SIZES = {
	SHORT: {
		COORDINATES_BUFFER: 65,
		CURVE_COMPONENT_SIZE: 32,
	},
	LONG: {
		COORDINATES_BUFFER: 133,
		CURVE_COMPONENT_SIZE: 66,
	},
};

export function generateJwkKeyPair(algorithm: 'prime256v1' | 'secp521r1') {
	const snowflake = resolveToken(SnowflakeToken);

	const { privateKey, publicKey } = generateKeyPairSync('ec', {
		namedCurve: algorithm,
		publicKeyEncoding: {
			type: 'spki',
			format: 'pem',
		},
		privateKeyEncoding: {
			type: 'pkcs8',
			format: 'pem',
		},
	});

	const keyId = snowflake.generate();

	const publicKeyObject = createPublicKey(publicKey);
	const publicKeyDer = publicKeyObject.export({ format: 'der', type: 'spki' });

	// Extract the key parameters
	const bufferSize =
		algorithm === 'prime256v1'
			? BUFFER_SIZES.SHORT.COORDINATES_BUFFER
			: BUFFER_SIZES.LONG.COORDINATES_BUFFER;
	const curveComponentSize =
		algorithm === 'prime256v1'
			? BUFFER_SIZES.SHORT.CURVE_COMPONENT_SIZE
			: BUFFER_SIZES.LONG.CURVE_COMPONENT_SIZE;

	const keyBuffer = publicKeyDer.subarray(-bufferSize);
	const xComponent = keyBuffer.subarray(1, curveComponentSize + 1); // First byte is '04' for uncompressed
	const yComponent = keyBuffer.subarray(curveComponentSize + 1, 2 * curveComponentSize + 1);

	return {
		keyId,
		privateKey,
		publicKey,
		xComponent,
		yComponent,
	};
}
