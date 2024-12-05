import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { assertConfig } from '../../common/assertConfig/assertConfig.js';
import { CONFIG } from '../../config.js';
import { createToken, registerToken } from '../container/createToken.js';
import type { Provider } from '../container/types.js';
import Logger from '../logger/index.js';

const logger = Logger.getInstance().createChildren('Express');

export const ExpressToken = createToken<ReturnType<typeof express>>('Express');

export async function createExpress(): Promise<Provider<typeof ExpressToken>> {
	assertConfig(CONFIG.EXPRESS.MAX_BODY_SIZE, 'EXPRESS.MAX_BODY_SIZE');

	logger.info('Creating express server');

	const app = express();

	app.use(helmet());
	app.use(cors());
	app.use(
		express.json({
			limit: CONFIG.EXPRESS.MAX_BODY_SIZE,
			strict: true,
		}),
	);

	registerToken(ExpressToken, app);

	logger.success('Express server created');

	return app;
}
