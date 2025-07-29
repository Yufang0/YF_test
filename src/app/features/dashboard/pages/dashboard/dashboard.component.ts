import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * 儀表板頁面元件
 * 顯示系統概覽和統計資訊
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  // 模擬統計資料
  readonly stats = signal({
    totalEmployees: 156,
    totalDepartments: 8,
    totalCourses: 24,
    totalEnrollments: 342
  });

  // 最近活動資料
  readonly recentActivities = signal([
    {
      id: 1,
      type: 'employee',
      action: '新增員工',
      target: '張小明',
      time: '2 小時前',
      icon: '👤'
    },
    {
      id: 2,
      type: 'enrollment',
      action: '課程註冊',
      target: 'Angular 進階課程',
      time: '4 小時前',
      icon: '🎓'
    },
    {
      id: 3,
      type: 'course',
      action: '新增課程',
      target: 'Vue.js 基礎課程',
      time: '1 天前',
      icon: '📚'
    },
    {
      id: 4,
      type: 'department',
      action: '更新部門',
      target: '資訊部',
      time: '2 天前',
      icon: '🏢'
    }
  ]);

  // 快速連結
  readonly quickLinks = signal([
    {
      title: '新增員工',
      description: '快速新增新員工到系統',
      path: '/employees/new',
      icon: '👥',
      color: 'primary'
    },
    {
      title: '課程管理',
      description: '管理所有可用課程',
      path: '/courses',
      icon: '📚',
      color: 'success'
    },
    {
      title: '註冊管理',
      description: '檢視和管理課程註冊',
      path: '/enrollments',
      icon: '🎓',
      color: 'info'
    },
    {
      title: '部門管理',
      description: '管理組織結構',
      path: '/departments',
      icon: '🏢',
      color: 'warning'
    }
  ]);

  // 計算統計卡片
  readonly statCards = computed(() => [
    {
      title: '員工總數',
      value: this.stats().totalEmployees,
      icon: '👥',
      color: 'primary',
      path: '/employees'
    },
    {
      title: '部門數量',
      value: this.stats().totalDepartments,
      icon: '🏢',
      color: 'success',
      path: '/departments'
    },
    {
      title: '課程總數',
      value: this.stats().totalCourses,
      icon: '📚',
      color: 'info',
      path: '/courses'
    },
    {
      title: '註冊數量',
      value: this.stats().totalEnrollments,
      icon: '🎓',
      color: 'warning',
      path: '/enrollments'
    }
  ]);

  // 獲取當前日期
  getCurrentDate(): string {
    return new Date().toLocaleDateString('zh-TW');
  }
}
