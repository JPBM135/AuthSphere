import { container } from 'tsyringe';
import Logger from '../logger/index.js';
import type { ContainerToken } from './types.js';

const logger = Logger.getInstance().createChildren('container');

export function resolveToken<T>(token: ContainerToken<T>): T {
	try {
		return container.resolve(token.token);
	} catch (error) {
		logger.error(`Failed to resolve token ${token.token.toString()}`);
		throw error;
	}
}
