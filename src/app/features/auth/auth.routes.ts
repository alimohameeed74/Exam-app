import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  {
    path: 'signin',
    loadComponent: () =>
      import('./presentation/pages/login/login.component').then((p) => p.LoginComponent),
  },
  {
    path: 'create-account',
    loadComponent: () =>
      import('./presentation/pages/create-account/create-account.component').then(
        (p) => p.CreateAccountComponent,
      ),
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./presentation/pages/forget-password/forget-password.component').then(
        (p) => p.ForgetPasswordComponent,
      ),
  },
];
