import type { Request, Response, NextFunction } from 'express';
import { CONFIG } from '../../../config.js';

export function enforceHttps(): (req: Request, res: Response, next: NextFunction) => void {
	return (req, res, next) => {
		if (CONFIG.ENVIRONMENT.IS_DEVELOPMENT) {
			next();
			return;
		}

		if (!req.secure || req.headers['x-forwarded-proto'] !== 'https') {
			res.redirect(301, `https://${req.headers.host}${req.url}`);
			return;
		}

		next();
	};
}
