import { ApiError } from '@/models';

export class BaseAPI {
  protected baseURL: string;
  protected token: string | null = null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    console.log(this.baseURL);
    this.token = this.getToken();
  }

  protected getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  }

  protected setToken(token: string): void {
    this.token = token;
    console.log('setToken', token);
    console.log('typeof window', typeof window);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  protected clearTokens(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('refresh_token');
    }
  }

  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    let headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'Request failed',
          status: response.status,
          code: data.code,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }
}
