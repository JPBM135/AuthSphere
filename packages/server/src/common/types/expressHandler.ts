import type { RequestHandler } from 'express';

export type ExpressRequest = Parameters<RequestHandler>[0];
export type ExpressResponse = Parameters<RequestHandler>[1];
