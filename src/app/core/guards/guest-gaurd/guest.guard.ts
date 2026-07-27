import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../../../features/auth/application/services/user-data.service.js';
import { ToastrService } from 'ngx-toastr';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const userDataService = inject(UserDataService);
  const toaster = inject(ToastrService);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (userDataService._loggedUserData()) {
    toaster.success('Already signedin...', 'Success');
    return router.createUrlTree(['/main']);
  } else {
    return true;
  }
};
