import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest-gaurd/guest.guard.js';
import { authGuard } from './core/guards/auth-guard/auth.guard.js';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((l) => l.AuthLayoutComponent),
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.routes),
  },
  {
    path: 'main',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((l) => l.MainLayoutComponent),
    loadChildren: () => import('./layouts/main-layout/main-layout.routes').then((r) => r.routes),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((l) => l.AdminLayoutComponent),
  },
];
