import { Component, signal, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { DepartmentService } from '../services/department.service';
import { Employee, EmployeeQueryDto } from '../models/employee.model';

/**
 * 員工列表組件
 * 顯示員工列表，支援搜尋、分頁和操作
 */
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);

  // 輸入屬性
  readonly searchQuery = input<EmployeeQueryDto>({});

  // 輸出事件
  readonly editEmployee = output<Employee>();
  readonly deleteEmployee = output<number>();

  // 內部狀態
  readonly employees = signal<Employee[]>([]);
  readonly departments = signal<{ id: number; name: string }[]>([]);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly loading = this.employeeService.loading;

  // 搜尋條件
  readonly searchName = signal('');
  readonly searchDepartmentId = signal<number | undefined>(undefined);

  constructor() {
    // 監聽搜尋查詢變更
    effect(() => {
      const query = this.searchQuery();
      if (query) {
        this.loadEmployees();
      }
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
  }

  /**
   * 載入員工列表
   */
  loadEmployees(): void {
    const query: EmployeeQueryDto = {
      name: this.searchName() || undefined,
      departmentId: this.searchDepartmentId() || undefined,
      firstIndexInPage: (this.currentPage() - 1) * this.pageSize(),
      lastIndexInPage: this.currentPage() * this.pageSize() - 1
    };

    this.employeeService.searchEmployees(query).subscribe({
      next: (response) => {
        this.employees.set(response.dataList);
        this.totalRecords.set(response.totalRecords);
      },
      error: (error) => {
        console.error('載入員工列表失敗:', error);
        this.employees.set([]);
      }
    });
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
      }
    });
  }

  /**
   * 執行搜尋
   */
  search(): void {
    this.currentPage.set(1);
    this.loadEmployees();
  }

  /**
   * 清除搜尋條件
   */
  clearSearch(): void {
    this.searchName.set('');
    this.searchDepartmentId.set(undefined);
    this.currentPage.set(1);
    this.loadEmployees();
  }

  /**
   * 變更頁面
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage.set(page);
      this.loadEmployees();
    }
  }

  /**
   * 取得總頁數
   */
  getTotalPages(): number {
    return Math.ceil(this.totalRecords() / this.pageSize());
  }

  /**
   * 編輯員工
   */
  onEditEmployee(employee: Employee): void {
    this.editEmployee.emit(employee);
  }

  /**
   * 刪除員工
   */
  onDeleteEmployee(employee: Employee): void {
    if (confirm(`確定要刪除員工「${employee.name}」嗎？`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('刪除員工失敗:', error);
        }
      });
    }
  }

  /**
   * 取得部門名稱
   */
  getDepartmentName(departmentId: number): string {
    const department = this.departments().find(d => d.id === departmentId);
    return department ? department.name : '未知部門';
  }

  /**
   * 取得分頁範圍陣列
   */
  getPageRange(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}