import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

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
}
