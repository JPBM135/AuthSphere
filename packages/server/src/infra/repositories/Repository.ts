import type { Knex } from 'knex';
import { ErrorCodes } from '../../common/errors/errorCodes.js';
import { throwGraphqlError } from '../../common/errors/throwGraphqlError.js';
import type { TypedOmit } from '../../common/types/typedOmit.js';
import { tables, type TableTypes } from '../../generated/database.types.js';
import { resolveToken } from '../container/resolveToken.js';
import { DatabaseToken } from '../database/createDatabase.js';
import Logger from '../logger/index.js';
import { SnowflakeToken } from '../snowflake/createSnowflake.js';
import { databaseTableToReadableName } from './utils/databaseTableToReadable.js';

const logger = Logger.getInstance().createChildren('Repository');

export type RepositoryAcceptedTables = Exclude<
	keyof TableTypes,
	'knex_migrations_lock' | 'knex_migrations'
>;

export class Repository<
	T extends RepositoryAcceptedTables,
	SelectResult = TableTypes[T]['select'],
	InsertData = TableTypes[T]['input'],
	WhereData = Exclude<Parameters<Knex.QueryBuilder<Knex.TableType<T>>['where']>[0], string>,
> {
	protected readonly logger: Logger;

	protected readonly db = resolveToken(DatabaseToken);

	protected readonly snowflake = resolveToken(SnowflakeToken);

	protected readonly table: string;

	protected readonly readableTable: string;

	public readonly tableDefinition: (typeof tables)[T];

	public constructor(table: T, readableTable?: string) {
		this.table = table;

		this.readableTable = readableTable ?? databaseTableToReadableName(table);

		this.logger = logger.createChildren(this.readableTable);
		this.tableDefinition = tables[table];
	}

	public async get(id: string): Promise<SelectResult | null> {
		try {
			return (await this.db(this.table).select('*').where({ id }).first()) ?? null;
		} catch (error) {
			this.logger.error(`Internal database error on ${this.table} (get)`, error, { id });
			throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
		}
	}

	public async getOrThrow(id: string): Promise<SelectResult> {
		const result = await this.get(id);

		if (!result) {
			throwGraphqlError(`${this.readableTable} not found`, `${this.table}/not-found`);
		}

		return result;
	}

	public async create(data: InsertData, returning: false): Promise<null>;
	public async create(data: InsertData, returning?: true): Promise<SelectResult>;
	public async create(data: InsertData, returning = true): Promise<SelectResult | null> {
		try {
			if (this.tableRequiresNewId(data)) {
				Reflect.set(data, 'id', this.snowflake.generate());
			}

			const query = this.db(this.table).insert(data);

			if (returning) {
				const [createdResource] = await query.returning('*');
				return createdResource;
			}

			await query;
			return null;
		} catch (error) {
			this.logger.error(`Internal database error on ${this.table} (create)`, error, { data });
			throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
		}
	}

	public async update(
		id: string,
		data: Partial<TypedOmit<TableTypes[T]['input'], 'id'>>,
		returning: false,
	): Promise<null>;
	public async update(
		id: string,
		data: Partial<TypedOmit<TableTypes[T]['input'], 'id'>>,
		returning?: true,
	): Promise<SelectResult>;
	public async update(
		id: string,
		data: Partial<TypedOmit<TableTypes[T]['input'], 'id'>>,
		returning: boolean = true,
	): Promise<SelectResult | null> {
		try {
			const query = this.db(this.table).update(data).where({ id });

			if (returning) {
				const [updatedResource] = await query.returning('*');
				return updatedResource;
			}

			await query;
			return null;
		} catch (error) {
			this.logger.error(`Internal database error on ${this.table} (update)`, error, { id, data });
			throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
		}
	}

	public async delete(id: string): Promise<void> {
		try {
			await this.db(this.table).delete().where({ id });
		} catch (error) {
			this.logger.error(`Internal database error on ${this.table} (delete)`, error, { id });
			throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
		}
	}

	public async list(where: WhereData): Promise<SelectResult[]> {
		try {
			return await this.db(this.table)
				.select('*')
				.where(where as Record<string, unknown>);
		} catch (error) {
			this.logger.error(`Internal database error on ${this.table} (list)`, error, { where });
			throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
		}
	}

	public query(): Knex.QueryBuilder<Knex.TableType<T>> {
		return this.db.from(this.table);
	}

	private tableRequiresNewId<D extends InsertData>(data: D): data is D & { id: string } {
		if (typeof (data as Record<string, unknown>).id === 'string') {
			return false;
		}

		return this.tableDefinition.columns.includes('id');
	}
}
