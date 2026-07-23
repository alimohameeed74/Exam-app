import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../../../features/auth/application/services/user-data.service.js';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userDataService = inject(UserDataService);
  const platformId = inject(PLATFORM_ID);
  const toaster = inject(ToastrService);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (userDataService._loggedUserData()) {
    return true;
  } else {
    toaster.error('Please signin first', 'Access Denied');
    return router.createUrlTree(['/auth']);
  }
};
