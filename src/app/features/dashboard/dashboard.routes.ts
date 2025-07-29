import { Routes } from '@angular/router';

/**
 * 儀表板功能路由設定
 */
export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
    title: '儀表板'
  }
];
