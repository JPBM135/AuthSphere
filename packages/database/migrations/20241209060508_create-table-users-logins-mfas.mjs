/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.raw(`
    create type users_logins_mfas_types as enum ('authenticator_app', 'email', 'passkey');
  `);

	await knex.schema.createTable('users_logins_mfas', (table) => {
		table
			.string('id', 20)
			.primary()
			.notNullable()
			.comment('Unique identifier for the login detail');
		table
			.string('user_id', 20)
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
			.comment('ID of the user that owns the login detail');
		table.string('name').notNullable().comment('Name of the MFA');
		table.specificType('type', 'users_logins_mfas_types').notNullable().comment('Type of MFA');
		table.string('secret').notNullable().comment('Secret of the MFA');
		table
			.timestamp('last_changed_at')
			.notNullable()
			.defaultTo(knex.fn.now())
			.comment('Last time the secret was changed');
		table.timestamps(true, true);
	});

	await knex.schema.createTable('users_logins_backup_codes', (table) => {
		table
			.string('id', 20)
			.primary()
			.notNullable()
			.comment('Unique identifier for the login detail');
		table
			.string('user_id', 20)
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
			.comment('ID of the user that owns the login detail');
		table.string('code').notNullable().comment('Backup code hashed');
		table.string('salt').notNullable().comment('Salt for the backup code');
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.dropTable('users_logins_authenticator_apps');
	await knex.schema.dropTable('users_logins_passkeys');
	await knex.schema.dropTable('users_logins_mfas');
	await knex.schema.dropTable('users_logins_backup_codes');
	await knex.schema.raw(`
    drop type users_logins_mfas_types;
  `);
}
