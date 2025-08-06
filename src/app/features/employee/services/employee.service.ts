import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { 
  Employee, 
  EmployeeCreateDto, 
  EmployeeUpdateDto, 
  EmployeeSummaryDto
} from '../models/employee.model';
import { ApiResponse, PageResponse } from '../models/api.dto';

/**
 * 員工服務
 * 處理所有員工相關的 API 呼叫和資料管理
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(HttpErrorHandlerService);
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  // 使用 signal 管理載入狀態
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * 建立新員工
   */
  createEmployee(createDto: EmployeeCreateDto): Observable<Employee> {
    this.loadingSignal.set(true);
    
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, createDto)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '建立員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('建立員工', error);
        })
      );
  }

  /**
   * 根據 ID 取得員工詳細資訊
   */
  getEmployeeById(empId: number): Observable<Employee> {
    this.loadingSignal.set(true);
    
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${empId}`)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '取得員工資訊失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('取得員工資訊', error);
        })
      );
  }

  /**
   * 根據員工編號取得員工詳細資訊
   */
  getEmployeeByCode(empCode: string): Observable<Employee> {
    this.loadingSignal.set(true);
    
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/code/${empCode}`)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '取得員工資訊失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('取得員工資訊', error);
        })
      );
  }

  /**
   * 分頁查詢所有員工
   */
  getAllEmployees(page = 0, size = 10): Observable<Employee[]> {
    this.loadingSignal.set(true);
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Employee>>>(this.apiUrl, { params })
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            // 從分頁回應中提取員工陣列
            return response.data.content || [];
          }
          throw new Error(response.message || '查詢員工列表失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('查詢員工列表', error);
        })
      );
  }

  /**
   * 根據員工狀態分頁查詢員工
   */
  getEmployeesByStatus(isActive: boolean, page = 0, size = 10): Observable<Employee[]> {
    this.loadingSignal.set(true);
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Employee>>>(`${this.apiUrl}/status/${isActive}`, { params })
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data.content || [];
          }
          throw new Error(response.message || '查詢員工列表失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('查詢員工列表', error);
        })
      );
  }

  /**
   * 根據部門 ID 查詢員工列表
   */
  getEmployeesByDepartment(deptId: number): Observable<Employee[]> {
    this.loadingSignal.set(true);
    
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/department/${deptId}`)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '查詢部門員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('查詢部門員工', error);
        })
      );
  }

  /**
   * 根據姓名模糊搜尋員工
   */
  searchEmployeesByName(empName: string): Observable<Employee[]> {
    this.loadingSignal.set(true);
    
    const params = new HttpParams().set('empName', empName);
    
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '搜尋員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('搜尋員工', error);
        })
      );
  }

  /**
   * 根據職位模糊搜尋員工
   */
  searchEmployeesByJobTitle(jobTitle: string): Observable<Employee[]> {
    this.loadingSignal.set(true);
    
    const params = new HttpParams().set('jobTitle', jobTitle);
    
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/search/job-title`, { params })
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '搜尋員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('搜尋員工', error);
        })
      );
  }

  /**
   * 根據入職日期範圍查詢員工
   */
  getEmployeesByHireDateRange(startDate: string, endDate: string): Observable<Employee[]> {
    this.loadingSignal.set(true);
    
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/hire-date-range`, { params })
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '查詢員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('查詢員工', error);
        })
      );
  }

  /**
   * 更新員工資訊
   */
  updateEmployee(empId: number, updateDto: EmployeeUpdateDto): Observable<Employee> {
    this.loadingSignal.set(true);
    
    return this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${empId}`, updateDto)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '更新員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('更新員工', error);
        })
      );
  }

  /**
   * 刪除員工
   */
  deleteEmployee(empId: number): Observable<void> {
    this.loadingSignal.set(true);
    
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${empId}`)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000) {
            return;
          }
          throw new Error(response.message || '刪除員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('刪除員工', error);
        })
      );
  }

  /**
   * 取得部門員工摘要列表
   */
  getEmployeeSummaryByDepartment(deptId: number): Observable<EmployeeSummaryDto[]> {
    this.loadingSignal.set(true);
    
    return this.http.get<ApiResponse<EmployeeSummaryDto[]>>(`${this.apiUrl}/department/${deptId}/summary`)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '查詢部門員工摘要失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('查詢部門員工摘要', error);
        })
      );
  }

  /**
   * 統計部門啟用員工數量
   */
  countActiveEmployeesByDepartment(deptId: number): Observable<number> {
    this.loadingSignal.set(true);
    
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/department/${deptId}/count`)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data !== undefined) {
            return response.data;
          }
          throw new Error(response.message || '統計員工數量失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('統計員工數量', error);
        })
      );
  }

  /**
   * 根據綜合條件搜尋員工
   */
  searchEmployeesByCriteria(criteria: {
    empCode?: string;
    empName?: string;
    deptId?: number;
    jobTitle?: string;
  }): Observable<Employee[]> {
    this.loadingSignal.set(true);
    
    let params = new HttpParams();
    
    // 只加入非空的搜尋條件
    if (criteria.empCode?.trim()) {
      params = params.set('empCode', criteria.empCode.trim());
    }
    if (criteria.empName?.trim()) {
      params = params.set('empName', criteria.empName.trim());
    }
    if (criteria.deptId) {
      params = params.set('deptId', criteria.deptId.toString());
    }
    if (criteria.jobTitle?.trim()) {
      params = params.set('jobTitle', criteria.jobTitle.trim());
    }
    
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/search/criteria`, { params })
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '搜尋員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('搜尋員工', error);
        })
      );
  }
}
