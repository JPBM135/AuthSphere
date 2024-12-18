import { URL } from 'node:url';
import type { Request, Response } from 'express';
import { ErrorCodes } from '../../../common/errors/errorCodes.js';
import { CacheDuration } from '../../../common/response/enums/cacheDuration.js';
import { ResponseFormat } from '../../../common/response/enums/responseFormat.js';
import { SendResponseBuilder } from '../../../common/response/sendResponse.js';
import { CONFIG } from '../../../config.js';
import { resolveToken } from '../../../infra/container/resolveToken.js';
import { DatabaseToken } from '../../../infra/database/createDatabase.js';
import {
	JwtClaims,
	OpenIdCodeChallengeMethod,
	OpenIdGrantType,
	OpenIdResponseType,
	OpenIdSigningAlgorithm,
	OpenIdSubjectType,
	OpenIdTokenEndpointAuthMethod,
} from '../enums.js';
import type { OpenIDConfiguration } from '../types.js';

export async function handleWellKnownConfiguration(
	req: Request<{
		clientId?: string;
	}>,
	res: Response,
) {
	const { clientId } = req.params;

	const db = resolveToken(DatabaseToken);

	const client = await db.table('clients').select('*').where('slug', clientId).first();

	if (!client) {
		SendResponseBuilder.create(res)
			.withStatus(404)
			.withError({ code: ErrorCodes.OAuthClientNotFound, message: 'OAuth client not found' })
			.send();
		return;
	}

	const baseApiUrl = clientId ? new URL(CONFIG.API_URL! + `/${clientId}`).href : CONFIG.API_URL!;
	const clientUrl = CONFIG.CLIENT_URL!;

	const openidConfiguration: OpenIDConfiguration = {
		issuer: baseApiUrl,
		authorization_endpoint: `${baseApiUrl}/oauth2/authorize`,
		token_endpoint: `${baseApiUrl}/oauth2/token`,
		userinfo_endpoint: `${baseApiUrl}/oauth2/userinfo`,
		jwks_uri: `${baseApiUrl}/.well-known/jwks.json`,
		response_types_supported: [
			OpenIdResponseType.CODE,
			OpenIdResponseType.ID_TOKEN,
			OpenIdResponseType.TOKEN,
			OpenIdResponseType.CODE_ID_TOKEN,
			OpenIdResponseType.CODE_TOKEN,
			OpenIdResponseType.CODE_ID_TOKEN_TOKEN,
			OpenIdResponseType.ID_TOKEN_TOKEN,
		],
		id_token_signing_alg_values_supported: [OpenIdSigningAlgorithm.ES256],
		subject_types_supported: [OpenIdSubjectType.PUBLIC],
		claims_supported: [
			// Required claims
			JwtClaims.Aud,
			JwtClaims.Exp,
			JwtClaims.Iat,
			JwtClaims.Iss,
			JwtClaims.Nonce,
			JwtClaims.Sub,
			JwtClaims.Jti,
			JwtClaims.Nbf,
			// Optional claims
			JwtClaims.Address,
			JwtClaims.Birthdate,
			JwtClaims.Email,
			JwtClaims.EmailVerified,
			JwtClaims.FamilyName,
			JwtClaims.GivenName,
			JwtClaims.Locale,
			JwtClaims.PhoneNumber,
			JwtClaims.Picture,
		],
		code_challenge_methods_supported: [OpenIdCodeChallengeMethod.S256],
		end_session_endpoint: `${baseApiUrl}/oauth2/logout`,
		grant_types_supported: [OpenIdGrantType.AUTHORIZATION_CODE, OpenIdGrantType.REFRESH_TOKEN],
		introspection_endpoint: `${baseApiUrl}/oauth2/introspect`,
		registration_endpoint: `${clientUrl}/#/register`,
		revocation_endpoint: `${baseApiUrl}/oauth2/revoke`,
		scopes_supported: client.scopes,
		token_endpoint_auth_methods_supported: [OpenIdTokenEndpointAuthMethod.CLIENT_SECRET_POST],
	};

	SendResponseBuilder.create<OpenIDConfiguration>(res)
		.withCacheDuration(CacheDuration.Long)
		.withData(openidConfiguration)
		.send(ResponseFormat.DataOnly);
}
