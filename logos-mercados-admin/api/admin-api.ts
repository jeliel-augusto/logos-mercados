import { Admin, ApiResponse, LoginRequest, LoginResponse } from '../models';
import { BaseAPI } from './base-api';

export class AdminAPI extends BaseAPI {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.access_token);

    return response;
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  async getCurrentAdmin(): Promise<Admin | null> {
    if (!this.token) {
      return null;
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken =
      typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<ApiResponse<{ token: string }>>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const { data } = response;
    this.setToken(data.token);

    return data.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  isSuperAdmin(): boolean {
    // This would be determined from the current admin's role
    // For now, return false - this should be implemented based on current admin data
    return false;
  }
}
