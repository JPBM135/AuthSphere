import type { EnvironmentProviders, Provider } from '@angular/core';
import { importProvidersFrom, inject, provideEnvironmentInitializer } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationLoaderService } from '../services/translation/translation.service';

export function provideTranslation(): (EnvironmentProviders | Provider)[] {
  return [
    provideEnvironmentInitializer(() => inject(TranslationLoaderService)),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en-US',
        useDefaultLang: true,
      }),
    ),
  ];
}
