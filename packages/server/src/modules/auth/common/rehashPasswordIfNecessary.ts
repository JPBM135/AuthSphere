import bcrypt from 'bcrypt';
import type { Knex } from 'knex';
import { CONFIG } from '../../../config.js';
import type { UsersLoginsPasswords } from '../../../generated/database.types.js';
import Logger from '../../../infra/logger/index.js';

const logger = Logger.getInstance().createChildren('PasswordRehash');

export async function rehashPasswordIfNecessary(knex: Knex, latestPassword: UsersLoginsPasswords) {
	const saltSize = Number(latestPassword.password.split('$')[2]);

	if (!Number.isNaN(saltSize) && saltSize < CONFIG.PASSWORD.ROUNDS) {
		logger.info(`Rehashing password for user ${latestPassword.user_id} with salt size ${saltSize}`);
		const newHashedPassword = await bcrypt.hash(latestPassword.password, CONFIG.PASSWORD.ROUNDS);
		await knex('users_logins_passwords')
			.update({ password: newHashedPassword })
			.where({ id: latestPassword.id });
	}
}
