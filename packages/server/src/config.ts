import process from 'node:process';
import type { CorsOptions } from 'cors';
import type { HelmetOptions } from 'helmet';
import { TimeSpan } from './common/timespan/TimeSpan.js';

export enum Environment {
	Development = 'development',
	Homolog = 'homolog',
	Production = 'production',
}

export const CONFIG = Object.freeze({
	NODE_ENV: process.env.NODE_ENV ?? Environment.Development,
	PORT: process.env.PORT ?? 3_000,
	ENVIRONMENT: {
		IS_DEVELOPMENT: process.env.NODE_ENV === Environment.Development,
		IS_HOMOLOG: process.env.NODE_ENV === Environment.Homolog,
		IS_PRODUCTION: process.env.NODE_ENV === Environment.Production,
	},
	SENTRY: {
		DSN: process.env.SENTRY_DSN,
		REPLAY_AND_SAMPLE_RATE: 0.01,
	},
	DATABASE: {
		HOST: process.env.DATABASE_HOST,
		USER: process.env.DATABASE_USER,
		PASSWORD: process.env.DATABASE_PASSWORD,
		NAME: process.env.DATABASE_NAME,
		PORT: process.env.DATABASE_PORT ?? 5_432,
	},
	EXPRESS: {
		MAX_BODY_SIZE: process.env.EXPRESS_MAX_BODY_SIZE ?? '5mb',
		ALLOWED_ORIGINS: process.env.EXPRESS_ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000'],
	},
	SNOWFLAKE: {
		EPOCH: 1_733_384_226,
	},
});

export const EXPRESS_CONFIG: Readonly<{
	cors: CorsOptions;
	helmet: HelmetOptions;
}> = {
	cors: {
		// eslint-disable-next-line promise/prefer-await-to-callbacks
		origin: (origin, callback) => {
			const allowedOrigins = CONFIG.EXPRESS.ALLOWED_ORIGINS;
			if (!origin || allowedOrigins.includes(origin)) {
				// eslint-disable-next-line promise/prefer-await-to-callbacks
				callback(null, true);
				return;
			}

			// eslint-disable-next-line promise/prefer-await-to-callbacks
			callback(new Error('Not allowed by CORS'));
		},
		methods: ['GET', 'POST', 'OPTIONS'], // GraphQL uses POST and OPTIONS, GET is for health checks and JWT key requests
		allowedHeaders: [
			'Apollo-Require-Preflight',
			'x-apollo-operation-name',
			'x-apollo-operation-id',
			'x-sentry-trace',
			'baggage',
		],
		exposedHeaders: ['Authorization', 'Content-Type', 'Content-Length', 'ETag'],
		credentials: true, // Allow cookies
		optionsSuccessStatus: 204, // For older browsers
	},
	helmet: {
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'"],
				objectSrc: ["'none'"],
				upgradeInsecureRequests: [],
			},
		},
		frameguard: { action: 'deny' }, // Prevent clickjacking
		xssFilter: true, // Enable XSS protection
		noSniff: true, // Prevent MIME sniffing
		hidePoweredBy: true, // Hide 'X-Powered-By' header
		hsts: {
			// Enforce HTTPS
			maxAge: TimeSpan.fromDays(365).milliseconds(), // Enforce HTTPS for 1 year
			includeSubDomains: true,
			preload: true,
		},
		referrerPolicy: { policy: 'no-referrer' }, // Prevent sensitive referrer information
		crossOriginEmbedderPolicy: true, // For COEP
	},
};
