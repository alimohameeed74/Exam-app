import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./presentation/pages/profile/profile.component').then((p) => p.ProfileComponent),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./presentation/pages/change-password/change-password.component').then(
        (p) => p.ChangePasswordComponent,
      ),
  },
];
