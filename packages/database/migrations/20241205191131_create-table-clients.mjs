/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.createTable('clients', (table) => {
		table.string('id', 20).primary().notNullable();
		table.string('slug').notNullable().unique().comment('Unique identifier for the client');
		table
			.string('secret')
			.comment('Secret used to authenticate the client, only present for non-system clients');
		table.string('aud_url').notNullable().comment('URL to validate the audience of the client');
		table
			.string('redirect_uri')
			.notNullable()
			.comment('URI to redirect the user to after authorization');
		table.specificType('scopes', 'text[]').notNullable().comment('Allowed scopes');
		table.specificType('response_types', 'text[]').notNullable().comment('Allowed response types');
		table
			.boolean('is_system')
			.notNullable()
			.defaultTo(false)
			.comment('Whether the client is system (e.g. a first-party app)');
		table.timestamps(true, true);
	});

	await knex.table('clients').insert({
		id: '7263317790638075904',
		slug: 'meta',
		secret: null,
		aud_url: 'http://localhost:3000',
		redirect_uri: 'http://localhost:3000/auth/callback',
		scopes: ['openid', 'openid:email', 'openid:profile', 'meta:offline_access'],
		response_types: ['id_token', 'token'],
		is_system: true,
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.dropTable('oidc_tokens');
	await knex.schema.dropTable('oidc_authorization_codes');
	await knex.schema.dropTable('oauth_clients');
}
