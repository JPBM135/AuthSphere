import type { CONFIG } from '../../config.js';
import Logger from '../../infra/logger/index.js';
import type { Leaves } from '../types/paths.js';

export type ConfigPaths = Leaves<typeof CONFIG>;

const logger = Logger.getInstance().createChildren('assertConfig');

export function assertConfig<T>(
	value: T,
	key: ConfigPaths,
	checkOnlyUndefined = false,
): asserts value is NonNullable<T> {
	if ((!checkOnlyUndefined && !value) || (checkOnlyUndefined && value === undefined)) {
		logger.error(`Config key "${key}" must be defined`);
		throw new ReferenceError(`Config key "${key}" must be defined`);
	}
}
