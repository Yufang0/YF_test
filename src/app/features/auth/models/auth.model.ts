export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  role: 'manager' | 'employee';
  username: string;
  message?: string;
}

export interface User {
  username: string;
  role: 'manager' | 'employee';
}
