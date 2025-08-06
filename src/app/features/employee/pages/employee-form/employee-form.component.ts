import { Component, inject, signal, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee, EmployeeCreateDto, EmployeeUpdateDto } from '../../models/employee.model';
import { Department } from '../../models/department.model';

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
  readonly success = signal<string | null>(null);

  // 表單
  employeeForm: FormGroup = this.fb.group({
    emp_code: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]+$/)]],
    emp_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    emp_email: ['', [Validators.email, Validators.maxLength(100)]],
    emp_phone: ['', [Validators.maxLength(20), Validators.pattern(/^[0-9+\-\s()]*$/)]],
    dept_id: [null as number | null],
    job_title: ['', [Validators.maxLength(100)]],
    hire_date: [''],
    resign_date: [''],
    is_active: [true],
    create_user: ['SYSTEM'],
    update_user: ['']
  });

  ngOnInit(): void {
    const employeeId = this.id();
    if (employeeId) {
      this.isEditMode.set(true);
      this.loadEmployee(parseInt(employeeId, 10));
      // 編輯模式下，員工編號不可編輯
      this.employeeForm.get('emp_code')?.disable();
    }
    this.loadDepartments();
  }

  /**
   * 載入員工資料
   */
  private loadEmployee(empId: number): void {
    this.employeeService.getEmployeeById(empId).subscribe({
      next: (employee) => {
        this.employee.set(employee);
        this.employeeForm.patchValue({
          emp_code: employee.emp_code,
          emp_name: employee.emp_name,
          emp_email: employee.emp_email,
          emp_phone: employee.emp_phone,
          dept_id: employee.dept_id,
          job_title: employee.job_title,
          hire_date: employee.hire_date,
          resign_date: employee.resign_date,
          is_active: employee.is_active
        });
        this.error.set(null);
      },
      error: (error) => {
        this.error.set(error.message || '載入員工資料失敗');
        console.error('載入員工資料錯誤:', error);
      }
    });
  }

  /**
   * 載入部門資料
   */
  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments: Department[]) => {
        this.departments.set(departments);
        this.error.set(null);
      },
      error: (error: Error) => {
        this.error.set(error.message || '載入部門資料失敗');
        console.error('載入部門資料錯誤:', error);
      }
    });
  }

  /**
   * 提交表單
   */
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      
      if (this.isEditMode()) {
        this.updateEmployee(formValue);
      } else {
        this.createEmployee(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * 建立員工
   */
  private createEmployee(formValue: Partial<EmployeeCreateDto>): void {
    const createDto: EmployeeCreateDto = {
      emp_code: formValue.emp_code!,
      emp_name: formValue.emp_name!,
      emp_email: formValue.emp_email || undefined,
      emp_phone: formValue.emp_phone || undefined,
      dept_id: formValue.dept_id!,
      job_title: formValue.job_title || undefined,
      hire_date: formValue.hire_date || undefined,
      resign_date: formValue.resign_date || undefined,
      is_active: formValue.is_active!,
      create_user: formValue.create_user!
    };

    this.employeeService.createEmployee(createDto).subscribe({
      next: (newEmployee) => {
        this.success.set('員工建立成功！');
        this.error.set(null);
        console.log('員工建立成功:', newEmployee);
        // 3秒後導航回員工列表
        setTimeout(() => {
          this.router.navigate(['/employee']);
        }, 3000);
      },
      error: (error) => {
        this.error.set(error.message || '建立員工失敗');
        this.success.set(null);
        console.error('建立員工錯誤:', error);
      }
    });
  }

  /**
   * 更新員工
   */
  private updateEmployee(formValue: Partial<EmployeeUpdateDto>): void {
    const employee = this.employee();
    if (!employee) return;

    const updateDto: EmployeeUpdateDto = {
      emp_id: employee.emp_id,
      emp_name: formValue.emp_name || undefined,
      emp_email: formValue.emp_email || undefined,
      emp_phone: formValue.emp_phone || undefined,
      dept_id: formValue.dept_id || undefined,
      job_title: formValue.job_title || undefined,
      hire_date: formValue.hire_date || undefined,
      resign_date: formValue.resign_date || undefined,
      is_active: formValue.is_active || undefined,
      update_user: formValue.update_user!
    };

    this.employeeService.updateEmployee(employee.emp_id, updateDto).subscribe({
      next: (updatedEmployee) => {
        this.success.set('員工更新成功！');
        this.error.set(null);
        console.log('員工更新成功:', updatedEmployee);
        // 3秒後導航回員工列表
        setTimeout(() => {
          this.router.navigate(['/employee']);
        }, 3000);
      },
      error: (error) => {
        this.error.set(error.message || '更新員工失敗');
        this.success.set(null);
        console.error('更新員工錯誤:', error);
      }
    });
  }

  /**
   * 取消操作
   */
  onCancel(): void {
    this.router.navigate(['/employee']);
  }

  /**
   * 重設表單
   */
  onReset(): void {
    if (this.isEditMode()) {
      // 編輯模式下重設為原始值
      const employee = this.employee();
      if (employee) {
        this.employeeForm.patchValue({
          emp_code: employee.emp_code,
          emp_name: employee.emp_name,
          emp_email: employee.emp_email,
          dept_id: employee.dept_id,
          job_title: employee.job_title,
          hire_date: employee.hire_date,
          resign_date: employee.resign_date,
          is_active: employee.is_active
        });
      }
    } else {
      // 新增模式下清空表單
      this.employeeForm.reset();
      this.employeeForm.patchValue({
        is_active: true,
        create_user: 'SYSTEM'
      });
    }
    this.error.set(null);
    this.success.set(null);
  }

  /**
   * 清除訊息
   */
  onClearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }

  /**
   * 標記表單群組為已觸碰，用於顯示驗證錯誤
   */
  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * 取得表單控制項錯誤訊息
   */
  getErrorMessage(fieldName: string): string {
    const control = this.employeeForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} 為必填欄位`;
      }
      if (control.errors['email']) {
        return '請輸入有效的電子郵件格式';
      }
      if (control.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} 長度不足`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} 長度超出限制`;
      }
      if (control.errors['pattern']) {
        return `${this.getFieldDisplayName(fieldName)} 格式不正確（只允許大寫字母和數字）`;
      }
    }
    return '';
  }

  /**
   * 取得欄位顯示名稱
   */
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: Record<string, string> = {
      emp_code: '員工編號',
      emp_name: '員工姓名',
      emp_email: '電子郵件',
      dept_id: '部門',
      job_title: '職位',
      hire_date: '入職日期',
      resign_date: '離職日期'
    };
    return fieldNames[fieldName] || fieldName;
  }

  /**
   * 檢查欄位是否有錯誤
   */
  hasError(fieldName: string): boolean {
    const control = this.employeeForm.get(fieldName);
    return !!(control?.errors && control.touched);
  }

  /**
   * 檢查欄位是否有效
   */
  isValid(fieldName: string): boolean {
    const control = this.employeeForm.get(fieldName);
    return !!(control?.valid && control.touched);
  }
}
