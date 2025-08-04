import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/login/login.component').then(c => c.LoginComponent),
    title: '登入'
  }
];
