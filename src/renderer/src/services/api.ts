import React from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Base URL - Update this to match your Flask server
const API_BASE_URL = 'http://localhost:5000/api';

// Types for API responses (keeping the existing types)
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email?: string;
    full_name?: string;
    role_name: string;
    role_description?: string;
    status: string;
    permissions: string[];
  };
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

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false, // Set to false for development
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Don't set CORS headers from client side - let the server handle them
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        
        // Handle network errors specifically
        if (error.code === 'ERR_NETWORK') {
          console.error('Network error detected. Please check if the server is running.');
        }
        
        // Handle CORS errors
        if (error.message?.includes('CORS')) {
          console.error('CORS error detected:', error);
        }
        
        if (error.response?.status === 401) {
          // Token expired or invalid
          console.log('Authentication error, removing token');
          this.removeToken();
          // Only redirect if we're not already on the login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Optional: Add token expiration check here
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return !!token; // Fallback to just checking if token exists
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.api.post('/user/login', credentials);
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
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
    this.removeToken();
  }

  async checkPermission(permission: string): Promise<{ has_permission: boolean }> {
    const response = await this.api.post('/user/check-permission', { permission });
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