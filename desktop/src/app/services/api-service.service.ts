import { Injectable } from '@angular/core';
import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private axiosClient: AxiosInstance;

  constructor(private auth: Auth) {
    this.axiosClient = axios.create({
      baseURL: environment.ApiBaseUrl,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  public registerHeader(token: string) {
    this.axiosClient.defaults.headers.common['authorization'] = `Bearer ${token}`;
  }

  private async applicationAuthorization(): Promise<boolean> {
    return new Promise(resolve => {
      onAuthStateChanged(this.auth, async user => {
        if (user) {
          const token = await user.getIdToken();
          this.registerHeader(token);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  public async get<T>(endpoint: string, anonymous = false): Promise<T | null> {
    try {
      if (!anonymous && !(await this.applicationAuthorization())) {
        return null;
      }
      const response = await this.axiosClient.get<ApiResponse<T>>(endpoint);
      if (!response.data.success) {
        throw new Error(response.data.errorMessage || '');
      }
      return response.data.data;
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<T>>;
      console.error(axiosErr.response?.data.errorMessage ?? axiosErr.message);
      return null;
    }
  }

  public async post<T>(endpoint: string, data: any, anonymous = false): Promise<T | null> {
    try {
      if (!anonymous && !(await this.applicationAuthorization())) {
        return null;
      }
      const response = await this.axiosClient.post<ApiResponse<T>>(endpoint, data);
      if (!response.data.success) {
        throw new Error(response.data.errorMessage || '');
      }
      return response.data.data;
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<T>>;
      console.error(axiosErr.response?.data.errorMessage ?? axiosErr.message);
      return null;
    }
  }

  public async postFormData<T>(endpoint: string, data: FormData, anonymous = false): Promise<T | null> {
    try {
      if (!anonymous && !(await this.applicationAuthorization())) {
        return null;
      }
      const response: AxiosResponse<T> = await this.axiosClient.post(endpoint, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<T>>;
      console.error(axiosErr.response?.data.errorMessage ?? axiosErr.message);
      return null;
    }
  }

  public async put<T>(endpoint: string, data: any, anonymous = false): Promise<T | null> {
    try {
      if (!anonymous && !(await this.applicationAuthorization())) {
        return null;
      }
      const response: AxiosResponse<T> = await this.axiosClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<T>>;
      console.error(axiosErr.response?.data.errorMessage ?? axiosErr.message);
      return null;
    }
  }

  public async delete<T>(endpoint: string, data?: any, anonymous = false): Promise<T | null> {
    try {
      if (!anonymous && !(await this.applicationAuthorization())) {
        return null;
      }
      const config = data ? { data } : undefined;
      const response: AxiosResponse<T> = await this.axiosClient.delete(endpoint, config);
      return response.data;
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<T>>;
      console.error(axiosErr.response?.data.errorMessage ?? axiosErr.message);
      return null;
    }
  }
}
