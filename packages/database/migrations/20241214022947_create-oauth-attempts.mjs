/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.raw(`
    create type oauth_attempts_status as enum ('created', 'pending', 'fulfilled', 'rejected');
  `);

	await knex.schema.createTable('oauth_attempts', (table) => {
		table
			.string('id', 20)
			.primary()
			.notNullable()
			.comment('Unique identifier for the oauth attempt');
		table.string('token_hash', 256).notNullable().comment('Token of the oauth attempt');
		table
			.string('client_id', 20)
			.notNullable()
			.references('id')
			.inTable('clients')
			.comment('Client of the oauth attempt');
		table
			.specificType('scopes', 'text[]')
			.notNullable()
			.defaultTo('{}')
			.comment('Scopes of the oauth attempt');
		table
			.specificType('status', 'oauth_attempts_status')
			.notNullable()
			.defaultTo('created')
			.comment('Status of the oauth attempt');
		table.specificType('response_types', 'text[]').comment('Grant type of the oauth attempt');
		table.string('code_challenge').comment('Code challenge of the oauth attempt');
		table.string('code_challenge_method').comment('Code challenge method of the oauth attempt');
		table.string('state').comment('State of the oauth attempt');
		table.string('ip_address').notNullable().comment('IP address of the oauth attempt');
		table.string('user_agent').notNullable().comment('User agent of the oauth attempt');
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {}
