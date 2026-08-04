import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private platformId = inject(PLATFORM_ID);
  private loggedUserData: WritableSignal<{
    token: string;
    user: { email: string; username: string; role: 'ADMIN' | 'USER'; fName: string; lName: string };
  } | null> = signal(null);
  readonly _loggedUserData = this.loggedUserData.asReadonly();
  constructor() {}
  setUserData(
    data: {
      token: string;
      user: {
        email: string;
        username: string;
        role: 'ADMIN' | 'USER';
        fName: string;
        lName: string;
      };
    } | null,
  ) {
    this.loggedUserData.set(data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userData', JSON.stringify(this.loggedUserData()));
    }
  }

  init() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('userData');

    if (userData) {
      this.loggedUserData.set(JSON.parse(userData));
    }
  }

  logout() {
    this.loggedUserData.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userData');
    }
  }
}
