import { UserData } from './../../../features/account/domian/models/response/user-data';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../../models/response/error-response.js';
import { inject, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { UserDataService } from '../../../features/auth/application/services/user-data.service.js';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const userDataService = inject(UserDataService);
  return next(req).pipe(
    catchError((err: any) => {
      const error: ErrorResponse = {
        code: err.error.code,
        status: err.error.status,
        message: err.error.message,
      };

      if (isPlatformBrowser(platformId)) {
        toaster.error(error.message, 'Error');
      }
      if (
        error.code === 401 &&
        (error.message === 'Invalid or expired token.' || error.message === 'No token provided.')
      ) {
        userDataService.logout();
        router.navigate(['/auth']);
      }

      return throwError(() => error);
    }),
  );
};
