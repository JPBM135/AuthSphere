import type { IRouter } from 'express';
import { handleOAuthAuthorize } from './handlers/authorize.js';

export function registerOAuthRoutes(app: IRouter): void {
	app.get('/oauth/authorize', handleOAuthAuthorize);

	// app.post('/oauth/token', (req, res) => {
	// 	res.send('OAuth token');
	// });

	// app.get('/oauth/userinfo', (req, res) => {
	// 	res.send('OAuth userinfo');
	// });
}
