import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { assertConfig } from '../../common/assert/assertConfig.js';
import { CONFIG, EXPRESS_CONFIG } from '../../config.js';
import { registerRoutes } from '../../routes/router.js';
import { createToken, registerToken } from '../container/createToken.js';
import type { Provider } from '../container/types.js';
import Logger from '../logger/index.js';
import { addRequestStart } from './middlewares/addRequestStart.js';
import { internalErrorHandler } from './middlewares/defaultErrorHandler.js';
import { enforceHttps } from './middlewares/enfoceHttps.js';

const logger = Logger.getInstance().createChildren('Express');

export const ExpressToken = createToken<ReturnType<typeof express>>('Express');

export async function createExpress(): Promise<Provider<typeof ExpressToken>> {
	assertConfig(CONFIG.PORT, 'PORT');
	assertConfig(CONFIG.API_URL, 'API_URL');
	assertConfig(CONFIG.CLIENT_URL, 'CLIENT_URL');
	assertConfig(CONFIG.EXPRESS.MAX_BODY_SIZE, 'EXPRESS.MAX_BODY_SIZE');
	assertConfig(CONFIG.EXPRESS.ALLOWED_ORIGINS, 'EXPRESS.ALLOWED_ORIGINS');

	logger.info('Creating express server');

	const app = express();

	app.use(
		enforceHttps(),
		helmet(EXPRESS_CONFIG.helmet),
		internalErrorHandler(logger),
		cors(EXPRESS_CONFIG.cors),
		express.json({
			limit: CONFIG.EXPRESS.MAX_BODY_SIZE,
			strict: true,
		}),
		addRequestStart(),
	);

	registerToken(ExpressToken, app);

	logger.success('Express server created');

	registerRoutes();

	logger.success('Routes registered');

	return app;
}
