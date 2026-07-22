import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../../../features/auth/application/services/user-data.service.js';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userDataService = inject(UserDataService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return router.createUrlTree(['/auth']);
  }

  return userDataService._loggedUserData ? true : router.createUrlTree(['/auth']);
};
