import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertConfig {
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  dismissible?: boolean;
}

/**
 * 可重用的警告元件
 * 用於顯示各種類型的訊息
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="alert alert-{{ type() }}" 
      [class.alert-dismissible]="dismissible()"
      role="alert">
      {{ message() }}
      @if (dismissible()) {
        <button 
          type="button" 
          class="btn-close" 
          (click)="onDismiss()"
          aria-label="關閉">
          ×
        </button>
      }
    </div>
  `,
  styles: [`
    .alert {
      padding: 12px 16px;
      margin-bottom: 16px;
      border: 1px solid transparent;
      border-radius: 4px;
      position: relative;
    }

    .alert-success {
      color: #0f5132;
      background-color: #d1e7dd;
      border-color: #badbcc;
    }

    .alert-danger {
      color: #842029;
      background-color: #f8d7da;
      border-color: #f5c2c7;
    }

    .alert-warning {
      color: #664d03;
      background-color: #fff3cd;
      border-color: #ffecb5;
    }

    .alert-info {
      color: #055160;
      background-color: #cff4fc;
      border-color: #b6effb;
    }

    .alert-dismissible {
      padding-right: 50px;
    }

    .btn-close {
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .btn-close:hover {
      opacity: 1;
    }
  `]
})
export class AlertComponent {
  // 輸入屬性
  readonly type = input<'success' | 'danger' | 'warning' | 'info'>('info');
  readonly message = input.required<string>();
  readonly dismissible = input<boolean>(true);

  // 輸出事件
  readonly dismiss = output<void>();

  onDismiss(): void {
    this.dismiss.emit();
  }
}
