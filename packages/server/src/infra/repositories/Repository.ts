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

type RepositoryWhereClause<T extends RepositoryAcceptedTables> =
	| Partial<TableTypes[T]['input']>
	| string
	| ((builder: Knex.QueryBuilder<Knex.TableType<T>>) => Knex.QueryBuilder<Knex.TableType<T>>);

/**
 * A generic repository for database operations
 *
 * @typeParam T - The table to operate on
 *
 * All methods will throw a `ServerInternalError` if an internal database error occurs
 */
export class Repository<
	T extends RepositoryAcceptedTables,
	SelectResult = TableTypes[T]['select'],
	InsertData = TableTypes[T]['input'],
	WhereData = RepositoryWhereClause<T>,
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

	/**
	 * Get a single resource from the database
	 *
	 * @param idOrWhere - The id or where clause to use, if a string is passed it will be treated as the id column
	 * @returns The resource or null if not found
	 */
	public async get(idOrWhere: WhereData): Promise<SelectResult | null> {
		try {
			return (
				(await this.db(this.table)
					.select('*')
					.where(
						typeof idOrWhere === 'string'
							? { id: idOrWhere }
							: (idOrWhere as Record<string, unknown>),
					)
					.first()) ?? null
			);
		} catch (error) {
			this.logger.error(`Internal database error on ${this.table} (get)`, error, { idOrWhere });
			throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
		}
	}

	/**
	 * Get a single resource from the database or throw an error if not found
	 *
	 * @param idOrWhere - The id or where clause to use, if a string is passed it will be treated as the id column
	 * @returns The resource
	 * @throws If the resource is not found
	 */
	public async getOrThrow(idOrWhere: WhereData): Promise<SelectResult> {
		const result = await this.get(idOrWhere);

		if (!result) {
			throwGraphqlError(`${this.readableTable} not found`, `${this.table}/not-found`);
		}

		return result;
	}

	/**
	 * Create a new resource in the database
	 *
	 * @param data - The data to insert, if the table has an id column and it's not provided it will be generated
	 * @param returning - Whether to return the created resource, defaults to true
	 */
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

	/**
	 * Update a resource in the database
	 *
	 * @param id - The id of the resource to update
	 * @param data - The data to update, the id field will be ignored
	 * @param returning - Whether to return the updated resource, defaults to true
	 */
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
			if ((data as Record<string, unknown>).id) {
				Reflect.deleteProperty(data, 'id');
			}

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

	/**
	 * Delete a resource from the database
	 *
	 * @param id - The id of the resource to delete
	 */
	public async delete(id: string): Promise<void> {
		try {
			await this.db(this.table).delete().where({ id });
		} catch (error) {
			this.logger.error(`Internal database error on ${this.table} (delete)`, error, { id });
			throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
		}
	}

	/**
	 * List resources from the database
	 *
	 * @param where - The where clause to use
	 */
	public async list(where: Exclude<WhereData, string>): Promise<SelectResult[]> {
		try {
			return await this.db(this.table)
				.select('*')
				.where(where as Record<string, unknown>);
		} catch (error) {
			this.logger.error(`Internal database error on ${this.table} (list)`, error, { where });
			throwGraphqlError('Internal database error', ErrorCodes.ServerInternalError);
		}
	}

	/**
	 * Get a query builder for the table
	 *
	 * @returns A query builder for the table
	 */
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
