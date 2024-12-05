import { container } from 'tsyringe';
import Logger from '../logger/index.js';
import type { ContainerToken } from './types.js';

const logger = Logger.getInstance().createChildren('container');

export function createToken<T>(name: string): ContainerToken<T> {
	logger.debug(`Creating token ${name}`);
	return {
		$type: null as T,
		token: Symbol.for(name),
	};
}

export function registerToken<T>(token: ContainerToken<T>, value: T): void {
	logger.debug(`Registering token ${token.token.toString()}`);
	container.register(token.token, { useValue: value });
}
