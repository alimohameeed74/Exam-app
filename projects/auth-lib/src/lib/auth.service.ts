import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthApi } from './base/authApi.js';
import { map, Observable } from 'rxjs';
import { AuthEndPoint } from './enums/Auth-endPoint.js';
import { Register } from './models/request/register.js';
import { Login } from './models/response/login.js';
import { ApiResponse } from './models/response/api-response.js';
import { LoginReq } from './models/request/login-req.js';
import { ForgetpasswordReq } from './models/request/forgetpassword-req.js';
import { ForgetPassword } from './models/response/forget-password.js';
import { EmailVerify } from './models/response/email-verify.js';
import { ConfirmEmail } from './models/response/confirm-email.js';
import { ConfirmEmailReq } from './models/request/confirm-email-req.js';
import { ResetPaswordReq } from './models/request/reset-pasword-req.js';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends AuthApi {
  private httpClient = inject(HttpClient);
  login(data: LoginReq): Observable<Login> {
    return this.httpClient
      .post<ApiResponse<Login>>(AuthEndPoint.LOGIN, data)
      .pipe(map((res) => res.payload));
  }
  register(data: Register): Observable<Login> {
    return this.httpClient
      .post<ApiResponse<Login>>(AuthEndPoint.REGISTER, data)
      .pipe(map((res) => res.payload));
  }
  forgetPassword(data: ForgetpasswordReq): Observable<ForgetPassword> {
    return this.httpClient.post<ForgetPassword>(AuthEndPoint.FORGET_PASSWORD, data);
  }
  sendEmailVerification(data: ForgetpasswordReq): Observable<EmailVerify> {
    return this.httpClient.post<EmailVerify>(AuthEndPoint.SEND_EMAIL_VERIFICATION, data);
  }
  confirmEmail(data: ConfirmEmailReq): Observable<ConfirmEmail> {
    return this.httpClient.post<ConfirmEmail>(AuthEndPoint.CONFIRM_EMAIL, data);
  }
  resetPassword(data: ResetPaswordReq): Observable<ForgetPassword> {
    return this.httpClient.post<ForgetPassword>(AuthEndPoint.RESET_PASSWORD, data);
  }
}
