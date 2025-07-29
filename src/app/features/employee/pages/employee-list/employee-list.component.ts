import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService, Department } from '../../services/department.service';
import { Employee, EmployeeQueryDto } from '../../models/employee.model';

/**
 * 員工列表頁面元件
 * 提供員工查詢、檢視和管理功能
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
  private readonly departmentService = inject(DepartmentService);
  private readonly fb = inject(FormBuilder);

  // 狀態管理
  readonly employees = signal<Employee[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = signal(20);
  readonly loading = this.employeeService.loading;

  // 計算分頁資訊
  readonly totalPages = computed(() => 
    Math.ceil(this.totalRecords() / this.pageSize())
  );

  readonly hasNextPage = computed(() => 
    this.currentPage() < this.totalPages()
  );

  readonly hasPreviousPage = computed(() => 
    this.currentPage() > 1
  );

  // 計算要顯示的分頁按鈕
  readonly visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = 5;
    
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // 搜尋表單
  searchForm: FormGroup = this.fb.group({
    name: [''],
    departmentId: [null]
  });

  ngOnInit(): void {
    this.loadDepartments();
    this.searchEmployees();
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
   * 搜尋員工
   */
  searchEmployees(): void {
    const formValue = this.searchForm.value;
    const page = this.currentPage();
    
    const queryDto: EmployeeQueryDto = {
      name: formValue.name || undefined,
      departmentId: formValue.departmentId || undefined,
      firstIndexInPage: (page - 1) * this.pageSize(),
      lastIndexInPage: page * this.pageSize() - 1
    };

    this.employeeService.searchEmployees(queryDto).subscribe({
      next: (response) => {
        this.employees.set(response.dataList);
        this.totalRecords.set(response.totalRecords);
      },
      error: (error) => console.error('搜尋員工失敗:', error.message)
    });
  }

  /**
   * 重設搜尋條件
   */
  resetSearch(): void {
    this.searchForm.reset();
    this.currentPage.set(1);
    this.searchEmployees();
  }

  /**
   * 切換到指定頁面
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.searchEmployees();
    }
  }

  /**
   * 下一頁
   */
  nextPage(): void {
    if (this.hasNextPage()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  /**
   * 上一頁
   */
  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  /**
   * 刪除員工
   */
  deleteEmployee(employee: Employee): void {
    if (confirm(`確定要刪除員工「${employee.name}」嗎？`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          console.log('員工刪除成功');
          this.searchEmployees(); // 重新載入列表
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
