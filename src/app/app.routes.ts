import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((l) => l.AuthLayoutComponent),
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((l) => l.MainLayoutComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((l) => l.AdminLayoutComponent),
  },
];
