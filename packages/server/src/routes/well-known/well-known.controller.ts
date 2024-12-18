import type { IRouter } from 'express';
import { handleJwks } from './handlers/jwks.js';
import { handleWellKnownConfiguration } from './handlers/openid-configuration.js';

export function registerWellKnownRoutes(router: IRouter) {
	router.get('/:clientId/.well-known/openid-configuration', handleWellKnownConfiguration);
	router.get('/:clientId/.well-known/jwks.json', handleJwks);
}
