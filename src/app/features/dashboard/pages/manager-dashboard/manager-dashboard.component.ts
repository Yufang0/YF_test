import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1 class="dashboard-title">主管儀表板</h1>
        <p class="welcome-message">歡迎您，{{ user()?.username }}！</p>
        <p class="role-indicator">您目前以 <strong>主管</strong> 身份登入</p>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>員工管理</h3>
          <p>管理所有員工資訊和權限</p>
          <a href="/employees" class="btn btn-primary">進入管理</a>
        </div>

        <div class="dashboard-card">
          <h3>部門管理</h3>
          <p>管理部門架構和資訊</p>
          <a href="/departments" class="btn btn-primary">進入管理</a>
        </div>

        <div class="dashboard-card">
          <h3>系統報表</h3>
          <p>檢視系統使用統計報表</p>
          <button class="btn btn-secondary" disabled>敬請期待</button>
        </div>

        <div class="dashboard-card">
          <h3>權限設定</h3>
          <p>管理使用者權限和角色</p>
          <button class="btn btn-secondary" disabled>敬請期待</button>
        </div>
      </div>

      <div class="logout-section">
        <button (click)="logout()" class="btn btn-outline">登出</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-title {
      font-size: 2.5rem;
      color: #007acc;
      margin-bottom: 1rem;
    }

    .welcome-message {
      font-size: 1.2rem;
      color: #6c757d;
      margin-bottom: 0.5rem;
    }

    .role-indicator {
      color: #28a745;
      font-weight: 500;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid #dee2e6;
    }

    .dashboard-card h3 {
      color: #212529;
      margin-bottom: 1rem;
    }

    .dashboard-card p {
      color: #6c757d;
      margin-bottom: 1.5rem;
    }

    .logout-section {
      text-align: center;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #007acc;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid #007acc;
      color: #007acc;
    }

    .btn-outline:hover {
      background: #007acc;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ManagerDashboardComponent {
  private authService = inject(AuthService);

  user = this.authService.user;

  logout(): void {
    this.authService.logout();
  }
}
