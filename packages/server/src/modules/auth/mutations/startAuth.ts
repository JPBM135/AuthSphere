import bcrypt from 'bcrypt';
import { ErrorCodes } from '../../../common/errors/errorCodes.js';
import { throwGraphqlError } from '../../../common/errors/throwGraphqlError.js';
import { TokenBuilder } from '../../../common/tokens/auth/TokenBuilder.js';
import {
	generateState,
	StateTokenAudience,
} from '../../../common/tokens/state/createStateToken.js';
import { convertUserMfaToGqlMfa } from '../../../common/transformers/convertUserMfaToGqlMfa.js';
import {
	extractIpFromRequest,
	extractUserAgentFromRequest,
} from '../../../common/utils/extractFromRequest.js';
import { resolveToken } from '../../../infra/container/resolveToken.js';
import { DatabaseToken } from '../../../infra/database/createDatabase.js';
import { RepositoriesToken } from '../../../infra/repositories/createRespositories.js';
import { SnowflakeToken } from '../../../infra/snowflake/createSnowflake.js';
import type { AuthResolverFn } from '../../interfaces.js';
import { getLatestActivePassword } from '../common/getLatestActivePassword.js';
import { getOAuthAttemptFromToken } from '../common/getOAuthAttemptFromToken.js';
import { rehashPasswordIfNecessary } from '../common/rehashPasswordIfNecessary.js';

export const startAuth: AuthResolverFn<'startAuth'> = async (_, { input }, context) => {
	const { email, password, oAuthToken } = input;

	const db = resolveToken(DatabaseToken);
	const { oauthAttemptsRepository } = resolveToken(RepositoriesToken);
	const snowflake = resolveToken(SnowflakeToken);

	const oAuthAttempt = await getOAuthAttemptFromToken(oAuthToken ?? null, oauthAttemptsRepository);

	if (!oAuthAttempt && oAuthToken) {
		throwGraphqlError('Invalid token', ErrorCodes.AuthInvalidToken);
	}

	const user = await db('users').select('*').where({ email }).first();

	if (!user) {
		throwGraphqlError('User/Password combination is incorrect', ErrorCodes.AuthInvalidCredentials);
	}

	// Check password
	const latestPassword = await getLatestActivePassword(db, user.id);

	const passwordMatch = await bcrypt.compare(password, latestPassword.password);

	if (!passwordMatch) {
		throwGraphqlError('User/Password combination is incorrect', ErrorCodes.AuthInvalidCredentials);
	}

	await rehashPasswordIfNecessary(db, latestPassword);

	const client = await db('clients').select('*').where({ slug: 'meta' }).first();

	if (!client) {
		throwGraphqlError('Client not found', ErrorCodes.OAuthClientNotFound);
	}

	const [createdAuthAttempt] = await db('logins_attempts')
		.insert({
			id: snowflake.generate(),
			ip_address: extractIpFromRequest(context.req),
			user_agent: extractUserAgentFromRequest(context.req),
			user_id: user.id,
			status: 'pending',
			oauth_attempt_id: oAuthAttempt?.id ?? null,
		})
		.returning('id');

	if (!createdAuthAttempt) {
		throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
	}

	const userMfas = await db('users_logins_mfas').where({ user_id: user.id });

	if (!userMfas.length) {
		await db('logins_attempts').update({ status: 'success' }).where({ id: createdAuthAttempt.id });
		return {
			tokens: [
				await new TokenBuilder()
					.withIp(extractIpFromRequest(context.req))
					.withUserAgent(extractUserAgentFromRequest(context.req))
					.withClient(client)
					.withUser(user)
					.buildAccessToken(),
				await new TokenBuilder()
					.withIp(extractIpFromRequest(context.req))
					.withUserAgent(extractUserAgentFromRequest(context.req))
					.withClient(client)
					.withUser(user)
					.buildRefreshToken(),
			],
			__typename: 'SuccessAuthResponse',
		};
	}

	const { hash, token } = generateState(createdAuthAttempt.id, StateTokenAudience.Auth);

	await db('logins_attempts').update({
		token_hash: hash,
	});

	return {
		authAttemptToken: token,
		nextStepTypes: userMfas.map((mfa) => convertUserMfaToGqlMfa(mfa.type)),
		__typename: 'NextStepAuthResponse',
	};
};
