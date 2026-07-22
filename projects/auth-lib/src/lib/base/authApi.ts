import { Observable } from 'rxjs';
import { Register } from '../models/request/register.js';

export abstract class AuthApi {
  abstract login(data: { username: string; password: string }): Observable<any>;
  abstract register(data: Register): Observable<any>;
  abstract forgetPassword(data: { email: string; redirectUrl: string }): Observable<any>;
  abstract resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any>;
  abstract confirmEmail(data: { email: string; code: string }): Observable<any>;
  abstract sendEmailVerification(email: string): Observable<any>;
}
