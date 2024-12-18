import type { Knex } from 'knex';
import type { TableTypes as KeysTableTypes } from '../../generated/database-keys.types.js';
import type { TableTypes } from '../../generated/database.types.js';

type TableTypesUnion = KeysTableTypes & TableTypes;

type SelectTableType<K extends keyof TableTypesUnion> = TableTypesUnion[K]['select'] & {
	[P in Exclude<
		keyof TableTypesUnion[K]['select'],
		symbol
	> as `${K}.${P}`]: TableTypesUnion[K]['select'][P];
};

type InsertTableType<K extends keyof TableTypesUnion> = TableTypesUnion[K]['input'];

type UpdateTableType<K extends keyof TableTypesUnion> = Partial<
	Exclude<TableTypesUnion[K]['input'], 'id'>
>;

type PgToTsTablesTypesToKnexTypes = {
	[K in keyof TableTypesUnion]: Knex.CompositeTableType<
		SelectTableType<K>,
		InsertTableType<K>,
		UpdateTableType<K>
	>;
};

declare module 'knex/types/tables.d.ts' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Tables extends PgToTsTablesTypesToKnexTypes {}
}
