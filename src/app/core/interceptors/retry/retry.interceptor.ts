import { HttpInterceptorFn } from '@angular/common/http';
import { retry } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('register')) {
    return next(req);
  } else {
    return next(req).pipe(retry(3));
  }
};
