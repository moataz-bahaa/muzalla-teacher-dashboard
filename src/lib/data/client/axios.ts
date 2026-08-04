import { getAccessToken } from '@/lib/cookie';
import axios, { type AxiosRequestConfig } from 'axios';

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL!,
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export class HttpClient {
  static async get<T>(url: string, config?: AxiosRequestConfig) {
    const res = await Axios.get<T>(url, config);
    return res.data;
  }

  static async post<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ) {
    const res = await Axios.post<T>(url, data, config);
    return res.data;
  }

  static async put<T>(url: string, data: unknown, config?: AxiosRequestConfig) {
    const res = await Axios.put<T>(url, data, config);
    return res.data;
  }

  static async patch<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ) {
    const res = await Axios.patch<T>(url, data, config);
    return res.data;
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig) {
    const res = await Axios.delete<T>(url, config);
    return res.data;
  }
}
