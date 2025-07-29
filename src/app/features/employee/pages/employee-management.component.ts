import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeListComponent } from '../components/employee-list.component';
import { EmployeeFormComponent } from '../components/employee-form.component';
import { EmployeeService } from '../services/employee.service';
import { Employee, EmployeeQueryDto } from '../models/employee.model';

/**
 * 員工管理主頁面
 * 負責協調員工列表和表單組件
 */
@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeListComponent, EmployeeFormComponent],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  // 使用 signals 管理狀態
  readonly selectedEmployee = signal<Employee | null>(null);
  readonly isFormVisible = signal(false);
  readonly searchQuery = signal<EmployeeQueryDto>({});

  ngOnInit(): void {
    // 初始化時載入員工列表
    this.refreshEmployeeList();
  }

  /**
   * 顯示新增員工表單
   */
  showCreateForm(): void {
    this.selectedEmployee.set(null);
    this.isFormVisible.set(true);
  }

  /**
   * 顯示編輯員工表單
   */
  showEditForm(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.isFormVisible.set(true);
  }

  /**
   * 隱藏表單
   */
  hideForm(): void {
    this.isFormVisible.set(false);
    this.selectedEmployee.set(null);
  }

  /**
   * 表單提交成功後的處理
   */
  onFormSuccess(): void {
    this.hideForm();
    this.refreshEmployeeList();
  }

  /**
   * 重新整理員工列表
   */
  refreshEmployeeList(): void {
    // 觸發子組件重新載入
    const currentQuery = this.searchQuery();
    this.searchQuery.set({ ...currentQuery });
  }

  /**
   * 處理搜尋條件變更
   */
  onSearchChange(query: EmployeeQueryDto): void {
    this.searchQuery.set(query);
  }
}