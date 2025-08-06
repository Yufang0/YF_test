import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * 應用程式根元件
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      font-family: var(--font-family-primary, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
      background-color: var(--color-background-primary, #f5f5f5);
      color: var(--color-text-primary, #333);
    }
  `]
})
export class AppComponent {
  protected readonly title = signal('YF_test');
}
