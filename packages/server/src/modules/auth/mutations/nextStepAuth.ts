import { ErrorCodes } from '../../../common/errors/errorCodes.js';
import { throwGraphqlError } from '../../../common/errors/throwGraphqlError.js';
import { TokenBuilder } from '../../../common/tokens/auth/TokenBuilder.js';
import {
	generateState,
	StateTokenAudience,
} from '../../../common/tokens/state/createStateToken.js';
import { decodeStateToken } from '../../../common/tokens/state/decodeStateToken.js';
import { verifyStateToken } from '../../../common/tokens/state/verifyStateToken.js';
import {
	convertGqlMfaToUserMfa,
	convertUserMfaToGqlMfa,
} from '../../../common/transformers/convertUserMfaToGqlMfa.js';
import {
	extractIpFromRequest,
	extractUserAgentFromRequest,
} from '../../../common/utils/extractFromRequest.js';
import { resolveToken } from '../../../infra/container/resolveToken.js';
import { DatabaseToken } from '../../../infra/database/createDatabase.js';
import { RepositoriesToken } from '../../../infra/repositories/createRespositories.js';
import { SnowflakeToken } from '../../../infra/snowflake/createSnowflake.js';
import type { AuthResolverFn } from '../../interfaces.js';
import { enforceSameIpAndUserAgent } from '../common/enforceSameIpAndUserAgent.js';
import { verifyUserAuthenticatorCode } from '../common/twoFactor/authenticatorApp.js';

export const nextStepAuth: AuthResolverFn<'nextStepAuth'> = async (_, { input }, context) => {
	const { authAttemptToken, code, type } = input;

	const db = resolveToken(DatabaseToken);
	const { loginsAttemptsRepository, loginsAttemptsMfasRepository } =
		resolveToken(RepositoriesToken);
	const snowflake = resolveToken(SnowflakeToken);

	const tokenPayload = decodeStateToken(authAttemptToken);

	if (!tokenPayload) {
		throwGraphqlError('Invalid token', ErrorCodes.AuthInvalidToken);
	}

	const authAttempt = await loginsAttemptsRepository.getOrThrow(tokenPayload.jti as string);

	const verifyToken = verifyStateToken(
		authAttemptToken,
		authAttempt.token_hash!,
		StateTokenAudience.Auth,
	);

	if (!verifyToken) {
		throwGraphqlError('Invalid token', ErrorCodes.AuthInvalidToken);
	}

	if (authAttempt.status !== 'pending') {
		throwGraphqlError('Auth attempt already completed', ErrorCodes.AuthAttemptNotPending);
	}

	const userMfaType = convertGqlMfaToUserMfa(type);
	const userMfa = await db('users_logins_mfas')
		.where({ user_id: authAttempt.user_id, type: userMfaType })
		.first();

	if (!userMfa) {
		throwGraphqlError('MFA not found', ErrorCodes.AuthUnknownMfaType);
	}

	enforceSameIpAndUserAgent(context.req, authAttempt);

	const createdAuthMfaAttempt = await loginsAttemptsMfasRepository.create({
		id: snowflake.generate(),
		user_id: authAttempt.user_id,
		mfa_id: userMfa.id,
		status: 'pending',
	});

	if (!createdAuthMfaAttempt) {
		throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
	}

	if (userMfaType === 'authenticator_app') {
		await verifyUserAuthenticatorCode(code, userMfa, authAttempt.id, createdAuthMfaAttempt.id);
	}

	await db('logins_attempts_mfas')
		.update({ status: 'success' })
		.where({ id: createdAuthMfaAttempt.id });

	const userConfiguration = await db('users_configurations')
		.where({ user_id: authAttempt.user_id })
		.first();

	const mfaStrategy = userConfiguration?.mfa_strategy ?? 'one_of';

	const completedMfas = await db('logins_attempts_mfas').where({
		user_id: authAttempt.user_id,
		status: 'success',
	});

	if (mfaStrategy === 'one_of') {
		const client = await db('clients').select('*').where({ slug: 'meta' }).first();
		const user = await db('users').select('*').where({ id: authAttempt.user_id }).first();

		await db('logins_attempts').update({ status: 'success' }).where({ id: authAttempt.id });
		return {
			tokens: [
				await new TokenBuilder()
					.withIp(extractIpFromRequest(context.req))
					.withUserAgent(extractUserAgentFromRequest(context.req))
					.withClient(client!)
					.withUser(user!)
					.buildAccessToken(),
				await new TokenBuilder()
					.withIp(extractIpFromRequest(context.req))
					.withUserAgent(extractUserAgentFromRequest(context.req))
					.withClient(client!)
					.withUser(user!)
					.buildRefreshToken(),
			],
			__typename: 'SuccessAuthResponse',
		};
	}

	const missingMfas = await db('users_logins_mfas')
		.whereNotIn(
			'id',
			completedMfas.map((mfa) => mfa.mfa_id),
		)
		.where({ user_id: authAttempt.user_id });

	const { hash, token } = generateState(authAttempt.id, StateTokenAudience.Auth);

	await db('logins_attempts')
		.update({
			token_hash: hash,
		})
		.where({ id: authAttempt.id });

	return {
		authAttemptToken: token,
		nextStepTypes: missingMfas.map((mfa) => convertUserMfaToGqlMfa(mfa.type)),
		__typename: 'NextStepAuthResponse',
	};
};
