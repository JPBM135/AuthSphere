/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.createTable('users', (table) => {
		table.string('id', 20).primary().notNullable().comment('Unique identifier for the user');
		table.string('email').notNullable().unique().comment('Email address of the user');
		table.string('first_name').notNullable().comment('First name of the user');
		table.string('last_name').notNullable().comment('Last name of the user');
		table.string('avatar_url').comment("URL of the user's avatar");
		table.timestamps(true, true);
	});

	await knex.schema.createTable('users_logins_passwords', (table) => {
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
		table.string('password').notNullable().comment('Hashed password of the user');
		table
			.timestamp('last_changed_at')
			.notNullable()
			.defaultTo(knex.fn.now())
			.comment('Last time the password was changed');
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.dropTable('users');
}
