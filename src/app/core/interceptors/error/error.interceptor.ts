import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../../models/response/error-response.js';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: any) => {
      const error: ErrorResponse = {
        code: err.code,
        status: err.status,
        message: err.message,
      };
      return throwError(() => error);
    }),
  );
};
