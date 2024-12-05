import kleur from 'kleur';
import Logger from '../index.js';
import { LoggerLevel, type ILoggerAdapter } from '../types.js';

export class ReadableLoggerAdapter implements ILoggerAdapter {
	public success(prefix: string, message: string, ...args: any[]) {
		console.log(`${kleur.green(this.resolvePrefix(prefix) + 'Success]:')} ${message}`, ...args);
	}

	public info(prefix: string, message: string, ...args: any[]) {
		if (Logger.LOGGER_LEVEL < LoggerLevel.Info) return;
		console.log(`${kleur.blue(this.resolvePrefix(prefix) + 'Info]:')} ${message}`, ...args);
	}

	public debug(prefix: string, message: string, ...args: any[]) {
		if (Logger.LOGGER_LEVEL < LoggerLevel.Debug) return;
		console.log(`${kleur.gray(this.resolvePrefix(prefix) + 'Debug]:')} ${message}`, ...args);
	}

	public warn(prefix: string, message: string, ...args: any[]) {
		console.log(`${kleur.yellow(this.resolvePrefix(prefix) + 'Warn]:')} ${message}`, ...args);
	}

	public error(prefix: string, message: string, ...args: any[]) {
		console.log(`${kleur.red(this.resolvePrefix(prefix) + 'Error]:')} ${message}`, ...args);
	}

	private resolvePrefix(prefix: string) {
		return prefix ? `[${prefix} - ` : '[';
	}
}
