import { Observable } from 'rxjs';
import { Register } from '../models/request/register.js';
import { Login } from '../models/response/login.js';

export abstract class AuthApi {
  abstract login(data: { username: string; password: string }): Observable<Login>;
  abstract register(data: Register): Observable<Login>;
  abstract forgetPassword(data: { email: string }): Observable<any>;
  abstract resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any>;
  abstract confirmEmail(data: { email: string; code: string }): Observable<{ message: string }>;
  abstract sendEmailVerification(data: {
    email: string;
  }): Observable<{ message: string; code: string }>;
}
