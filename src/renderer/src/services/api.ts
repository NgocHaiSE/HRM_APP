import React from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Base URL - Update this to match your Flask server
const API_BASE_URL = 'http://localhost:5000/api';

// Types for API responses
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email?: string;
    full_name?: string;
    role_name: string;
    role_description?: string;
    status: string;
    permissions: string[];
    created_at: string;
  };
}

export interface AttendanceStats {
  work_date: string;
  cnt_PRESENT: number;
  cnt_LATE: number;
  cnt_LEFT_EARLY: number;
  cnt_ABSENT: number;
  cnt_ON_LEAVE: number;
  cnt_OVERTIME: number;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  role_name: string;
  role_description?: string;
  status: string;
  permissions: string[];
}

export interface Person {
  id: number;
  code: string;
  fullname: string;
  gender: number;
  birth?: string;
  phone?: string;
  address?: string;
  email?: string;
  position?: string;
  department_id?: number;
  avatar_url?: string;
  status: number;
  created_at: string;
}

export interface Camera {
  id: number;
  name: string;
  link: string;
  type: number;
  ip?: string;
  username?: string;
  status: number;
  location: string;
  created_at: string;
}

export interface TimekeepingRecord {
  id: number;
  person_id: number;
  person_code: string;
  fullname: string;
  check_in?: string;
  check_out?: string;
  date: string;
  status: string;
}

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors and token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (error.code === 'ERR_NETWORK') {
          console.error('Network error detected. Please check if the server is running.');
          return Promise.reject(error);
        }

        // Handle CORS errors
        if (error.message?.includes('CORS')) {
          console.error('CORS error detected:', error);
          return Promise.reject(error);
        }

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('401 error detected, attempting token refresh...');
          
          if (this.isRefreshing) {
            // If we're already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.api(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.getRefreshToken();
            console.log('Refresh token exists:', !!refreshToken);
            
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            console.log('Attempting to refresh token...');

            // Try to refresh the token using refresh endpoint
            const response = await axios.post(`${API_BASE_URL}/user/refresh`, {}, {
              headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json'
              }
            });

            console.log('Refresh response:', response.data);

            // Get new access token
            const newToken = response.data.access_token;
            
            if (!newToken) {
              throw new Error('No access token received from refresh endpoint');
            }

            this.setToken(newToken);
            console.log('Token refreshed successfully');

            // Process failed queue
            this.processQueue(null);

            // Retry original request với token mới
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);

          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            console.log('Refresh error details:', {
              status: refreshError.response?.status,
              data: refreshError.response?.data,
              message: refreshError.message
            });
            
            this.processQueue(refreshError);
            this.removeTokens();
            
            // Only redirect if we're not already on the login page
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              console.log('Redirecting to login due to refresh failure');
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    this.failedQueue = [];
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  removeTokens(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('No token found');
      return false;
    }
    
    // Check token expiration for JWT tokens
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 <= Date.now();
      
      if (isExpired) {
        console.log('Token is expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token format:', error);
      this.removeTokens();
      return false;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.api.post('/user/login', credentials);
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      if (response.data.refresh_token) {
        this.setRefreshToken(response.data.refresh_token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Manual refresh token attempt...');

      const response = await axios.post(`${API_BASE_URL}/user/refresh`, {}, {
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        }
      });

      const newToken = response.data.access_token;
      
      if (!newToken) {
        throw new Error('No access token received from refresh endpoint');
      }

      this.setToken(newToken);
      return newToken;
    } catch (error: any) {
      console.error('Manual refresh token error:', error);
      this.removeTokens();
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.get('/user/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to blacklist token on server
      await this.api.post('/user/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with client-side logout even if server call fails
    } finally {
      this.removeTokens();
    }
  }

  async updateProfile(data: Partial<User>): Promise<{ message: string }> {
    const response = await this.api.put('/user/profile', data);
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await this.api.put('/user/change-password', {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  }

  async checkPermission(permission: string): Promise<{ has_permission: boolean }> {
    const response = await this.api.post('/user/check-permission', { permission });
    return response.data;
  }

  // ✅ Thêm method getAttendanceStats
  async getAttendanceStats(startDate: string, endDate: string): Promise<AttendanceStats[]> {
    const response: AxiosResponse<AttendanceStats[]> = await this.api.get(
      `/timekeeping/attendance/stats?start=${startDate}&end=${endDate}`
    );
    return response.data;
  }

  // Person endpoints
  async getAllPersons(): Promise<Person[]> {
    const response: AxiosResponse<Person[]> = await this.api.get('/person/get');
    return response.data;
  }

  async getPerson(id: number): Promise<Person> {
    const response: AxiosResponse<Person> = await this.api.get(`/person/get/${id}`);
    return response.data;
  }

  async createPerson(person: Partial<Person>): Promise<{ message: string }> {
    const response = await this.api.post('/person/create', person);
    return response.data;
  }

  async updatePerson(id: number, person: Partial<Person>): Promise<{ message: string }> {
    const response = await this.api.put(`/person/adjust/${id}`, person);
    return response.data;
  }

  async deletePerson(id: number): Promise<{ message: string }> {
    const response = await this.api.delete(`/person/delete/${id}`);
    return response.data;
  }

  async uploadAvatar(file: File, personCode: string): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('code', personCode);

    const response = await this.api.post('/person/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadFace(file: File, personId: number, personCode: string): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personid', personId.toString());
    formData.append('code', personCode);

    const response = await this.api.post('/person/face/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Camera endpoints
  async getAllCameras(): Promise<Camera[]> {
    const response: AxiosResponse<Camera[]> = await this.api.get('/camera/list');
    return response.data;
  }

  async startCamera(id: number): Promise<{ status: string; message: string }> {
    const response = await this.api.get(`/camera/start/${id}`);
    return response.data;
  }

  async stopCamera(id: number): Promise<{ status: string; message: string }> {
    const response = await this.api.get(`/camera/stop/${id}`);
    return response.data;
  }

  async checkCameraStatus(id: number): Promise<{ status: string; camera_id: string; is_running: boolean }> {
    const response = await this.api.get(`/camera/check/${id}`);
    return response.data;
  }

  // Timekeeping endpoints
  async getAllTimekeeping(): Promise<TimekeepingRecord[]> {
    const response: AxiosResponse<TimekeepingRecord[]> = await this.api.get('/timekeeping/get');
    return response.data;
  }

  async getAttendanceByDate(date: string): Promise<TimekeepingRecord[]> {
    const response: AxiosResponse<TimekeepingRecord[]> = await this.api.get(`/timekeeping/attendance/${date}`);
    return response.data;
  }

  async getPersonAttendance(personId: number, startDate: string, endDate: string): Promise<TimekeepingRecord[]> {
    const response: AxiosResponse<TimekeepingRecord[]> = await this.api.get(
      `/timekeeping/person/${personId}?start=${startDate}&end=${endDate}`
    );
    return response.data;
  }

  async getAttendance(Date: string): Promise<TimekeepingRecord[]> {
    const response: AxiosResponse<TimekeepingRecord[]> = await this.api.get(
      `/timekeeping/attendance/${Date}` // Ensure this endpoint matches your API
    );
    return response.data;
  }

  async getRealtimeAttendance(): Promise<TimekeepingRecord[]> {
    const response: AxiosResponse<TimekeepingRecord[]> = await this.api.get('/timekeeping/realtime');
    return response.data;
  }

  async checkin(imageBase64: string): Promise<{ status: string; message: string }> {
    const response = await this.api.post('/timekeeping/checkin', { file: imageBase64 });
    return response.data;
  }

  async checkout(imageBase64: string): Promise<{ status: string; message: string }> {
    const response = await this.api.post('/timekeeping/checkout', { file: imageBase64 });
    return response.data;
  }

  async manualCheckin(personId: number, checkTime?: string): Promise<{ message: string }> {
    const response = await this.api.post('/timekeeping/manual-checkin', {
      person_id: personId,
      check_time: checkTime,
    });
    return response.data;
  }

  async manualCheckout(personId: number, checkTime?: string): Promise<{ message: string }> {
    const response = await this.api.post('/timekeeping/manual-checkout', {
      person_id: personId,
      check_time: checkTime,
    });
    return response.data;
  }

  // Utility method to handle errors
  handleError(error: any): string {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unknown error occurred';
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;