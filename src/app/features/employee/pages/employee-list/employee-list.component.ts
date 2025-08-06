import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeCreateDto, EmployeeUpdateDto } from '../../models/employee.model';

/**
 * 員工列表頁面元件
 * 提供員工查詢、建立、更新和刪除功能
 */
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // 狀態管理 - 使用 signals
  readonly employees = signal<Employee[]>([]);
  readonly selectedEmployee = signal<Employee | null>(null);
  readonly showCreateForm = signal(false);
  readonly showEditForm = signal(false);
  readonly showViewModal = signal(false);
  readonly loading = this.employeeService.loading;
  readonly error = signal<string | null>(null);

  // 搜尋表單
  readonly searchForm = this.fb.group({
    emp_code: [''],
    emp_name: [''],
    dept_id: [null as number | null],
    job_title: ['']
  });

  // 建立員工表單
  readonly createForm = this.fb.group({
    emp_code: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]+$/)]],
    emp_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    emp_email: ['', [Validators.email, Validators.maxLength(100)]],
    emp_phone: ['', [Validators.maxLength(20), Validators.pattern(/^[0-9+\-\s()]*$/)]],
    dept_id: [null as number | null, [Validators.required]],
    job_title: ['', [Validators.maxLength(100)]],
    hire_date: [''],
    resign_date: [''],
    is_active: [true, [Validators.required]],
    create_user: ['SYSTEM', [Validators.required]]
  });

  // 編輯員工表單
  readonly editForm = this.fb.group({
    emp_code: ['', [Validators.required]], // 必填但在UI中為readonly
    emp_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    emp_email: ['', [Validators.email, Validators.maxLength(100)]],
    emp_phone: ['', [Validators.maxLength(20), Validators.pattern(/^[0-9+\-\s()]*$/)]],
    dept_id: [null as number | null, [Validators.required]],
    job_title: ['', [Validators.maxLength(100)]],
    hire_date: [''],
    resign_date: [''],
    is_active: [true, [Validators.required]],
    update_user: ['', [Validators.required, Validators.maxLength(20)]]
  });

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * 載入員工列表
   */
  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.error.set(null);
      },
      error: (error) => {
        this.error.set(error.message || '載入員工列表失敗');
        console.error('載入員工列表錯誤:', error);
      }
    });
  }

  /**
   * 搜尋員工
   */
  onSearch(): void {
    const formValue = this.searchForm.value;
    
    // 檢查是否有任何搜尋條件
    const hasSearchCriteria = formValue.emp_code?.trim() || 
                             formValue.emp_name?.trim() || 
                             formValue.dept_id || 
                             formValue.job_title?.trim();
    
    if (!hasSearchCriteria) {
      // 沒有搜尋條件，載入所有員工
      this.loadEmployees();
      return;
    }

    // 根據有效的搜尋條件進行搜尋
    this.searchEmployees(formValue);
  }

  /**
   * 根據條件搜尋員工
   */
  private searchEmployees(searchCriteria: {
    emp_code?: string | null;
    emp_name?: string | null;
    dept_id?: number | null;
    job_title?: string | null;
  }): void {
    this.error.set(null);
    
    // 使用新的綜合搜尋 API
    const criteria = {
      empCode: searchCriteria.emp_code?.trim() || undefined,
      empName: searchCriteria.emp_name?.trim() || undefined,
      deptId: searchCriteria.dept_id || undefined,
      jobTitle: searchCriteria.job_title?.trim() || undefined
    };

    this.employeeService.searchEmployeesByCriteria(criteria).subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.error.set(null);
      },
      error: (error) => {
        this.employees.set([]);
        this.error.set(error.message || '搜尋員工失敗');
      }
    });
  }

  /**
   * 重設搜尋條件
   */
  onResetSearch(): void {
    this.searchForm.reset();
    this.loadEmployees();
  }

  /**
   * 顯示建立員工表單
   */
  onShowCreateForm(): void {
    this.showCreateForm.set(true);
    this.createForm.reset();
    this.createForm.patchValue({
      is_active: true,
      create_user: 'SYSTEM'
    });
  }

  /**
   * 建立員工
   */
  onCreateEmployee(): void {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;
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
          // 重新載入員工列表
          this.loadEmployees();
          this.showCreateForm.set(false);
          this.error.set(null);
          console.log('員工建立成功:', newEmployee);
        },
        error: (error) => {
          this.error.set(error.message || '建立員工失敗');
          console.error('建立員工錯誤:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.createForm);
    }
  }

  /**
   * 取消建立員工
   */
  onCancelCreate(): void {
    this.showCreateForm.set(false);
    this.createForm.reset();
  }

  /**
   * 編輯員工
   */
  onEditEmployee(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.editForm.patchValue({
      emp_code: employee.emp_code,
      emp_name: employee.emp_name,
      emp_email: employee.emp_email,
      emp_phone: employee.emp_phone,
      dept_id: employee.dept_id,
      job_title: employee.job_title,
      hire_date: employee.hire_date,
      resign_date: employee.resign_date,
      is_active: employee.is_active,
      update_user: ''
    });
    this.showEditForm.set(true);
  }

  /**
   * 更新員工
   */
  onUpdateEmployee(): void {
    const employee = this.selectedEmployee();
    if (this.editForm.valid && employee) {
      const formValue = this.editForm.value;
      const updateDto: EmployeeUpdateDto = {
        emp_id: employee.emp_id,
        emp_code: formValue.emp_code || employee.emp_code, // 添加 emp_code
        emp_name: formValue.emp_name!,
        emp_email: formValue.emp_email || undefined,
        emp_phone: formValue.emp_phone || undefined,
        dept_id: formValue.dept_id || undefined,
        job_title: formValue.job_title || undefined,
        hire_date: formValue.hire_date || undefined,
        resign_date: formValue.resign_date || undefined,
        is_active: formValue.is_active!,
        update_user: formValue.update_user!
      };
      
      this.employeeService.updateEmployee(employee.emp_id, updateDto).subscribe({
        next: (updatedEmployee) => {
          // 重新載入員工列表
          this.loadEmployees();
          this.showEditForm.set(false);
          this.selectedEmployee.set(null);
          this.error.set(null);
          console.log('員工更新成功:', updatedEmployee);
        },
        error: (error) => {
          this.error.set(error.message || '更新員工失敗');
          console.error('更新員工錯誤:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.editForm);
    }
  }

  /**
   * 取消編輯員工
   */
  onCancelEdit(): void {
    this.showEditForm.set(false);
    this.selectedEmployee.set(null);
    this.editForm.reset();
  }

  /**
   * 刪除員工
   */
  onDeleteEmployee(employee: Employee): void {
    if (confirm(`確定要刪除員工 ${employee.emp_name} 嗎？此操作無法復原。`)) {
      this.employeeService.deleteEmployee(employee.emp_id).subscribe({
        next: () => {
          // 重新載入員工列表
          this.loadEmployees();
          this.error.set(null);
          console.log('員工刪除成功');
        },
        error: (error) => {
          this.error.set(error.message || '刪除員工失敗');
          console.error('刪除員工錯誤:', error);
        }
      });
    }
  }

  /**
   * 檢視員工詳情
   */
  onViewEmployee(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.showViewModal.set(true);
  }

  /**
   * 關閉檢視員工彈窗
   */
  onCloseViewModal(): void {
    this.showViewModal.set(false);
    this.selectedEmployee.set(null);
  }

  /**
   * 清除錯誤訊息
   */
  onClearError(): void {
    this.error.set(null);
  }

  /**
   * 標記表單群組為已觸碰，用於顯示驗證錯誤
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * 取得表單控制項錯誤訊息
   */
  getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const control = formGroup.get(fieldName);
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
        return `${this.getFieldDisplayName(fieldName)} 格式不正確`;
      }
    }
    return '';
  }

  /**
   * 檢查表單控制項是否有錯誤
   */
  hasError(formGroup: FormGroup, fieldName: string): boolean {
    const control = formGroup.get(fieldName);
    return !!(control?.errors && control.touched);
  }

  /**
   * 取得欄位顯示名稱
   */
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: Record<string, string> = {
      emp_code: '員工編號',
      emp_name: '員工姓名',
      emp_email: '電子郵件',
      emp_phone: '連絡電話',
      dept_id: '部門',
      job_title: '職位',
      hire_date: '入職日期',
      resign_date: '離職日期',
      is_active: '狀態',
      create_user: '建立者',
      update_user: '更新使用者'
    };
    return fieldNames[fieldName] || fieldName;
  }
}
