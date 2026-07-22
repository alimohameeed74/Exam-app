import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private platformId = inject(PLATFORM_ID);
  private loggedUserData: WritableSignal<{
    token: string;
    user: { email: string; username: string; role: 'ADMIN' | 'USER' };
  } | null> = signal(null);
  readonly _loggedUserData = this.loggedUserData.asReadonly();
  constructor() {}
  setUserData(
    data: {
      token: string;
      user: { email: string; username: string; role: 'ADMIN' | 'USER' };
    } | null,
  ) {
    this.loggedUserData.set(data);
    if (!isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userData', JSON.stringify(this.loggedUserData()));
    }
  }
}
