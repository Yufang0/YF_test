import { Routes } from '@angular/router';

/**
 * 員工功能路由設定
 * 定義員工管理相關的所有路由
 */
export const employeeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => 
      import('./pages/employee-list/employee-list.component').then(c => c.EmployeeListComponent),
    title: '員工列表'
  },
  {
    path: 'new',
    loadComponent: () => 
      import('./pages/employee-form/employee-form.component').then(c => c.EmployeeFormComponent),
    title: '新增員工'
  },
  {
    path: ':id',
    loadComponent: () => 
      import('./pages/employee-detail/employee-detail.component').then(c => c.EmployeeDetailComponent),
    title: '員工詳細資訊'
  },
  {
    path: ':id/edit',
    loadComponent: () => 
      import('./pages/employee-form/employee-form.component').then(c => c.EmployeeFormComponent),
    title: '編輯員工'
  }
];
