import type {} from '../../server/src/common/types/knex';
import type { Knex } from 'knex';

const TABLE_NAME = 'users';

export const seed = async (knex: Knex) => {
	await knex(TABLE_NAME).insert([
		{
			id: '000000000000000',
			email: 'admin@admin.com',
			first_name: 'Admin',
			last_name: 'Admin',
		},
		{
			id: '000000000000001',
			email: 'admin-with-mfa@admin.com',
			first_name: 'Admin',
			last_name: 'Admin',
		},
	]);

	await knex('users_logins_passwords').insert([
		{
			id: '000000000000000',
			password: '$2b$14$hLE9w8RI29Z0c5lOGJayHes/sGvcAt1orTGjkW5QmUvPxEBjFA6eu',
			user_id: '000000000000000',
			last_changed_at: new Date(),
		},
		{
			id: '000000000000001',
			password: '$2b$14$hLE9w8RI29Z0c5lOGJayHes/sGvcAt1orTGjkW5QmUvPxEBjFA6eu',
			user_id: '000000000000001',
			last_changed_at: new Date(),
		},
	]);
};
