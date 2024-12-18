import type {} from '../../server/src/common/types/knex';
import type { Knex } from 'knex';

const TABLE_NAME = 'users_logins_mfas';

export const seed = async (knex: Knex) => {
	await knex(TABLE_NAME).insert([
		{
			id: '000000000000000',
			user_id: '000000000000001',
			name: 'Authenticator App',
			secret: 'A4HQKMJJHEFUOPSVORWQQTBBIQ',
			type: 'authenticator_app',
		},
	]);
};
