import { assertConfig } from '../../common/assert/assertConfig.js';
import { CONFIG } from '../../config.js';
import { createToken, registerToken } from '../container/createToken.js';
import type { Provider } from '../container/types.js';
import Logger from '../logger/index.js';
import { SnowflakeGenerator } from './snowflakeGenerator.js';

const logger = Logger.getInstance().createChildren('Snowflake');

export const SnowflakeToken = createToken<SnowflakeGenerator>('Snowflake');

export function createSnowflake(): Provider<typeof SnowflakeToken> {
	assertConfig(CONFIG.SNOWFLAKE.EPOCH, 'SNOWFLAKE.EPOCH');

	logger.info('Creating snowflake singleton');

	const snowflakeSingleton = SnowflakeGenerator.getInstance();

	registerToken(SnowflakeToken, snowflakeSingleton);

	logger.success('Snowflake singleton created');

	return snowflakeSingleton;
}
