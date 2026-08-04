import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Login } from '../../../features/auth/domain/models/response/login.js';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId) && !req.url.includes('auth')) {
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
      const userData: Login = JSON.parse(userDataString);
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
    }
  }
  return next(req);
};
