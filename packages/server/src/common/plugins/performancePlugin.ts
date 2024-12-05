import { performance } from 'node:perf_hooks';
import type { ApolloServerPlugin } from '@apollo/server';
import type { AppContext } from '../types/appContext.js';

export default function PerformancePlugin(): ApolloServerPlugin<AppContext> {
	return {
		async requestDidStart() {
			const start = performance.now();
			const requestStartTime = new Date().toISOString();

			return {
				async willSendResponse({ response }) {
					const end = performance.now();
					const duration = end - start;

					response.http?.headers.set('x-request-duration-ms', duration.toPrecision(3));
					response.http?.headers.set('x-request-start-time', requestStartTime);
				},
			};
		},
	};
}
