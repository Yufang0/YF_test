import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 登入路由（不需要驗證）
  {
    path: 'login',
    loadChildren: () => 
      import('./features/auth/auth.routes').then(r => r.authRoutes)
  },
  // 主要應用程式路由（需要驗證）
  {
    path: '',
    loadComponent: () => 
      import('./layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [AuthGuard],
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
        canActivate: [AuthGuard],
        title: '儀表板'
      },
      {
        path: 'employees',
        loadChildren: () => 
          import('./features/employee/employee.routes').then(r => r.employeeRoutes),
        canActivate: [AuthGuard],
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
    redirectTo: '/login'
  }
];
