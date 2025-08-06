import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Employee } from '../../models/employee.model';

/**
 * 員工卡片元件
 * 可重用的員工資訊顯示元件
 */
@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="employee-card">
      <div class="employee-info">
        <div class="employee-name">
          <a 
            [routerLink]="['/employees', employee().emp_id]" 
            class="name-link">
            {{ employee().emp_name }}
          </a>
        </div>
        <div class="employee-details">
          <span class="employee-code">編號: {{ employee().emp_code }}</span>
          @if (employee().job_title) {
            <span class="job-title">{{ employee().job_title }}</span>
          }
        </div>
        <div class="employee-status">
          <span 
            class="status-badge"
            [class.active]="employee().is_active"
            [class.inactive]="!employee().is_active">
            {{ employee().is_active ? '在職' : '離職' }}
          </span>
          @if (employee().hire_date) {
            <span class="hire-date">入職: {{ employee().hire_date }}</span>
          }
        </div>
      </div>
      
      <div class="employee-actions">
        <button 
          type="button" 
          class="btn btn-sm btn-outline-primary"
          (click)="onEdit()"
          title="編輯員工">
          <i class="icon-edit"></i>
          編輯
        </button>
        <button 
          type="button" 
          class="btn btn-sm btn-outline-danger"
          (click)="onDelete()"
          [disabled]="!employee().is_active"
          title="刪除員工">
          <i class="icon-trash"></i>
          刪除
        </button>
      </div>
    </div>
  `,
  styles: [`
    .employee-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      transition: box-shadow 0.2s, border-color 0.2s;
    }

    .employee-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-color: #007bff;
    }

    .employee-info {
      flex: 1;
    }

    .employee-name {
      margin-bottom: 8px;
    }

    .name-link {
      font-size: 18px;
      font-weight: 600;
      color: #007bff;
      text-decoration: none;
      transition: color 0.2s;
    }

    .name-link:hover {
      color: #0056b3;
      text-decoration: underline;
    }

    .employee-details {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;
    }

    .employee-code {
      font-weight: 500;
    }

    .job-title {
      color: #495057;
    }

    .employee-status {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .status-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #d1e7dd;
      color: #0f5132;
    }

    .status-badge.inactive {
      background-color: #f8d7da;
      color: #842029;
    }

    .hire-date {
      color: #6c757d;
    }

    .employee-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn {
      padding: 6px 12px;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      text-decoration: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .btn-outline-primary {
      color: #007bff;
      border-color: #007bff;
      background-color: transparent;
    }

    .btn-outline-primary:hover:not(:disabled) {
      background-color: #007bff;
      color: white;
    }

    .btn-outline-danger {
      color: #dc3545;
      border-color: #dc3545;
      background-color: transparent;
    }

    .btn-outline-danger:hover:not(:disabled) {
      background-color: #dc3545;
      color: white;
    }

    /* 圖示 placeholder，您可以根據實際使用的圖示函式庫調整 */
    .icon-edit::before {
      content: '✏️';
    }

    .icon-trash::before {
      content: '🗑️';
    }

    @media (max-width: 768px) {
      .employee-card {
        flex-direction: column;
        gap: 12px;
      }

      .employee-actions {
        align-self: stretch;
        justify-content: flex-end;
      }

      .employee-details {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class EmployeeCardComponent {
  // 輸入屬性
  readonly employee = input.required<Employee>();

  // 輸出事件  
  readonly edit = output<Employee>();
  readonly delete = output<Employee>();

  onEdit(): void {
    this.edit.emit(this.employee());
  }

  onDelete(): void {
    this.delete.emit(this.employee());
  }
}
