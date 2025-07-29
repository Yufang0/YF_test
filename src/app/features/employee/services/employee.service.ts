import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { 
  Employee, 
  CreateEmployeeDto, 
  UpdateEmployeeDto, 
  EmployeeQueryDto, 
  EmployeeQueryResponse
} from '../models/employee.model';
import { ApiResponse } from '../models/api.dto';

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
   * 查詢員工列表
   */
  searchEmployees(queryDto: EmployeeQueryDto): Observable<EmployeeQueryResponse> {
    this.loadingSignal.set(true);
    
    return this.http.post<ApiResponse<EmployeeQueryResponse>>(`${this.apiUrl}/search`, queryDto)
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
   * 取得單一員工詳細資訊
   */
  getEmployee(id: number): Observable<Employee> {
    this.loadingSignal.set(true);
    
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`)
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
   * 建立新員工
   */
  createEmployee(createDto: CreateEmployeeDto): Observable<Employee> {
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
   * 更新員工資訊
   */
  updateEmployee(updateDto: UpdateEmployeeDto): Observable<Employee> {
    this.loadingSignal.set(true);
    
    return this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${updateDto.id}`, updateDto)
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
  deleteEmployee(id: number): Observable<boolean> {
    this.loadingSignal.set(true);
    
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          this.loadingSignal.set(false);
          if (response.code === 1000) {
            return true;
          }
          throw new Error(response.message || '刪除員工失敗');
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          return this.errorHandler.handleError('刪除員工', error);
        })
      );
  }
}
