import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

/**
 * HTTP 錯誤處理服務
 * 提供統一的錯誤處理機制
 */
@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  /**
   * 處理 HTTP 錯誤
   * @param operation 執行的操作名稱
   * @param error 錯誤物件
   * @returns Observable 包含錯誤資訊
   */
  handleError<T>(operation: string, error: any): Observable<never> {
    console.error(`${operation} 失敗:`, error);
    
    // 根據錯誤類型提供使用者友善的錯誤訊息
    let userMessage = '發生未知錯誤，請稍後再試';
    
    if (error.error?.message) {
      userMessage = error.error.message;
    } else if (error.message) {
      userMessage = error.message;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          userMessage = '請求參數錯誤';
          break;
        case 401:
          userMessage = '您尚未登入或登入已過期';
          break;
        case 403:
          userMessage = '您沒有權限執行此操作';
          break;
        case 404:
          userMessage = '找不到請求的資源';
          break;
        case 500:
          userMessage = '伺服器發生錯誤，請稍後再試';
          break;
        default:
          userMessage = `發生錯誤 (${error.status})`;
      }
    }
    
    // 可以在這裡加入其他錯誤處理邏輯，如：
    // - 發送錯誤報告到監控系統
    // - 顯示 toast 訊息
    // - 記錄到本地儲存
    
    return throwError(() => new Error(userMessage));
  }
}
