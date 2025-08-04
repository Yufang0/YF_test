import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1 class="dashboard-title">員工工作台</h1>
        <p class="welcome-message">歡迎您，{{ user()?.username }}！</p>
        <p class="role-indicator">您目前以 <strong>員工</strong> 身份登入</p>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>個人資訊</h3>
          <p>檢視和更新個人基本資料</p>
          <button class="btn btn-primary">檢視資料</button>
        </div>

        <div class="dashboard-card">
          <h3>考勤記錄</h3>
          <p>檢視出勤狀況和時數統計</p>
          <button class="btn btn-secondary" disabled>敬請期待</button>
        </div>

        <div class="dashboard-card">
          <h3>薪資查詢</h3>
          <p>檢視薪資明細和相關資訊</p>
          <button class="btn btn-secondary" disabled>敬請期待</button>
        </div>

        <div class="dashboard-card">
          <h3>請假申請</h3>
          <p>提出請假申請和查詢狀態</p>
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
      color: #17a2b8;
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
export class EmployeeDashboardComponent {
  private authService = inject(AuthService);

  user = this.authService.user;

  logout(): void {
    this.authService.logout();
  }
}
