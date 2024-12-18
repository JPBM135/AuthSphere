/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.raw(`
		create type signing_key_lifetime_type as enum ('long', 'short');
	`);

	await knex.schema.createTable('signing_keys', (table) => {
		table.string('id', 20).primary().notNullable();
		table.binary('public_key').notNullable().comment('Public key in PEM format');
		table.binary('private_key').notNullable().comment('Private key in PEM format');
		table.string('x_component', 256).notNullable().comment('x component of the public key');
		table.string('y_component', 256).notNullable().comment('y component of the public key');
		table
			.specificType('lifetime', 'signing_key_lifetime_type')
			.notNullable()
			.comment('Lifetime of the key, long lived keys will be used for long lived tokens');
		table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.dropTable('signing_keys');
}
