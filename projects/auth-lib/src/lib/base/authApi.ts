import { Observable } from 'rxjs';
import { Register } from '../models/request/register.js';
import { Login } from '../models/response/login.js';
import { LoginReq } from '../models/request/login-req.js';
import { ForgetpasswordReq } from '../models/request/forgetpassword-req.js';
import { ForgetPassword } from '../models/response/forget-password.js';
import { EmailVerify } from '../models/response/email-verify.js';
import { ConfirmEmailReq } from '../models/request/confirm-email-req.js';
import { ConfirmEmail } from '../models/response/confirm-email.js';
import { ResetPaswordReq } from '../models/request/reset-pasword-req.js';

export abstract class AuthApi {
  abstract login(data: LoginReq): Observable<Login>;
  abstract register(data: Register): Observable<Login>;
  abstract forgetPassword(data: ForgetpasswordReq): Observable<ForgetPassword>;
  abstract resetPassword(data: ResetPaswordReq): Observable<ForgetPassword>;
  abstract confirmEmail(data: ConfirmEmailReq): Observable<ConfirmEmail>;
  abstract sendEmailVerification(data: ForgetpasswordReq): Observable<EmailVerify>;
}
