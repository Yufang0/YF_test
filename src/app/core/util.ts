/**
 * 核心工具函式
 * 提供應用程式中常用的工具函式和資料轉換功能
 */

/**
 * 將物件的屬性名稱從 camelCase 轉換為 snake_case
 * @param obj 要轉換的物件
 * @returns 轉換後的物件
 */
export function objectToSnakeCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => objectToSnakeCase(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const snakeCaseObj: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = camelToSnakeCase(key);
      snakeCaseObj[snakeKey] = objectToSnakeCase(value);
    }
    
    return snakeCaseObj;
  }

  return obj;
}

/**
 * 將物件的屬性名稱從 snake_case 轉換為 camelCase
 * @param obj 要轉換的物件
 * @returns 轉換後的物件
 */
export function objectToCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => objectToCamelCase(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const camelCaseObj: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamelCase(key);
      camelCaseObj[camelKey] = objectToCamelCase(value);
    }
    
    return camelCaseObj;
  }

  return obj;
}

/**
 * 將字串從 camelCase 轉換為 snake_case
 * @param str camelCase 字串
 * @returns snake_case 字串
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * 將字串從 snake_case 轉換為 camelCase
 * @param str snake_case 字串
 * @returns camelCase 字串
 */
export function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 格式化日期為 YYYY/MM/DD 格式
 * @param date 日期物件或日期字串
 * @returns 格式化後的日期字串
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}/${month}/${day}`;
}

/**
 * 格式化日期時間為 YYYY/MM/DD HH:mm:ss 格式
 * @param date 日期物件或日期字串
 * @returns 格式化後的日期時間字串
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 深度複製物件
 * @param obj 要複製的物件
 * @returns 複製後的新物件
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

/**
 * 檢查值是否為空（null, undefined, 空字串, 空陣列, 空物件）
 * @param value 要檢查的值
 * @returns 是否為空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * 移除物件中的空值屬性
 * @param obj 要清理的物件
 * @returns 清理後的物件
 */
export function removeEmptyProperties<T>(obj: T): Partial<T> {
  if (!obj || typeof obj !== 'object') {
    return obj as Partial<T>;
  }

  const cleaned: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!isEmpty(value)) {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * 產生唯一的 ID
 * @returns 唯一 ID 字串
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 延遲執行
 * @param ms 延遲的毫秒數
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 防抖函式
 * @param func 要防抖的函式
 * @param wait 等待時間（毫秒）
 * @returns 防抖後的函式
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 節流函式
 * @param func 要節流的函式
 * @param limit 限制時間（毫秒）
 * @returns 節流後的函式
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
