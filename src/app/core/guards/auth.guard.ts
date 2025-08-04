import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.authenticated();
    
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    // 檢查角色權限
    const requiredRole = route.data?.['role'] as 'manager' | 'employee';
    if (requiredRole) {
      const user = this.authService.user();
      if (user?.role !== requiredRole) {
        // 如果角色不符，導向對應的儀表板
        if (user?.role === 'manager') {
          this.router.navigate(['/dashboard/manager']);
        } else {
          this.router.navigate(['/dashboard/employee']);
        }
        return false;
      }
    }

    return true;
  }
}
