import { Component, signal, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeService } from '../services/employee.service';
import { Employee, EmployeeQueryDto } from '../models/employee.model';

/**
 * 員工管理主頁面
 * 負責協調員工列表和表單組件
 */
@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeListComponent],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  // ViewChild 用來存取子組件
  @ViewChild(EmployeeListComponent) employeeListComponent!: EmployeeListComponent;

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
    // 調用子組件的新增員工方法
    if (this.employeeListComponent) {
      this.employeeListComponent.onShowCreateForm();
    }
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