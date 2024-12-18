import type { Request, Response } from 'express';
import { formatKeyToJwks } from '../../../common/keys/convertSigningToJwks.js';
import { CacheDuration } from '../../../common/response/enums/cacheDuration.js';
import { ResponseFormat } from '../../../common/response/enums/responseFormat.js';
import { SendResponseBuilder } from '../../../common/response/sendResponse.js';
import { resolveToken } from '../../../infra/container/resolveToken.js';
import { KeysRepositoryToken } from '../../../infra/repositories/createRespositories.js';

export async function handleJwks(_: Request, res: Response) {
	const keysRepository = resolveToken(KeysRepositoryToken);

	const pubKeys = await keysRepository.getPubKeys();

	const jwks = {
		keys: pubKeys.map(formatKeyToJwks),
	};

	SendResponseBuilder.create(res)
		.withCacheDuration(CacheDuration.Short)
		.withData(jwks)
		.send(ResponseFormat.DataOnly);
}
