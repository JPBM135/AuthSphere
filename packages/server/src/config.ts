import process from 'node:process';
import type { CorsOptions } from 'cors';
import type { HelmetOptions } from 'helmet';
import { HttpError } from './common/errors/HttpError.js';
import { ErrorCodes } from './common/errors/errorCodes.js';
import { HttpStatusCodes } from './common/response/enums/httpStatusCodes.js';
import { TimeSpan } from './common/timespan/TimeSpan.js';

export enum Environment {
	Development = 'development',
	Homolog = 'homolog',
	Production = 'production',
}

export const CONFIG = Object.freeze({
	APP_NAME: 'AuthSphere',
	NODE_ENV: process.env.NODE_ENV ?? Environment.Development,
	PORT: process.env.PORT ?? 3_000,
	API_URL: process.env.API_URL,
	CLIENT_URL: process.env.CLIENT_URL,
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
		DEFAULT: {
			HOST: process.env.DATABASE_HOST_DEFAULT ?? process.env.DATABASE_HOST,
			USER: process.env.DATABASE_USER_DEFAULT ?? process.env.DATABASE_USER,
			PASSWORD: process.env.DATABASE_PASSWORD_DEFAULT ?? process.env.DATABASE_PASSWORD,
			NAME: process.env.DATABASE_NAME_DEFAULT ?? process.env.DATABASE_NAME,
			PORT: process.env.DATABASE_PORT_DEFAULT ?? process.env.DATABASE_PORT,
		},
		SECURE: {
			HOST: process.env.DATABASE_HOST_SECURE,
			USER: process.env.DATABASE_USER_SECURE,
			PASSWORD: process.env.DATABASE_PASSWORD_SECURE,
			NAME: process.env.DATABASE_NAME_SECURE,
			PORT: process.env.DATABASE_PORT_SECURE,
		},
	},
	EXPRESS: {
		MAX_BODY_SIZE: process.env.EXPRESS_MAX_BODY_SIZE ?? '5mb',
		ALLOWED_ORIGINS: process.env.EXPRESS_ALLOWED_ORIGINS?.split(',') ?? [],
	},
	SNOWFLAKE: {
		EPOCH: 1_733_384_226,
	},
	PASSWORD: {
		ROUNDS: 14,
		ROUNDS_SUPERUSER: 16,
	},
	KEYS: {
		SHORT_LIVED: {
			EXPIRATION: TimeSpan.fromDays(2),
			DELETION: TimeSpan.fromDays(3),
		},
		LONG_LIVED: {
			EXPIRATION: TimeSpan.fromDays(7),
			DELETION: TimeSpan.fromDays(8),
		},
		KEY_SIGN_RATE_LIMIT: {
			IP_AND_USER_ID: {
				REQUESTS: 4, // Two calls for access and refresh tokens
				WINDOW: TimeSpan.fromMinutes(5),
			},
			IP: {
				REQUESTS: 10, // Five calls for access and refresh tokens
				WINDOW: TimeSpan.fromMinutes(1),
			},
		},
	},
	TOKEN: {
		ACCESS: {
			EXPIRATION: TimeSpan.fromDays(1),
		},
		REFRESH: {
			EXPIRATION: TimeSpan.fromDays(30),
		},
		AUTHORIZATION_CODE: {
			EXPIRATION: TimeSpan.fromMinutes(10),
		},
		STATE: {
			EXPIRATION: TimeSpan.fromMinutes(5),
			EXPIRATION_OAUTH_AUTHORIZATION: TimeSpan.fromMinutes(10),
			KEY_LENGTH: 32,
		},
		TOTP: {
			KEY_LENGTH: 32,
		},
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
			callback(
				new HttpError('Origin not allowed', ErrorCodes.CorsNotAllowed, HttpStatusCodes.Forbidden),
				false,
			);
		},
		methods: ['GET', 'POST', 'OPTIONS'], // GraphQL uses POST and OPTIONS, GET is for health checks and JWT key requests
		allowedHeaders: [
			'Apollo-Require-Preflight',
			'x-apollo-operation-name',
			'x-apollo-operation-id',
			'x-sentry-trace',
			'baggage',
			'authorization',
			'content-type',
			'content-length',
			'etag',
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
