import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../../models/response/error-response.js';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);
  return next(req).pipe(
    catchError((err: any) => {
      const error: ErrorResponse = {
        code: err.error.code,
        status: err.error.status,
        message: err.error.message,
      };
      toaster.error(error.message, 'Error');
      return throwError(() => error);
    }),
  );
};
