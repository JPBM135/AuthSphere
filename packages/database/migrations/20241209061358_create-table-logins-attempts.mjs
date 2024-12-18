/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.raw(`
    create type logins_attempts_statuses as enum ('pending', 'success', 'failure');
  `);

	await knex.schema.createTable('logins_attempts', (table) => {
		table
			.string('id', 20)
			.primary()
			.notNullable()
			.comment('Unique identifier for the login attempt');
		table.string('token_hash', 256).comment('Token of the login attempt');
		table
			.string('user_id', 20)
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
			.comment('ID of the user that owns the login attempt');
		table
			.specificType('status', 'logins_attempts_statuses')
			.notNullable()
			.comment('Status of the login attempt');
		table.string('ip_address').notNullable().comment('IP address of the login attempt');
		table.string('user_agent').notNullable().comment('User agent of the login attempt');
		table.timestamps(true, true);
	});

	await knex.schema.createTable('logins_attempts_mfas', (table) => {
		table
			.string('id', 20)
			.primary()
			.notNullable()
			.comment('Unique identifier for the login attempt');
		table
			.string('user_id', 20)
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
			.comment('ID of the user that owns the login attempt');
		table
			.string('mfa_id', 20)
			.notNullable()
			.references('id')
			.inTable('users_logins_mfas')
			.onDelete('CASCADE')
			.comment('ID of the MFA used in the login attempt');
		table
			.specificType('status', 'logins_attempts_statuses')
			.notNullable()
			.comment('Status of the login attempt');
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.dropTable('logins_attempts');
	await knex.schema.dropTable('logins_attempts_mfas');
	await knex.schema.raw(`
    drop type logins_attempts_statuses;
  `);
}
