import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { ApiResponse } from '../models/api.dto';

/**
 * 部門介面
 */
export interface Department {
  id: number;
  name: string;
  description?: string;
}

/**
 * 部門服務
 * 處理所有部門相關的 API 呼叫
 */
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(HttpErrorHandlerService);
  private readonly apiUrl = `${environment.apiUrl}/departments`;

  /**
   * 取得所有部門列表
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<ApiResponse<Department[]>>(this.apiUrl)
      .pipe(
        map(response => {
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '取得部門列表失敗');
        }),
        catchError(error => this.errorHandler.handleError('取得部門列表', error))
      );
  }

  /**
   * 根據 ID 取得部門
   */
  getDepartment(id: number): Observable<Department> {
    return this.http.get<ApiResponse<Department>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (response.code === 1000 && response.data) {
            return response.data;
          }
          throw new Error(response.message || '取得部門資訊失敗');
        }),
        catchError(error => this.errorHandler.handleError('取得部門資訊', error))
      );
  }
}