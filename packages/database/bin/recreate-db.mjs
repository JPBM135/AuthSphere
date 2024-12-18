import process from 'node:process';
import pkg from 'pg';

const { Client } = pkg;

const connectionStringMaster = 'postgres://postgres:test@localhost:4433/postgres';
const DB_NAMEs = ['authsphere', 'authsphere_keys'];

async function run() {
	const postgresClient = new Client(connectionStringMaster);
	await postgresClient.connect();

	for (const DB_NAME of DB_NAMEs) {
		await postgresClient.query(
			`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${DB_NAME}' AND pid <> pg_backend_pid();`,
		);
		await postgresClient.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);
		await postgresClient.query(`CREATE DATABASE ${DB_NAME}`);
		console.log(`Database ${DB_NAME} created`);
	}

	await postgresClient.end();

	process.exit(0);
}

run();
