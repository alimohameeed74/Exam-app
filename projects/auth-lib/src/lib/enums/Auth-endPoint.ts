const apiURL = 'https://exam-app.elevate-bootcamp.cloud/api';
export abstract class AuthEndPoint {
  static readonly LOGIN = `${apiURL}/auth/login`;
  static readonly REGISTER = `${apiURL}/auth/register`;
  static readonly FORGET_PASSWORD = `${apiURL}/auth/forgot-password`;
  static readonly RESET_PASSWORD = `${apiURL}/auth/reset-password`;
  static readonly CONFIRM_EMAIL = `${apiURL}/auth/confirm-email-verification`;
  static readonly SEND_EMAIL_VERIFICATION = `${apiURL}/auth/send-email-verification`;
}
