import type { ILoggerAdapter } from '../types.js';

export class JSONLoggerAdapter implements ILoggerAdapter {
	public success(prefix: string, message: string, ...args: any[]) {
		console.log(
			JSON.stringify({
				type: 'success',
				prefix,
				message,
				args,
			}),
		);
	}

	public info(prefix: string, message: string, ...args: any[]) {
		console.log(
			JSON.stringify({
				type: 'info',
				prefix,
				message,
				args,
			}),
		);
	}

	public debug(prefix: string, message: string, ...args: any[]) {
		console.log(
			JSON.stringify({
				type: 'debug',
				prefix,
				message,
				args,
			}),
		);
	}

	public warn(prefix: string, message: string, ...args: any[]) {
		console.log(
			JSON.stringify({
				type: 'warn',
				prefix,
				message,
				args,
			}),
		);
	}

	public error(prefix: string, message: string, ...args: any[]) {
		console.log(
			JSON.stringify({
				type: 'error',
				prefix,
				message,
				args,
			}),
		);
	}
}
