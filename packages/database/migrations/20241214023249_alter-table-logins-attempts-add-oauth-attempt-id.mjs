/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.alterTable('logins_attempts', (table) => {
		table
			.string('oauth_attempt_id', 20)
			.references('id')
			.inTable('oauth_attempts')
			.onDelete('CASCADE');
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.alterTable('logins_attempts', (table) => {
		table.dropColumn('oauth_attempt_id');
	});
}
