import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () =>
      import('./presentation/pages/diplomas-list/diplomas-list.component').then(
        (p) => p.DiplomasListComponent,
      ),
  },
  {
    path: ':id/exams',
    loadComponent: () =>
      import('./presentation/pages/diploma-exams/diploma-exams.component').then(
        (p) => p.DiplomaExamsComponent,
      ),
  },
  {
    path: ':id/exams/:examId/questions',
    loadComponent: () =>
      import('./presentation/pages/exam-questions/exam-questions.component').then(
        (p) => p.ExamQuestionsComponent,
      ),
  },
];
