import axios, { AxiosInstance } from 'axios';
import type { ApiResponse } from '@/types/api';

class ApiService {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          // Only redirect to login in production - in dev with mock API, just console warn
          if (import.meta.env.VITE_MOCK_API !== 'true') {
            window.location.href = '/login';
          } else {
            console.warn('401 error intercepted in mock mode - skipping login redirect');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.axios.get<T>(url, { params });
    return {
      data: response.data,
      status: response.status,
    };
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axios.post<T>(url, data);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axios.put<T>(url, data);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axios.delete<T>(url);
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export default new ApiService();