import 'reflect-metadata';
import { registerProcessEvents } from './common/handleProcessDestroy/registerProcessEvents.js';
import { CONFIG } from './config.js';
import { createApollo } from './infra/apollo/createApollo.js';
import { createDatabase } from './infra/database/createDatabase.js';
import { createExpress } from './infra/express/createExpress.js';
import Logger from './infra/logger/index.js';
import { createSentry } from './infra/sentry/createSentry.js';
import { createSnowflake } from './infra/snowflake/createSnowflake.js';

const logger = Logger.getInstance().createChildren('Server');

logger.info('Starting server');
createSentry();
await createDatabase();
const app = await createExpress();
await createApollo();
createSnowflake();
logger.info('Server setup complete');

app.listen(CONFIG.PORT, () => {
	const logger = Logger.getInstance().createChildren('Server');
	logger.success(`Server listening on port ${CONFIG.PORT}`);
});

registerProcessEvents();

export default app;