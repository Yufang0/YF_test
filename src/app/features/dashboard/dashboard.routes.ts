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
  },
  {
    path: 'manager',
    loadComponent: () => 
      import('./pages/manager-dashboard/manager-dashboard.component').then(c => c.ManagerDashboardComponent),
    title: '主管儀表板',
    data: { role: 'manager' }
  },
  {
    path: 'employee',
    loadComponent: () => 
      import('./pages/employee-dashboard/employee-dashboard.component').then(c => c.EmployeeDashboardComponent),
    title: '員工工作台',
    data: { role: 'employee' }
  }
];
