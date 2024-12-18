import { ErrorCodes } from '../common/errors/errorCodes.js';
import { HttpStatusCodes } from '../common/response/enums/httpStatusCodes.js';
import { SendResponseBuilder } from '../common/response/sendResponse.js';
import { resolveToken } from '../infra/container/resolveToken.js';
import { ExpressToken } from '../infra/express/createExpress.js';
import Logger from '../infra/logger/index.js';
import { registerGraphqlRoutes } from './graphql/graphql.controller.js';
import { registerWellKnownRoutes } from './well-known/well-known.controller.js';

const logger = Logger.getInstance().createChildren('Router');

export function registerRoutes() {
	const app = resolveToken(ExpressToken);

	registerWellKnownRoutes(app);
	logger.info('Registered Well Known routes');

	// Apollo server
	registerGraphqlRoutes(app);
	logger.info('Registered Apollo server routes');

	// Default 404 handler
	app.use((_, res) => {
		SendResponseBuilder.create(res)
			.withStatus(HttpStatusCodes.NotFound)
			.withError({ code: ErrorCodes.RouteNotFound, message: 'Not found' })
			.send();
	});
	logger.info('Registered default 404 handler');
}
