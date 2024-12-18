/* eslint-disable promise/prefer-await-to-callbacks */

import { Injectable, Injector } from '@angular/core';
import type { ApolloError } from '@apollo/client/core';
import type { ErrorResponse } from '@apollo/client/link/error';
import { TranslateService } from '@ngx-translate/core';
import { Subject, catchError, distinctUntilChanged, map } from 'rxjs';
import type { MonoTypeOperatorFunction } from 'rxjs';
import { ENVIRONMENT } from '../../../../environments/environment.js';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  public static readonly DEFAULT_ERROR_CATEGORY_PREFIX = {
    DEFAULT: 'DEFAULTS',
    USER_DEFINED: 'USER_DEFINED',
  };

  public static readonly DEFAULT_ERROR_CODES = {
    DEFAULT: 'DEFAULT',
    NETWORK: 'NETWORK',
    UNKNOWN: 'UNKNOWN',
    PERMISSION_DENIED: 'permission_denied',
  };

  private static readonly DEBOUNCE_TIME_MS = 500;

  public resetEmitter$ = new Subject<void>();

  public errorEmitter$ = new Subject<ApolloError | ErrorResponse>();

  public constructor(
    private readonly alertService: AlertService,
    private readonly translateService: TranslateService,
    private readonly injector: Injector,
  ) {
    this.errorEmitter$
      .pipe(
        map((errorEvent) => ({
          data: errorEvent,
          key: Reflect.get(errorEvent, 'message'),
          time: Date.now(),
        })),
        distinctUntilChanged(
          (previousError, currentError) =>
            previousError.key === currentError.key &&
            previousError.time > currentError.time - ErrorHandlerService.DEBOUNCE_TIME_MS,
        ),
        map((errorEvent) => errorEvent.data),
      )
      .subscribe((error) => this.handleError(error));
  }

  public handleError(error: ApolloError | ErrorResponse): void {
    this.alertService.showError(this.resolveErrorMessage(error));
  }

  public createErrorHandler<T>(): MonoTypeOperatorFunction<T> {
    return catchError((error: ApolloError) => {
      console.error(error);
      this.alertService.showError(this.resolveErrorMessage(error));

      return [];
    });
  }

  private resolveErrorMessage(error: ApolloError | ErrorResponse): string {
    if (!error) {
      return this.resolveTranslatedMessage(ErrorHandlerService.DEFAULT_ERROR_CODES.DEFAULT, true);
    }

    if (error.networkError) {
      return this.resolveTranslatedMessage(ErrorHandlerService.DEFAULT_ERROR_CODES.NETWORK, true);
    }

    const message = (error as ApolloError)?.message || error.graphQLErrors?.[0]?.message;

    if (error.graphQLErrors?.length) {
      const errorCodes = error.graphQLErrors.map(
        (graphQLError) => graphQLError.extensions?.['code'],
      );

      const translatedErrorMessage = this.resolveTranslatedMessage(
        (errorCodes[0] as string) || ErrorHandlerService.DEFAULT_ERROR_CODES.DEFAULT,
      );

      if (ENVIRONMENT.IS_PRODUCTION && !translatedErrorMessage) {
        return this.resolveTranslatedMessage(ErrorHandlerService.DEFAULT_ERROR_CODES.DEFAULT, true);
      }

      return (
        translatedErrorMessage ??
        this.computeDefaultErrorMessage(message ?? 'UNKNOWN', errorCodes[0])
      );
    }

    return ENVIRONMENT.IS_PRODUCTION
      ? this.resolveTranslatedMessage(ErrorHandlerService.DEFAULT_ERROR_CODES.DEFAULT, true)
      : this.computeDefaultErrorMessage(message ?? 'UNKNOWN', 'UNKNOWN');
  }

  private computeDefaultErrorMessage(message: string, errorCode: unknown): string {
    const parsedCode =
      typeof errorCode === 'string' ? errorCode : (errorCode as { code: string })?.code;

    return `Erro desconhecido: ${message} (${parsedCode ?? 'UNKNOWN'})`;
  }

  private resolveTranslatedMessage(errorCode: string, isDefault: true): string;
  private resolveTranslatedMessage(errorCode: string, isDefault?: false): string | null;
  private resolveTranslatedMessage(errorCode: string, isDefault = false): string | null {
    const key = [
      'ERROR_HANDLER',
      isDefault
        ? ErrorHandlerService.DEFAULT_ERROR_CATEGORY_PREFIX.DEFAULT
        : ErrorHandlerService.DEFAULT_ERROR_CATEGORY_PREFIX.USER_DEFINED,
      errorCode,
    ].join('.');

    const value = this.translateService.instant(key);

    if (value === key && !isDefault) {
      return null;
    }

    return value;
  }
}
