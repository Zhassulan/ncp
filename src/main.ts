/// <reference types="@angular/localize" />

import {enableProdMode, importProvidersFrom, isDevMode, LOCALE_ID} from '@angular/core';
import {environment} from './environments/environment';
import {AUTH_PROVIDERS} from './app/auth/auth.service';
import {AuthGuard} from './app/auth/auth-guard.service';
import {DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MyDateAdapter} from './app/my-date-adapter';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {GlobalHttpInterceptor} from './app/auth/global-http-interceptor.service';
import {bootstrapApplication, BrowserModule, Title} from '@angular/platform-browser';
import {CommonModule, DecimalPipe, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideAnimations} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {FileSaverModule} from 'ngx-filesaver';
import {BreadcrumbModule} from 'xng-breadcrumb';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AppComponent} from './app/app.component';
import localeRu from '@angular/common/locales/ru';
import {provideRouter} from '@angular/router';
import {routes} from './app/settings';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeRu);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(CommonModule, FormsModule, ReactiveFormsModule, BrowserModule, LayoutModule, FileSaverModule,
      BreadcrumbModule, ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      }), MatNativeDateModule),
    AUTH_PROVIDERS,
    AuthGuard,
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: LOCALE_ID, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: MyDateAdapter},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptor,
      multi: true
    },
    Title,
    provideHttpClient(withInterceptorsFromDi()),
    DecimalPipe,
    provideAnimations(),
    provideRouter(routes),
  ]
})
  .catch(err => console.error(err));
