import type { Response } from 'express';
import type { GraphQLError } from 'graphql';
import { CONFIG } from '../../config.js';
import { ErrorCodes } from '../errors/errorCodes.js';
import { CacheDuration } from './enums/cacheDuration.js';
import { HttpStatusCodes } from './enums/httpStatusCodes.js';
import { ResponseFormat } from './enums/responseFormat.js';

export interface SendResponseError {
	code: ErrorCodes;
	message: string;
	statusCode?: HttpStatusCodes;
}

export class SendResponseBuilder<T> {
	public static create<T>(response: Response): SendResponseBuilder<T> {
		return new SendResponseBuilder(response);
	}

	private readonly response: Response;

	private status: number = HttpStatusCodes.Ok;

	private data: T | null = null;

	private error: Error | SendResponseError | null = null;

	private cacheDuration: CacheDuration = CacheDuration.None;

	private headers: Record<string, string> = {};

	private constructor(response: Response) {
		this.response = response;
	}

	public withStatus(status: number): this {
		this.status = status;
		return this;
	}

	public withData(data: T): this {
		this.data = data;
		return this;
	}

	public withError(error: Error | GraphQLError | SendResponseError): this {
		if ((error as SendResponseError).statusCode && !this.status) {
			this.status = (error as SendResponseError).statusCode!;
		}

		this.error = error;
		return this;
	}

	public withCacheDuration(cacheDuration: CacheDuration): this {
		this.cacheDuration = cacheDuration;
		return this;
	}

	public withHeader(name: string, value: string): this {
		if (name.toLowerCase() === 'cache-control') {
			throw new RangeError('Cache-Control header is reserved and cannot be set manually');
		}

		this.headers[name] = value;
		return this;
	}

	public send(format = ResponseFormat.GraphQlSpecCompliant): void {
		if (this.status === HttpStatusCodes.NoContent) {
			this.response.status(this.status).end();
			return;
		}

		if (this.cacheDuration !== CacheDuration.None) {
			this.response.set('Cache-Control', `public, max-age=${this.cacheDuration}`);
		}

		if (format === ResponseFormat.DataOnly) {
			this.response.status(this.status).json(this.data);
			return;
		}

		const extensions: Record<string, unknown> = {
			success: this.status >= 200 && this.status < 300,
		};

		if (this.cacheDuration !== CacheDuration.None) {
			extensions.cacheDuration = this.cacheDuration;
		}

		this.response.status(this.status).json({
			data: this.data,
			error: this.formatErrorForResponse(),
			extensions,
		});
	}

	private formatErrorForResponse() {
		if (!this.error) {
			return null;
		}

		return [
			{
				message: this.error.message,
				stack: CONFIG.ENVIRONMENT.IS_PRODUCTION ? null : (this.error as Error).stack,
				extensions: {
					code: (this.error as SendResponseError)?.code ?? ErrorCodes.UnknownError,
				},
			},
		];
	}
}
