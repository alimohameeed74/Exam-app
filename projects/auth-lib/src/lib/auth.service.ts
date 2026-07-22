import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthApi } from './base/authApi.js';
import { map, Observable } from 'rxjs';
import { AuthEndPoint } from './enums/Auth-endPoint.js';
import { Register } from './models/request/register.js';
import { Login } from './models/response/login.js';
import { ApiResponse } from './models/response/api-response.js';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthApi {
  private httpClient = inject(HttpClient);
  login(data: { username: string; password: string }): Observable<Login> {
    return this.httpClient
      .post<ApiResponse<Login>>(AuthEndPoint.LOGIN, data)
      .pipe(map((res) => res.payload));
  }
  register(data: Register): Observable<Login> {
    return this.httpClient.post<Login>(AuthEndPoint.REGISTER, data);
  }
  forgetPassword(data: { email: string; redirectUrl: string }): Observable<any> {
    return this.httpClient.post(AuthEndPoint.FORGET_PASSWORD, data);
  }
  sendEmailVerification(data: { email: string }): Observable<{ message: string; code: string }> {
    return this.httpClient.post<{ message: string; code: string }>(
      AuthEndPoint.SEND_EMAIL_VERIFICATION,
      data,
    );
  }
  confirmEmail(data: { email: string; code: string }): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(AuthEndPoint.CONFIRM_EMAIL, data);
  }
  resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.httpClient.post(AuthEndPoint.RESET_PASSWORD, data);
  }
}
