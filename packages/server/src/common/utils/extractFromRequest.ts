import type { Request } from 'express';

export function extractIpFromRequest(req: Request<any, any, any>) {
	const ip = req.headers['x-forwarded-for'] ?? req.ip;

	if (!ip) {
		return '0.0.0.0';
	}

	if (typeof ip === 'string') {
		return ip.split(',')[0] ?? '0.0.0.0';
	}

	return ip[0] ?? '0.0.0.0';
}

export function extractUserAgentFromRequest(req: Request<any, any, any>) {
	return req.headers['user-agent'] ?? 'Unknown';
}
