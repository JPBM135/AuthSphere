import process from 'node:process';
import Logger from '../../infra/logger/index.js';
import { handleProcessDestroy } from './handleProcessDestroy.js';

export function registerProcessEvents(): void {
	const logger = Logger.getInstance().createChildren('ProcessEvents');

	process.on('SIGINT', async () => {
		logger.warn('Received SIGINT signal', {
			signal: 'SIGINT',
		});
		await handleProcessDestroy();
	});

	process.on('SIGTERM', async () => {
		logger.warn('Received SIGTERM signal', {
			signal: 'SIGTERM',
		});
		await handleProcessDestroy();
	});

	process.on('uncaughtException', async (error) => {
		logger.error('Uncaught exception', error);
		await handleProcessDestroy();
		process.exit(1);
	});

	process.on('unhandledRejection', async (error) => {
		logger.error('Unhandled rejection', error);
		await handleProcessDestroy();
		process.exit(1);
	});
}
