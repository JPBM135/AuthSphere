import type { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { type PolymorphicRequest } from '@sentry/node';
import { resolveToken } from '../../infra/container/resolveToken.js';
import { SentryToken } from '../../infra/sentry/createSentry.js';
import type { AppContext } from '../types/appContext.js';

export default function ApolloServerSentryPlugin(): ApolloServerPlugin<AppContext> {
	const sentry = resolveToken(SentryToken);

	return {
		async contextCreationDidFail({ error }) {
			sentry.captureException(error);
		},
		async requestDidStart({ request, contextValue }): Promise<GraphQLRequestListener<AppContext>> {
			if (request.operationName) {
				contextValue.sentrySpan.updateName(request.operationName);
			}

			return {
				async willSendResponse() {
					contextValue.sentrySpan.end();
				},
				async executionDidStart() {
					return {
						willResolveField({ info }) {
							const span = sentry.startInactiveSpan({
								name: `${info.parentType.name}.${info.fieldName}`,
								op: 'resolver',
								parentSpan: contextValue.sentrySpan,
							});

							span.setAttribute('parentType', info.parentType.name);

							return async () => {
								span.end();
							};
						},
					};
				},
				async didEncounterErrors({ request, operation, operationName, errors }) {
					sentry.withScope((scope) => {
						scope.addEventProcessor((event) =>
							sentry.addRequestDataToEvent(event, request as PolymorphicRequest),
						);

						scope.setTags({
							graphql: operation?.operation ?? 'parse_err',
							graphqlName: operationName ?? request.operationName,
						});

						const transactionId = request.http?.headers.get('x-transaction-id');
						if (transactionId) {
							scope.setTransactionName(transactionId);
						}

						for (const error of errors) {
							scope.setTag('kind', operation?.operation ?? 'unnamed operation');
							scope.setExtra('query', request.query);
							scope.setExtra('variables', JSON.stringify(request.variables, null, 2));
							scope.setExtra('errorMessage', error.message);
							scope.setExtra('errorCode', error.extensions?.code);
							scope.setExtra('errorStack', error.stack);
							scope.setExtra('query', request.query);

							if (error.path || error.name !== 'GraphQLError') {
								scope.setExtras({ path: error.path });
								sentry.captureException(error);
							} else {
								scope.setExtras({});
								sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
							}
						}
					});
				},
			};
		},
	};
}
