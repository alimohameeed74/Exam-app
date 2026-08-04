import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../../models/response/error-response.js';
import { inject, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);
  const platformId = inject(PLATFORM_ID);

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

      return throwError(() => error);
    }),
  );
};
