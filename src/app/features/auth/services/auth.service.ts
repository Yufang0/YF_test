import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, throwError, switchMap } from 'rxjs';
import type { LoginRequest, LoginResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    // 不再檢查本地儲存的登入狀態，每次頁面載入都需要重新登入
  }

  // 公開的信號，供組件訂閱
  user = this.currentUser.asReadonly();
  authenticated = this.isAuthenticated.asReadonly();

  /**
   * 模擬登入 API 呼叫
   * 如果使用者名稱包含 "manager" 或 "主管"，則視為主管
   * 否則視為員工
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // 模擬網路延遲
    return of(null).pipe(
      delay(1000),
      // 模擬驗證邏輯
      switchMap(() => {
        const { username, password } = credentials;
        
        // 簡單的驗證 - 密碼不能為空
        if (!password.trim()) {
          return throwError(() => ({
            success: false,
            role: 'employee' as const,
            username: '',
            message: '密碼不能為空'
          }));
        }

        // 根據使用者名稱判斷角色
        const isManager = username.toLowerCase().includes('manager') || 
                         username.includes('主管');
        
        const role: 'manager' | 'employee' = isManager ? 'manager' : 'employee';
        
        return of({
          success: true,
          role,
          username,
          message: '登入成功'
        });
      })
    );
  }

  /**
   * 處理登入成功後的邏輯
   */
  handleLoginSuccess(response: LoginResponse): void {
    const user: User = {
      username: response.username,
      role: response.role
    };

    // 更新狀態
    this.currentUser.set(user);
    this.isAuthenticated.set(true);

    // 注意：不再儲存到本地儲存，以確保頁面重載後需要重新登入

    // 根據角色導向不同頁面
    if (response.role === 'manager') {
      this.router.navigate(['/dashboard/manager']);
    } else {
      this.router.navigate(['/dashboard/employee']);
    }
  }

  /**
   * 登出
   */
  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    
    // 不需要清除本地儲存，因為我們不再使用本地儲存
    
    // 導向登入頁
    this.router.navigate(['/login']);
  }

  /**
   * 檢查是否為主管
   */
  isManager(): boolean {
    return this.currentUser()?.role === 'manager';
  }

  /**
   * 檢查是否為員工
   */
  isEmployee(): boolean {
    return this.currentUser()?.role === 'employee';
  }
}
