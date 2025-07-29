import { Component, inject, signal, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService, Department } from '../../services/department.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../../models/employee.model';

/**
 * 員工表單元件
 * 用於新增或編輯員工資訊
 */
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // 路由參數
  readonly id = input<string>();

  // 狀態管理
  readonly employee = signal<Employee | null>(null);
  readonly departments = signal<Department[]>([]);
  readonly loading = this.employeeService.loading;
  readonly isEditMode = signal(false);
  readonly error = signal<string | null>(null);

  // 表單
  employeeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    departmentId: [null, [Validators.required]]
  });

  ngOnInit(): void {
    this.loadDepartments();
    
    const employeeId = this.id();
    if (employeeId) {
      this.isEditMode.set(true);
      this.loadEmployee(parseInt(employeeId, 10));
    }
  }

  /**
   * 載入部門列表
   */
  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments: Department[]) => this.departments.set(departments),
      error: (error: any) => {
        this.error.set('載入部門列表失敗');
        console.error('載入部門失敗:', error.message);
      }
    });
  }

  /**
   * 載入員工資訊（編輯模式）
   */
  private loadEmployee(employeeId: number): void {
    if (isNaN(employeeId)) {
      this.error.set('無效的員工編號');
      return;
    }

    this.employeeService.getEmployee(employeeId).subscribe({
      next: (employee) => {
        this.employee.set(employee);
        this.employeeForm.patchValue({
          name: employee.name,
          departmentId: employee.departmentId
        });
        this.error.set(null);
      },
      error: (error) => {
        this.error.set(error.message);
        console.error('載入員工資訊失敗:', error.message);
      }
    });
  }

  /**
   * 提交表單
   */
  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.employeeForm.value;

    if (this.isEditMode()) {
      this.updateEmployee(formValue);
    } else {
      this.createEmployee(formValue);
    }
  }

  /**
   * 建立新員工
   */
  private createEmployee(formValue: any): void {
    const createDto: CreateEmployeeDto = {
      name: formValue.name.trim(),
      departmentId: parseInt(formValue.departmentId, 10)
    };

    this.employeeService.createEmployee(createDto).subscribe({
      next: (employee) => {
        console.log('員工建立成功:', employee);
        this.router.navigate(['/employees', employee.id]);
      },
      error: (error) => {
        this.error.set(error.message);
        console.error('建立員工失敗:', error.message);
      }
    });
  }

  /**
   * 更新員工資訊
   */
  private updateEmployee(formValue: any): void {
    const emp = this.employee();
    if (!emp) return;

    const updateDto: UpdateEmployeeDto = {
      id: emp.id,
      name: formValue.name.trim(),
      departmentId: parseInt(formValue.departmentId, 10)
    };

    this.employeeService.updateEmployee(updateDto).subscribe({
      next: (employee) => {
        console.log('員工更新成功:', employee);
        this.router.navigate(['/employees', employee.id]);
      },
      error: (error) => {
        this.error.set(error.message);
        console.error('更新員工失敗:', error.message);
      }
    });
  }

  /**
   * 標記表單所有欄位為已觸碰
   */
  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * 取消操作
   */
  cancel(): void {
    if (this.isEditMode()) {
      this.router.navigate(['/employees', this.employee()?.id]);
    } else {
      this.router.navigate(['/employees']);
    }
  }

  /**
   * 檢查欄位是否有錯誤且已被觸碰
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * 取得欄位錯誤訊息
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (!field?.errors || !field?.touched) return '';

    const errors = field.errors;
    if (errors['required']) return '此欄位為必填';
    if (errors['minlength']) return `最少需要 ${errors['minlength'].requiredLength} 個字元`;
    if (errors['maxlength']) return `最多只能 ${errors['maxlength'].requiredLength} 個字元`;

    return '輸入格式不正確';
  }
}
