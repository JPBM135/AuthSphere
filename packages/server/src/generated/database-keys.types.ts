/* tslint:disable */
/* eslint-disable */


/**
 * AUTO-GENERATED FILE - DO NOT EDIT!
 *
 * This file was automatically generated by pg-to-ts v.4.1.1
 * $ pg-to-ts generate -c postgresql://username:password@localhost:4433/authsphere_keys -t knex_migrations -t knex_migrations_lock -t signing_keys -t signing_keys_logs -s public
 *
 */


export type Json = unknown;
export type signing_key_lifetime_type = 'long' | 'short';
export type signing_key_log_action = 'created' | 'deleted' | 'requested-for-signing';
export type signing_key_log_status = 'failed' | 'success';

// Table knex_migrations
export interface KnexMigrations {
  id: number;
  name: string | null;
  batch: number | null;
  migration_time: Date | null;
}
export interface KnexMigrationsInput {
  id?: number;
  name?: string | null;
  batch?: number | null;
  migration_time?: Date | null;
}
const knex_migrations = {
  tableName: 'knex_migrations',
  columns: ['id', 'name', 'batch', 'migration_time'],
  requiredForInsert: [],
  primaryKey: 'id',
  foreignKeys: {},
  $type: null as unknown as KnexMigrations,
  $input: null as unknown as KnexMigrationsInput
} as const;

// Table knex_migrations_lock
export interface KnexMigrationsLock {
  index: number;
  is_locked: number | null;
}
export interface KnexMigrationsLockInput {
  index?: number;
  is_locked?: number | null;
}
const knex_migrations_lock = {
  tableName: 'knex_migrations_lock',
  columns: ['index', 'is_locked'],
  requiredForInsert: [],
  primaryKey: 'index',
  foreignKeys: {},
  $type: null as unknown as KnexMigrationsLock,
  $input: null as unknown as KnexMigrationsLockInput
} as const;

// Table signing_keys
export interface SigningKeys {
  id: string;
  /** Public key in PEM format */
  public_key: string;
  /** Private key in PEM format */
  private_key: string;
  /** x component of the public key */
  x_component: string;
  /** y component of the public key */
  y_component: string;
  /** Lifetime of the key, long lived keys will be used for long lived tokens */
  lifetime: signing_key_lifetime_type;
  created_at: Date;
}
export interface SigningKeysInput {
  id: string;
  /** Public key in PEM format */
  public_key: string;
  /** Private key in PEM format */
  private_key: string;
  /** x component of the public key */
  x_component: string;
  /** y component of the public key */
  y_component: string;
  /** Lifetime of the key, long lived keys will be used for long lived tokens */
  lifetime: signing_key_lifetime_type;
  created_at?: Date;
}
const signing_keys = {
  tableName: 'signing_keys',
  columns: ['id', 'public_key', 'private_key', 'x_component', 'y_component', 'lifetime', 'created_at'],
  requiredForInsert: ['id', 'public_key', 'private_key', 'x_component', 'y_component', 'lifetime'],
  primaryKey: 'id',
  foreignKeys: {},
  $type: null as unknown as SigningKeys,
  $input: null as unknown as SigningKeysInput
} as const;

// Table signing_keys_logs
export interface SigningKeysLogs {
  id: string;
  /** Signing key that was affected */
  signing_key_id: string | null;
  action: signing_key_log_action;
  /** Status of the request */
  status: signing_key_log_status | null;
  /** User that performed the action */
  user_id: string;
  /** IP address of the request */
  ip_address: string;
  /** User agent of the request */
  user_agent: string;
  /** Error message if the request failed */
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
}
export interface SigningKeysLogsInput {
  id: string;
  /** Signing key that was affected */
  signing_key_id?: string | null;
  action: signing_key_log_action;
  /** Status of the request */
  status?: signing_key_log_status | null;
  /** User that performed the action */
  user_id: string;
  /** IP address of the request */
  ip_address: string;
  /** User agent of the request */
  user_agent: string;
  /** Error message if the request failed */
  error_message?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
const signing_keys_logs = {
  tableName: 'signing_keys_logs',
  columns: ['id', 'signing_key_id', 'action', 'status', 'user_id', 'ip_address', 'user_agent', 'error_message', 'created_at', 'updated_at'],
  requiredForInsert: ['id', 'action', 'user_id', 'ip_address', 'user_agent'],
  primaryKey: 'id',
  foreignKeys: {},
  $type: null as unknown as SigningKeysLogs,
  $input: null as unknown as SigningKeysLogsInput
} as const;


export interface TableTypes {
  knex_migrations: {
    select: KnexMigrations;
    input: KnexMigrationsInput;
  };
  knex_migrations_lock: {
    select: KnexMigrationsLock;
    input: KnexMigrationsLockInput;
  };
  signing_keys: {
    select: SigningKeys;
    input: SigningKeysInput;
  };
  signing_keys_logs: {
    select: SigningKeysLogs;
    input: SigningKeysLogsInput;
  };
}

export const tables = {
  knex_migrations,
  knex_migrations_lock,
  signing_keys,
  signing_keys_logs,
}
