import type { Knex } from 'knex';
import { ErrorCodes } from '../../../common/errors/errorCodes.js';
import { throwGraphqlError } from '../../../common/errors/throwGraphqlError.js';

export async function getLatestActivePassword(knex: Knex, userId: string) {
	const latestPassword = await knex('users_logins_passwords')
		.select('*')
		.where({ user_id: userId })
		.orderBy('created_at', 'desc')
		.first();

	if (!latestPassword) {
		throwGraphqlError('User/Password combination is incorrect', ErrorCodes.AuthInvalidCredentials);
	}

	return latestPassword;
}
