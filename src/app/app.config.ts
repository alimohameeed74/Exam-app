import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth/auth.interceptor.js';
import { retryInterceptor } from './core/interceptors/retry/retry.interceptor.js';
import { errorInterceptor } from './core/interceptors/error/error.interceptor.js';
import { provideToastr } from 'ngx-toastr';
export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, retryInterceptor, errorInterceptor]),
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideClientHydration(),
  ],
};
