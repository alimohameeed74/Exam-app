import { errorInterceptor } from './error.interceptor';
import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

describe('errorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
