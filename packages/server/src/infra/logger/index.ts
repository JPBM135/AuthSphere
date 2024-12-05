import { inspect } from 'node:util';
import kleur from 'kleur';
import { CONFIG } from '../../config.js';
import { JSONLoggerAdapter } from './adaptors/JsonAdaptor.js';
import { ReadableLoggerAdapter } from './adaptors/ReadableAdaptor.js';
import type { ILoggerAdapter } from './types.js';
import { LoggerLevel } from './types.js';

export * from './types.js';

kleur.enabled = true;

inspect.defaultOptions.depth = 10;
inspect.defaultOptions.maxArrayLength = 100;

export class Logger {
	public static LOGGER_LEVEL = CONFIG.ENVIRONMENT.IS_PRODUCTION
		? LoggerLevel.Info
		: LoggerLevel.Debug;

	public static setLevel(level: LoggerLevel) {
		Logger.LOGGER_LEVEL = level;
	}

	public static DEFAULT_ADAPTER: ILoggerAdapter = CONFIG.ENVIRONMENT.IS_PRODUCTION
		? new JSONLoggerAdapter()
		: new ReadableLoggerAdapter();

	public static setDefaultAdapter(adapter: ILoggerAdapter) {
		Logger.DEFAULT_ADAPTER = adapter;
	}

	public PREFIX = '';

	public static getInstance() {
		return Logger.instance ?? (Logger.instance = new Logger());
	}

	private static instance: Logger | null = null;

	public constructor(prefix?: string) {
		if (prefix) this.PREFIX = prefix;
	}

	public success(message: string, ...args: any[]) {
		Logger.DEFAULT_ADAPTER.success(this.PREFIX, message, ...args);
	}

	public info(message: string, ...args: any[]) {
		Logger.DEFAULT_ADAPTER.info(this.PREFIX, message, ...args);
	}

	public debug(message: string, ...args: any[]) {
		Logger.DEFAULT_ADAPTER.debug(this.PREFIX, message, ...args);
	}

	public warn(message: string, ...args: any[]) {
		Logger.DEFAULT_ADAPTER.warn(this.PREFIX, message, ...args);
	}

	public error(message: string, ...args: any[]) {
		Logger.DEFAULT_ADAPTER.error(this.PREFIX, message, ...args);
	}

	public createChildren(prefix: string) {
		if (!this.PREFIX) return new Logger(prefix);
		return new Logger(`${this.PREFIX}/${prefix}`);
	}
}

export default Logger;
