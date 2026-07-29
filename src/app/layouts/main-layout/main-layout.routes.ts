import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'diplomas', pathMatch: 'full' },
  {
    path: 'diplomas',
    loadChildren: () => import('../../features/diplomas/diplomas.routes').then((r) => r.routes),
  },
  // This code was prepared for the future task.
  //    {
  //     path: 'account-settings',
  //     loadComponent: () =>
  //       import('../../features/account-settings/presentation/pages/account-settings/account-settings.component').then(
  //         (p) => p.AccountSettinhComponent,
  //       ),
  //   },
];
