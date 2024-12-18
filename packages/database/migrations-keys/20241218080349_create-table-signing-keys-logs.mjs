/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.raw(`
    create type signing_key_log_action as enum ('created', 'deleted', 'requested-for-signing');
    create type signing_key_log_status as enum ('success', 'failed');
  `);

	await knex.schema.createTable('signing_keys_logs', (table) => {
		table.string('id', 20).primary().notNullable();
		table.string('signing_key_id', 20).defaultTo(null).comment('Signing key that was affected');
		table.specificType('action', 'signing_key_log_action').notNullable();
		table.specificType('status', 'signing_key_log_status').comment('Status of the request');
		table.string('user_id', 20).notNullable().comment('User that performed the action');
		table.string('ip_address').notNullable().comment('IP address of the request');
		table.string('user_agent').notNullable().comment('User agent of the request');
		table.string('error_message').comment('Error message if the request failed');
		table.timestamps(true, true);

		table.index(['ip_address', 'user_id']);
		table.index('ip_address');
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.dropTable('signing_keys_logs');
	await knex.schema.raw('drop type signing_key_log_action');
}
