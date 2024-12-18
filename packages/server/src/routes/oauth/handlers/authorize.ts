import type { Request, Response } from 'express';
import {
	assertQueryParameter,
	QueryParameterType,
} from '../../../common/assert/assertQueryParameter.js';
import { ErrorCodes } from '../../../common/errors/errorCodes.js';
import { HttpStatusCodes } from '../../../common/response/enums/httpStatusCodes.js';
import { SendResponseBuilder } from '../../../common/response/sendResponse.js';
import { TimeSpan } from '../../../common/timespan/TimeSpan.js';
import {
	generateState,
	StateTokenAudience,
} from '../../../common/tokens/state/createStateToken.js';
import {
	extractIpFromRequest,
	extractUserAgentFromRequest,
} from '../../../common/utils/extractFromRequest.js';
import { resolveToken } from '../../../infra/container/resolveToken.js';
import Logger from '../../../infra/logger/index.js';
import { RepositoriesToken } from '../../../infra/repositories/createRespositories.js';
import { SnowflakeToken } from '../../../infra/snowflake/createSnowflake.js';
import { createClientRedirect } from '../common/createClientRedirect.js';
import { verifyCodeChallenge } from '../common/verifyCodeChallenge.js';

const logger = Logger.getInstance().createChildren('OAuthAuthorize');

export async function handleOAuthAuthorize(
	req: Request<
		object,
		object,
		{
			clientId?: string;
			codeChallenge?: string;
			codeChallengeMethod?: string;
			redirectUri?: string;
			responseType?: string;
			scope?: string;
			state?: string;
		}
	>,
	res: Response,
) {
	try {
		const clientId = assertQueryParameter(req.query, 'clientId', QueryParameterType.String);
		const responseType = assertQueryParameter(req.query, 'responseType', QueryParameterType.Array);
		const redirectUri = assertQueryParameter(req.query, 'redirectUri', QueryParameterType.String);
		const scope = assertQueryParameter(req.query, 'scope', QueryParameterType.Array);
		const state = assertQueryParameter(req.query, 'state', QueryParameterType.String);
		const codeChallenge = assertQueryParameter(
			req.query,
			'codeChallenge',
			QueryParameterType.String,
		);
		const codeChallengeMethod = assertQueryParameter(
			req.query,
			'codeChallengeMethod',
			QueryParameterType.String,
		);

		const snowflake = resolveToken(SnowflakeToken);
		const { clientsRepository, oauthAttemptsRepository } = resolveToken(RepositoriesToken);

		const client = await clientsRepository.getOrThrow({
			slug: clientId,
		});

		if (client.redirect_uri !== redirectUri) {
			SendResponseBuilder.create(res)
				.withStatus(400)
				.withError({ code: ErrorCodes.OAuthInvalidRedirect, message: 'Invalid redirect_uri' })
				.send();
			return;
		}

		if (!responseType.every((type) => client.response_types.includes(type))) {
			SendResponseBuilder.create(res)
				.withStatus(400)
				.withError({ code: ErrorCodes.OAuthInvalidResponseType, message: 'Invalid response_type' })
				.send();
			return;
		}

		if (!scope.every((clientScope) => client.scopes.includes(clientScope))) {
			SendResponseBuilder.create(res)
				.withStatus(400)
				.withError({ code: ErrorCodes.OAuthInvalidScope, message: 'Invalid scope' })
				.send();
			return;
		}

		if (codeChallengeMethod !== 'S256') {
			SendResponseBuilder.create(res)
				.withStatus(400)
				.withError({
					code: ErrorCodes.OAuthInvalidCodeChallenge,
					message: 'Invalid code_challenge_method',
				})
				.send();
			return;
		}

		if (!verifyCodeChallenge(codeChallenge)) {
			SendResponseBuilder.create(res)
				.withStatus(400)
				.withError({
					code: ErrorCodes.OAuthInvalidCodeChallenge,
					message:
						'Invalid code_challenge length, must be between 32 and 128 characters and contain only URL safe characters',
				})
				.send();
			return;
		}

		if (!verifyCodeChallenge(state)) {
			SendResponseBuilder.create(res)
				.withStatus(400)
				.withError({
					code: ErrorCodes.OAuthInvalidState,
					message:
						'Invalid state length, must be between 32 and 128 characters and contain only URL safe characters',
				})
				.send();
			return;
		}

		const oAuthAttemptWithSameState = await oauthAttemptsRepository.get((build) =>
			build
				.where((subBuilder) =>
					subBuilder.where('state', '=', state).orWhere('code_challenge', '=', codeChallenge),
				)
				.andWhere(
					'created_at',
					'>',
					TimeSpan.fromNow().subtract(TimeSpan.fromDays(30)).toIsoString(),
				),
		);

		if (oAuthAttemptWithSameState) {
			logger.warn('OAuth attempt with same state already exists', {
				state,
				oAuthAttemptWithSameState,
			});

			SendResponseBuilder.create(res)
				.withStatus(400)
				.withError({
					code: ErrorCodes.ServerForbidden,
					message: 'Forbidden',
				})
				.send();
			return;
		}

		const oAuthAttemptId = snowflake.generate();

		const { hash, token } = generateState(oAuthAttemptId, StateTokenAudience.OAuthAuthorize);

		await oauthAttemptsRepository.create({
			id: oAuthAttemptId,
			token_hash: hash,
			client_id: client.id,
			code_challenge: codeChallenge,
			code_challenge_method: codeChallengeMethod,
			response_types: responseType,
			scopes: scope,
			state,
			ip_address: extractIpFromRequest(req),
			user_agent: extractUserAgentFromRequest(req),
		});

		logger.info('OAuth attempt created', { oAuthAttemptId });

		res.redirect(createClientRedirect(client.slug, token));
	} catch (error) {
		SendResponseBuilder.create(res)
			.withStatus(HttpStatusCodes.BadRequest)
			.withError(error as Error)
			.send();
	}
}
