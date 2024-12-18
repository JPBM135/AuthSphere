import type { Provider } from '@angular/core';
import { inject } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ENVIRONMENT } from '../../../environments/environment';
import { ErrorHandlerService } from '../services/errors/error-handler.service';

export function provideApolloClient(): Provider[] {
  return [
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const errorHandlerService = inject(ErrorHandlerService);
      const http = httpLink.create({
        uri: ENVIRONMENT.API.GRAPHQL,
      });

      const errorLink = onError((data) => {
        errorHandlerService.errorEmitter$.next(data);
      });

      const link = errorLink.concat(http);

      return {
        cache: new InMemoryCache(),
        link,
        defaultOptions: {
          query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },
          watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },
          mutate: {
            errorPolicy: 'all',
          },
        },
      };
    }),
  ];
}
