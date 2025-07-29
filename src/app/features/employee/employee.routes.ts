import { Routes } from '@angular/router';

/**
 * 員工功能路由設定
 * 定義員工管理相關的所有路由
 */
export const employeeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'management',
    pathMatch: 'full'
  },
  {
    path: 'management',
    loadComponent: () => 
      import('./pages/employee-management.component').then(c => c.EmployeeManagementComponent),
    title: '員工管理'
  }
];