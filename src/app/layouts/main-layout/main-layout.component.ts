import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

/**
 * 主要佈局元件
 * 包含側邊欄導航和主要內容區域
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;
  
  /**
   * 導航選單項目
   */
  readonly navigationItems = [
    {
      label: '儀表板',
      path: '/dashboard',
      icon: '📊'
    },
    {
      label: '員工管理',
      path: '/employees',
      icon: '👥'
    },
    {
      label: '部門管理',
      path: '/departments',
      icon: '🏢'
    },
    {
      label: '課程管理',
      path: '/courses',
      icon: '📚'
    },
    {
      label: '課程註冊',
      path: '/enrollments',
      icon: '🎓'
    }
  ];

  /**
   * 登出
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * 導向角色對應的儀表板
   */
  navigateToRoleDashboard(): void {
    const user = this.user();
    if (user?.role === 'manager') {
      this.router.navigate(['/dashboard/manager']);
    } else if (user?.role === 'employee') {
      this.router.navigate(['/dashboard/employee']);
    } else {
      // 如果角色未知，導向一般儀表板
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * 取得角色顯示名稱
   */
  getRoleDisplayName(): string {
    const role = this.user()?.role;
    return role === 'manager' ? '主管' : '員工';
  }
}
