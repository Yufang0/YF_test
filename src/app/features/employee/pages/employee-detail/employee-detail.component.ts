import { Component, inject, signal, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService, Department } from '../../services/department.service';
import { Employee } from '../../models/employee.model';

/**
 * 員工詳細資訊頁面元件
 * 顯示單一員工的完整資訊
 */
@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);

  // 路由參數
  readonly id = input.required<string>();

  // 狀態管理
  readonly employee = signal<Employee | null>(null);
  readonly departments = signal<Department[]>([]);
  readonly loading = this.employeeService.loading;
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEmployee();
    this.loadDepartments();
  }

  /**
   * 載入員工詳細資訊
   */
  loadEmployee(): void {
    const employeeId = parseInt(this.id(), 10);
    
    if (isNaN(employeeId)) {
      this.error.set('無效的員工編號');
      return;
    }

    this.employeeService.getEmployee(employeeId).subscribe({
      next: (employee) => {
        this.employee.set(employee);
        this.error.set(null);
      },
      error: (error) => {
        this.error.set(error.message);
        console.error('載入員工詳細資訊失敗:', error.message);
      }
    });
  }

  /**
   * 載入部門列表
   */
  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments: Department[]) => this.departments.set(departments),
      error: (error: any) => console.error('載入部門失敗:', error.message)
    });
  }

  /**
   * 刪除員工
   */
  deleteEmployee(): void {
    const emp = this.employee();
    if (!emp) return;

    if (confirm(`確定要刪除員工「${emp.name}」嗎？`)) {
      this.employeeService.deleteEmployee(emp.id).subscribe({
        next: () => {
          console.log('員工刪除成功');
          // 導向員工列表頁面
          this.router.navigate(['/employees']);
        },
        error: (error) => console.error('刪除員工失敗:', error.message)
      });
    }
  }

  /**
   * 取得部門名稱
   */
  getDepartmentName(departmentId: number): string {
    const department = this.departments().find(d => d.id === departmentId);
    return department?.name || '未知部門';
  }
}
