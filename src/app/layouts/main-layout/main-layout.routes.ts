import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'diplomas', pathMatch: 'full' },
  {
    path: 'diplomas',
    loadChildren: () => import('../../features/diplomas/diplomas.routes').then((r) => r.routes),
  },
  {
    path: 'account',
    loadComponent: () =>
      import('../../features/account/presentation/layout/account-layout/account-layout.component').then(
        (p) => p.AccountLayoutComponent,
      ),
    loadChildren: () => import('../../features/account/account.routes').then((r) => r.routes),
  },
];
