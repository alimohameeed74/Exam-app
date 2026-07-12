import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  constructor() {}
  login(data: any) {}
  createAccount(data: any) {}
  forgetPassword(data: any) {}
}
