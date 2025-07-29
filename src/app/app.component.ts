import { Component } from '@angular/core';
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
      font-family: var(--font-family-primary);
      background-color: var(--color-background-primary);
      color: var(--color-text-primary);
    }
  `]
})
export class AppComponent {
  title = 'YF_test';
}
