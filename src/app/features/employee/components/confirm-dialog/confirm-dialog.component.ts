import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

/**
 * 可重用的確認對話框元件
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show()) {
      <div 
        class="modal-backdrop" 
        (click)="onCancel()"
        (keydown.escape)="onCancel()"
        tabindex="0"
        role="dialog"
        aria-modal="true">
        <div 
          class="modal-dialog" 
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
          role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ title() }}</h5>
              <button 
                type="button" 
                class="btn-close" 
                (click)="onCancel()"
                aria-label="關閉">
                ×
              </button>
            </div>
            <div class="modal-body">
              <p>{{ message() }}</p>
            </div>
            <div class="modal-footer">
              <button 
                type="button" 
                class="btn btn-secondary" 
                (click)="onCancel()">
                {{ cancelText() }}
              </button>
              <button 
                type="button" 
                class="btn"
                [class.btn-danger]="type() === 'danger'"
                [class.btn-warning]="type() === 'warning'"
                [class.btn-primary]="type() === 'info' || !type()"
                (click)="onConfirm()">
                {{ confirmText() }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1050;
    }

    .modal-dialog {
      max-width: 500px;
      width: 90%;
      margin: 1.75rem auto;
    }

    .modal-content {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #dee2e6;
      background-color: #f8f9fa;
    }

    .modal-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .btn-close:hover {
      opacity: 1;
    }

    .modal-body {
      padding: 20px;
    }

    .modal-body p {
      margin: 0;
      line-height: 1.5;
    }

    .modal-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid #dee2e6;
      background-color: #f8f9fa;
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn-secondary {
      background-color: #6c757d;
      border-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
      border-color: #545b62;
    }

    .btn-primary {
      background-color: #007bff;
      border-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      border-color: #004085;
    }

    .btn-danger {
      background-color: #dc3545;
      border-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
      border-color: #bd2130;
    }

    .btn-warning {
      background-color: #ffc107;
      border-color: #ffc107;
      color: #212529;
    }

    .btn-warning:hover {
      background-color: #e0a800;
      border-color: #d39e00;
    }
  `]
})
export class ConfirmDialogComponent {
  // 輸入屬性
  readonly show = input<boolean>(false);
  readonly title = input<string>('確認');
  readonly message = input.required<string>();
  readonly confirmText = input<string>('確認');
  readonly cancelText = input<string>('取消');
  readonly type = input<'danger' | 'warning' | 'info'>('info');

  // 輸出事件
  readonly confirm = output<void>();
  readonly dismissed = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.dismissed.emit();
  }
}
