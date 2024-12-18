import type { ApplicationConfig } from '@angular/core';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app.routes';
import { provideApolloClient } from './core/providers/provideApollo';
import { provideTranslation } from './core/providers/provideTranslations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideExperimentalZonelessChangeDetection(),
    ...provideApolloClient(),
    ...provideTranslation(),
    provideAnimationsAsync(),
  ],
};
