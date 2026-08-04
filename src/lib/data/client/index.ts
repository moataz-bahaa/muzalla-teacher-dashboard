import { API_ENDPOINTS } from '@/lib/data/client/endpoints'
import { objectToFormData } from '@/lib/utils'
import type {
  IForgetPasswordInput,
  IForgetPasswordResponse,
  ILoginInput,
  ILoginResponse,
  ILogoutInput,
  ILogoutResponse,
  IRefreshTokenInput,
  IRefreshTokenResponse,
  IRegisterInput,
  IRegisterResponse,
  IResetPasswordInput,
  IResetPasswordResponse,
  IVerifyOtpInput,
  IVerifyOtpResponse,
  TAuthDevicesResponse,
} from '@/types/auth'
import { apiClient } from './axios'

class Client {
  auth = {
    login: (input: ILoginInput) =>
      apiClient.post<ILoginResponse>(API_ENDPOINTS.login, input),

    register: (input: IRegisterInput) =>
      apiClient.post<IRegisterResponse>(
        API_ENDPOINTS.register,
        objectToFormData(input),
      ),

    logout: (input?: ILogoutInput) =>
      apiClient.post<ILogoutResponse>(API_ENDPOINTS.logout, input),

    refreshToken: (input: IRefreshTokenInput) =>
      apiClient.post<IRefreshTokenResponse>(API_ENDPOINTS.refreshToken, input),

    forgetPassword: (input: IForgetPasswordInput) =>
      apiClient.post<IForgetPasswordResponse>(
        API_ENDPOINTS.forgetPassword,
        input,
      ),

    verifyOtp: (input: IVerifyOtpInput) =>
      apiClient.post<IVerifyOtpResponse>(API_ENDPOINTS.verifyOtp, input),

    resetPassword: (input: IResetPasswordInput) =>
      apiClient.post<IResetPasswordResponse>(
        API_ENDPOINTS.resetPassword,
        input,
      ),

    devices: () => apiClient.get<TAuthDevicesResponse>(API_ENDPOINTS.devices),
  }

  courses = {
    delete: (id: number) =>
      apiClient.delete<unknown>(API_ENDPOINTS.courseById(id)),
  }

  students = {
    // TODO
    delete: async (_id: number) => Promise.resolve({}),
  }
}

export const client = new Client()
