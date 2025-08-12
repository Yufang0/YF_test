import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeCreateDto, EmployeeUpdateDto } from '../../models/employee.model';
import { PageResponse } from '../../models/api.dto';

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

  // 分頁狀態
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly pageSizeOptions = [5, 10, 20, 50];

  // 搜尋狀態
  readonly isSearching = signal(false);
  readonly currentSearchCriteria = signal<{
    empCode?: string;
    empName?: string;
    deptId?: number;
    jobTitle?: string;
  } | null>(null);

  // 排序狀態
  readonly sortColumn = signal<keyof Employee | null>(null);
  readonly sortDirection = signal<'asc' | 'desc' | 'none'>('none');
  
  // 儲存原始資料順序
  private originalEmployeeOrder = signal<Employee[]>([]);

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
    console.log('=== Component initialization ===');
    console.log('Initial pageSize:', this.pageSize());
    console.log('Initial currentPage:', this.currentPage());
    console.log('PageSize options:', this.pageSizeOptions);
    
    this.loadEmployees();
  }

  /**
   * 載入員工列表 - 使用分頁
   */
  loadEmployees(): void {
    // 檢查是否在搜尋模式
    if (this.isSearching()) {
      const criteria = this.currentSearchCriteria();
      if (criteria) {
        this.loadEmployeesWithSearch(criteria);
        return;
      }
    }
    
    // 一般載入
    this.loadAllEmployees();
  }

  /**
   * 載入所有員工（不含搜尋條件）
   */
  private loadAllEmployees(): void {
    console.log('=== loadAllEmployees called ===');
    console.log('Current pagination state:', {
      page: this.currentPage(),
      size: this.pageSize(),
      totalElements: this.totalElements(),
      totalPages: this.totalPages()
    });
    
    this.employeeService.getAllEmployeesWithPagination(
      this.currentPage(), 
      this.pageSize(),
      'empId',
      'asc'
    ).subscribe({
      next: (pageResponse: PageResponse<Employee>) => {
        console.log('=== API Response received ===');
        console.log('Full response:', pageResponse);
        console.log('Content length:', pageResponse.content?.length || 0);
        console.log('Total elements:', pageResponse.total_elements);
        console.log('Total pages:', pageResponse.total_pages);
        console.log('Current page:', pageResponse.page);
        
        this.employees.set(pageResponse.content || []);
        this.originalEmployeeOrder.set([...pageResponse.content || []]); // 儲存原始順序
        
        // 更新分頁資訊並進行一致性檢查
        const newTotalElements = pageResponse.total_elements || 0;
        const newTotalPages = pageResponse.total_pages || 0;
        
        this.totalElements.set(newTotalElements);
        this.totalPages.set(newTotalPages);
        
        // 檢查當前頁是否超出範圍
        if (this.currentPage() >= newTotalPages && newTotalPages > 0) {
          console.log('Current page exceeds total pages, adjusting...');
          this.currentPage.set(Math.max(0, newTotalPages - 1));
        }
        
        this.error.set(null);
        
        console.log('=== State updated ===');
        console.log('Employees count:', this.employees().length);
        console.log('Total elements:', this.totalElements());
        console.log('Total pages:', this.totalPages());
        console.log('Current page:', this.currentPage());
        console.log('Page size:', this.pageSize());
      },
      error: (error) => {
        console.error('=== API Error ===');
        console.error('Error details:', error);
        this.error.set(error.message || '載入員工列表失敗');
      }
    });
  }

  /**
   * 載入員工列表（含搜尋條件）
   */
  private loadEmployeesWithSearch(criteria: {
    empCode?: string;
    empName?: string;
    deptId?: number;
    jobTitle?: string;
  }): void {
    this.employeeService.searchEmployeesByCriteriaWithPagination(
      criteria,
      this.currentPage(),
      this.pageSize(),
      'createTime',
      'desc'
    ).subscribe({
      next: (pageResponse: PageResponse<Employee>) => {
        console.log('=== Search Results Received ===');
        console.log('Search response:', pageResponse);
        
        this.employees.set(pageResponse.content || []);
        this.originalEmployeeOrder.set([...pageResponse.content || []]); // 儲存原始順序
        
        // 更新分頁資訊
        const newTotalElements = pageResponse.total_elements || 0;
        const newTotalPages = pageResponse.total_pages || 0;
        
        this.totalElements.set(newTotalElements);
        this.totalPages.set(newTotalPages);
        
        // 檢查當前頁是否超出範圍
        if (this.currentPage() >= newTotalPages && newTotalPages > 0) {
          console.log('Search: Current page exceeds total pages, adjusting...');
          this.currentPage.set(Math.max(0, newTotalPages - 1));
        }
        
        this.error.set(null);
        
        console.log('Search results - Total elements:', this.totalElements(), 'Total pages:', this.totalPages());
      },
      error: (error) => {
        this.employees.set([]);
        this.originalEmployeeOrder.set([]);
        this.totalElements.set(0);
        this.totalPages.set(0);
        this.error.set(error.message || '搜尋員工失敗');
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
      // 沒有搜尋條件，回到一般模式
      this.isSearching.set(false);
      this.currentSearchCriteria.set(null);
      this.currentPage.set(0); // 重設到第一頁
      this.loadEmployees();
      return;
    }

    // 根據有效的搜尋條件進行搜尋
    this.searchEmployees(formValue);
  }

  /**
   * 根據條件搜尋員工 - 使用分頁
   */
  private searchEmployees(searchCriteria: {
    emp_code?: string | null;
    emp_name?: string | null;
    dept_id?: number | null;
    job_title?: string | null;
  }): void {
    this.error.set(null);
    
    // 準備搜尋條件
    const criteria = {
      empCode: searchCriteria.emp_code?.trim() || undefined,
      empName: searchCriteria.emp_name?.trim() || undefined,
      deptId: searchCriteria.dept_id || undefined,
      jobTitle: searchCriteria.job_title?.trim() || undefined
    };

    // 設定搜尋狀態
    this.isSearching.set(true);
    this.currentSearchCriteria.set(criteria);
    this.currentPage.set(0); // 重設為第一頁進行搜尋

    // 載入搜尋結果
    this.loadEmployeesWithSearch(criteria);
  }

  /**
   * 重設搜尋條件
   */
  onResetSearch(): void {
    console.log('=== Resetting search ===');
    console.log('Preserving pageSize:', this.pageSize());
    
    this.searchForm.reset();
    // 清除搜尋狀態
    this.isSearching.set(false);
    this.currentSearchCriteria.set(null);
    // 重設分頁到第一頁（但保持頁面大小）
    this.currentPage.set(0);
    
    console.log('After reset - page:', this.currentPage(), 'size:', this.pageSize());
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
          console.log('=== Employee created successfully ===');
          console.log('Preserving pagination state - current page:', this.currentPage(), 'size:', this.pageSize());
          
          // 重新載入員工列表，但保持分頁狀態
          this.loadEmployees();
          this.showCreateForm.set(false);
          this.error.set(null);
          
          // 重置排序狀態（只影響排序，不影響分頁）
          this.resetSort();
          
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
          console.log('=== Employee updated successfully ===');
          console.log('Preserving pagination state - current page:', this.currentPage(), 'size:', this.pageSize());
          
          // 重新載入員工列表，但保持分頁狀態
          this.loadEmployees();
          this.showEditForm.set(false);
          this.selectedEmployee.set(null);
          this.error.set(null);
          
          // 重置排序狀態（只影響排序，不影響分頁）
          this.resetSort();
          
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
          console.log('=== Employee deleted successfully ===');
          console.log('Preserving pagination state - current page:', this.currentPage(), 'size:', this.pageSize());
          
          // 檢查刪除後是否需要調整頁碼（如果當前頁沒有資料了）
          const remainingItems = this.totalElements() - 1;
          const maxPage = Math.max(0, Math.ceil(remainingItems / this.pageSize()) - 1);
          
          if (this.currentPage() > maxPage) {
            console.log('Adjusting page due to deletion - from', this.currentPage(), 'to', maxPage);
            this.currentPage.set(maxPage);
          }
          
          // 重新載入員工列表，但保持分頁狀態
          this.loadEmployees();
          this.error.set(null);
          
          // 重置排序狀態（只影響排序，不影響分頁）
          this.resetSort();
          
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
   * 排序表格 - 三態循環：升序 → 降序 → 無排序 → 升序
   */
  onSort(column: keyof Employee): void {
    const currentColumn = this.sortColumn();
    const currentDirection = this.sortDirection();

    if (currentColumn === column) {
      // 同一欄位，按照三態循環切換
      if (currentDirection === 'asc') {
        this.sortDirection.set('desc');
      } else if (currentDirection === 'desc') {
        this.sortDirection.set('none');
        this.sortColumn.set(null);
      } else {
        this.sortDirection.set('asc');
        this.sortColumn.set(column);
      }
    } else {
      // 不同欄位，設為新欄位且升序
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }

    // 執行排序
    this.applySort();
  }

  /**
   * 執行員工資料排序或恢復原始順序
   */
  private applySort(): void {
    const column = this.sortColumn();
    const direction = this.sortDirection();
    
    // 如果沒有排序欄位或方向為none，恢復原始順序
    if (!column || direction === 'none') {
      this.employees.set([...this.originalEmployeeOrder()]);
      return;
    }

    const sorted = [...this.employees()].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      // 處理空值
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === 'asc' ? 1 : -1;
      if (bValue == null) return direction === 'asc' ? -1 : 1;

      // 數字比較
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // 字串比較
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (aStr < bStr) return direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.employees.set(sorted);
  }

  /**
   * 重置排序狀態
   */
  private resetSort(): void {
    this.sortColumn.set(null);
    this.sortDirection.set('none');
    this.employees.set([...this.originalEmployeeOrder()]);
  }

  /**
   * 取得排序圖示狀態
   */
  getSortIconState(column: keyof Employee, direction: 'asc' | 'desc'): 'active' | 'inactive' {
    const currentColumn = this.sortColumn();
    const currentDirection = this.sortDirection();
    
    if (currentColumn === column && currentDirection === direction) {
      return 'active';
    }
    
    return 'inactive';
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

  // ====== 分頁相關方法 ======

  /**
   * 切換到指定頁面
   */
  onPageChange(page: number): void {
    console.log('=== onPageChange called ===');
    console.log('Target page:', page);
    console.log('Current page:', this.currentPage());
    console.log('Total pages:', this.totalPages());
    console.log('Valid page check:', page >= 0 && page < this.totalPages() && page !== this.currentPage());
    
    if (page >= 0 && page < this.totalPages() && page !== this.currentPage()) {
      console.log('Page change accepted, updating current page...');
      this.currentPage.set(page);
      console.log('New current page:', this.currentPage());
      console.log('Calling loadEmployees...');
      this.loadEmployees();
    } else {
      console.log('Page change rejected due to validation');
    }
  }

  /**
   * 變更每頁筆數
   */
  onPageSizeChange(size: number): void {
    console.log('=== onPageSizeChange called ===');
    console.log('Current size:', this.pageSize());
    console.log('New size:', size);
    console.log('Current page before reset:', this.currentPage());
    
    this.pageSize.set(size);
    this.currentPage.set(0); // 重置到第一頁
    
    console.log('After size change:');
    console.log('- Page size:', this.pageSize());
    console.log('- Current page:', this.currentPage());
    console.log('Calling loadEmployees...');
    
    this.loadEmployees();
  }

  /**
   * 處理頁面大小變更事件
   */
  onPageSizeSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const size = parseInt(target.value, 10);
    
    console.log('=== onPageSizeSelectChange triggered ===');
    console.log('Selected value:', target.value);
    console.log('Parsed size:', size);
    console.log('Current pageSize before change:', this.pageSize());
    
    if (size && size > 0 && size !== this.pageSize()) {
      this.onPageSizeChange(size);
    } else {
      console.log('Page size change ignored - invalid size or same as current');
    }
  }

  /**
   * 上一頁
   */
  onPreviousPage(): void {
    if (this.currentPage() > 0) {
      this.onPageChange(this.currentPage() - 1);
    }
  }

  /**
   * 下一頁
   */
  onNextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.onPageChange(this.currentPage() + 1);
    }
  }

  /**
   * 跳到第一頁
   */
  onFirstPage(): void {
    this.onPageChange(0);
  }

  /**
   * 跳到最後一頁
   */
  onLastPage(): void {
    this.onPageChange(this.totalPages() - 1);
  }

  /**
   * 計算顯示的資料範圍
   */
  getDisplayRange(): string {
    if (this.totalElements() === 0) {
      return '沒有資料';
    }
    
    const start = this.currentPage() * this.pageSize() + 1;
    const end = Math.min((this.currentPage() + 1) * this.pageSize(), this.totalElements());
    
    return `第 ${start} - ${end} 筆，共 ${this.totalElements()} 筆`;
  }

  /**
   * 生成分頁按鈕陣列
   */
  getPageNumbers(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];
    
    if (total <= 7) {
      // 如果總頁數小於等於 7，顯示所有頁面
      for (let i = 0; i < total; i++) {
        pages.push(i);
      }
    } else {
      // 總頁數大於 7 時，智慧顯示
      if (current <= 3) {
        // 前面幾頁
        for (let i = 0; i < 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // 省略號
        pages.push(total - 1);
      } else if (current >= total - 4) {
        // 後面幾頁
        pages.push(0);
        pages.push(-1); // 省略號
        for (let i = total - 5; i < total; i++) {
          pages.push(i);
        }
      } else {
        // 中間頁面
        pages.push(0);
        pages.push(-1); // 省略號
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-2); // 省略號
        pages.push(total - 1);
      }
    }
    
    return pages;
  }
}
