import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import type { LoginRequest, LoginResponse } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // 如果已經登入，導向對應的儀表板
    if (this.authService.authenticated()) {
      const user = this.authService.user();
      if (user?.role === 'manager') {
        this.router.navigate(['/dashboard/manager']);
      } else {
        this.router.navigate(['/dashboard/employee']);
      }
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  /**
   * 登入表單提交
   */
  onSubmit(): void {
    if (this.loginForm.valid && !this.loading()) {
      this.performLogin();
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * 執行登入
   */
  private performLogin(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const credentials: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response: LoginResponse) => {
        this.loading.set(false);
        if (response.success) {
          this.authService.handleLoginSuccess(response);
        } else {
          this.errorMessage.set(response.message || '登入失敗');
        }
      },
      error: (error: any) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || '登入過程發生錯誤，請稍後再試');
      }
    });
  }

  /**
   * 標記表單所有欄位為已觸碰，以顯示驗證錯誤
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * 檢查欄位是否有錯誤並且已被觸碰
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * 取得欄位錯誤訊息
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      switch (fieldName) {
        case 'username': return '請輸入使用者名稱';
        case 'password': return '請輸入密碼';
        default: return '此欄位為必填';
      }
    }

    if (field.errors['minlength']) {
      switch (fieldName) {
        case 'username': return '使用者名稱至少需要 2 個字元';
        case 'password': return '密碼不能為空';
        default: return '輸入長度不足';
      }
    }

    return '輸入格式不正確';
  }

  /**
   * 演示用：快速登入主管帳號
   */
  loginAsManager(): void {
    this.loginForm.patchValue({
      username: 'manager',
      password: 'demo123'
    });
    this.performLogin();
  }

  /**
   * 演示用：快速登入員工帳號
   */
  loginAsEmployee(): void {
    this.loginForm.patchValue({
      username: 'employee',
      password: 'demo123'
    });
    this.performLogin();
  }
}
