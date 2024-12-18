import type { RequestHandler } from 'express';

export function addRequestStart(): RequestHandler {
	return (_, res, next) => {
		res.setHeader('x-request-start', new Date().toISOString());
		next();
	};
}
