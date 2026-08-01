import axios, { type AxiosRequestConfig } from 'axios'
import { getAccessToken } from '@/lib/cookie'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

/**
 * Response interceptor unwraps `response.data`, so callers receive `T`
 * instead of `AxiosResponse<T>`.
 */
type ApiClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => Promise<T>
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => Promise<T>
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => Promise<T>
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => Promise<T>
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => Promise<T>
}

export const apiClient = instance as unknown as ApiClient
