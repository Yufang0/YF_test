import { Component, signal, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { DepartmentService, Department } from '../services/department.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../models/employee.model';

/**
 * 員工表單組件
 * 用於新增和編輯員工
 */
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly fb = inject(FormBuilder);

  // 輸入屬性
  readonly employee = input<Employee | null>(null);

  // 輸出事件
  readonly formSubmit = output<void>();
  readonly formCancel = output<void>();

  // 內部狀態
  readonly departments = signal<Department[]>([]);
  readonly isSubmitting = signal(false);
  readonly formErrors = signal<string[]>([]);

  // 表單
  employeeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    departmentId: [null, [Validators.required]]
  });

  constructor() {
    // 監聽員工資料變更
    effect(() => {
      const emp = this.employee();
      if (emp) {
        this.employeeForm.patchValue({
          name: emp.name,
          departmentId: emp.departmentId
        });
      } else {
        this.employeeForm.reset();
      }
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  /**
   * 載入部門列表
   */
  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
      },
      error: (error) => {
        console.error('載入部門列表失敗:', error);
        this.addError('載入部門列表失敗，請重新整理頁面');
      }
    });
  }

  /**
   * 提交表單
   */
  onSubmit(): void {
    if (this.employeeForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.clearErrors();

      const formValue = this.employeeForm.value;
      const employee = this.employee();

      if (employee) {
        // 更新現有員工
        const updateDto: UpdateEmployeeDto = {
          id: employee.id,
          name: formValue.name,
          departmentId: formValue.departmentId
        };

        this.employeeService.updateEmployee(updateDto).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.formSubmit.emit();
          },
          error: (error) => {
            this.isSubmitting.set(false);
            this.handleSubmitError(error);
          }
        });
      } else {
        // 建立新員工
        const createDto: CreateEmployeeDto = {
          name: formValue.name,
          departmentId: formValue.departmentId
        };

        this.employeeService.createEmployee(createDto).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.formSubmit.emit();
          },
          error: (error) => {
            this.isSubmitting.set(false);
            this.handleSubmitError(error);
          }
        });
      }
    }
  }

  /**
   * 取消表單
   */
  onCancel(): void {
    this.employeeForm.reset();
    this.clearErrors();
    this.formCancel.emit();
  }

  /**
   * 處理提交錯誤
   */
  private handleSubmitError(error: any): void {
    console.error('提交表單失敗:', error);
    this.addError('提交失敗，請檢查輸入內容並重試');
  }

  /**
   * 新增錯誤訊息
   */
  private addError(message: string): void {
    const currentErrors = this.formErrors();
    this.formErrors.set([...currentErrors, message]);
  }

  /**
   * 清除錯誤訊息
   */
  private clearErrors(): void {
    this.formErrors.set([]);
  }

  /**
   * 取得表單標題
   */
  getFormTitle(): string {
    return this.employee() ? '編輯員工' : '新增員工';
  }

  /**
   * 取得提交按鈕文字
   */
  getSubmitButtonText(): string {
    if (this.isSubmitting()) {
      return this.employee() ? '更新中...' : '建立中...';
    }
    return this.employee() ? '更新' : '建立';
  }

  /**
   * 檢查欄位是否有錯誤
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * 取得欄位錯誤訊息
   */
  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return fieldName === 'name' ? '員工姓名為必填項目' : '部門為必填項目';
      }
      if (field.errors['minlength']) {
        return '員工姓名至少需要 2 個字元';
      }
      if (field.errors['maxlength']) {
        return '員工姓名不能超過 50 個字元';
      }
    }
    return '';
  }
}