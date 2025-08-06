import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 可重用的載入指示器元件
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="loading-overlay" [class.full-screen]="fullScreen()">
        <div class="spinner-container">
          <div class="spinner" [style.width.px]="size()" [style.height.px]="size()"></div>
          @if (message()) {
            <div class="loading-message">{{ message() }}</div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .loading-overlay.full-screen {
      position: fixed;
      background-color: rgba(255, 255, 255, 0.9);
    }

    .spinner-container {
      text-align: center;
    }

    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-message {
      margin-top: 12px;
      color: #666;
      font-size: 14px;
    }
  `]
})
export class LoadingSpinnerComponent {
  readonly loading = input<boolean>(false);
  readonly message = input<string>('');
  readonly size = input<number>(40);
  readonly fullScreen = input<boolean>(false);
}
