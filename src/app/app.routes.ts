import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => 
          import('./features/dashboard/dashboard.routes').then(r => r.dashboardRoutes),
        title: '儀表板'
      },
      {
        path: 'employees',
        loadChildren: () => 
          import('./features/employee/employee.routes').then(r => r.employeeRoutes),
        title: '員工管理'
      },
      {
        path: 'departments',
        redirectTo: '/dashboard', // 暫時導向儀表板，等待部門功能完成
        pathMatch: 'full'
      },
      {
        path: 'courses',
        redirectTo: '/dashboard', // 暫時導向儀表板，等待課程功能完成
        pathMatch: 'full'
      },
      {
        path: 'enrollments',
        redirectTo: '/dashboard', // 暫時導向儀表板，等待註冊功能完成
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
