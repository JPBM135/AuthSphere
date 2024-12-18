/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.raw(`
    create type users_configurations_mfa_strategy as enum (
      'one_of',
      'all_of'
    );
  `);

	await knex.schema.createTable('users_configurations', (table) => {
		table.string('id', 20).primary().notNullable();
		table.string('user_id').notNullable().unique().comment('Unique identifier for the user');
		table
			.specificType('mfa_strategy', 'users_configurations_mfa_strategy')
			.notNullable()
			.comment('MFA auth type');
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.dropTable('users_configurations');
	await knex.schema.raw(`
    drop type users_configurations_mfa_strategy;
  `);
}
