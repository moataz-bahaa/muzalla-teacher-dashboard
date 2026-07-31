import { apiClient } from './axios'
import { API_ENDPOINTS } from '@/lib/data/client/endpoints'
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

class Client {
  auth = {
    login: (input: ILoginInput) =>
      apiClient.post<ILoginResponse, ILoginResponse>(API_ENDPOINTS.login, input),

    register: (input: IRegisterInput) =>
      apiClient.post<IRegisterResponse, IRegisterResponse>(API_ENDPOINTS.register, input),

    logout: (input?: ILogoutInput) =>
      apiClient.post<ILogoutResponse, ILogoutResponse>(API_ENDPOINTS.logout, input),

    refreshToken: (input: IRefreshTokenInput) =>
      apiClient.post<IRefreshTokenResponse, IRefreshTokenResponse>(
        API_ENDPOINTS.refreshToken,
        input,
      ),

    forgetPassword: (input: IForgetPasswordInput) =>
      apiClient.post<IForgetPasswordResponse, IForgetPasswordResponse>(
        API_ENDPOINTS.forgetPassword,
        input,
      ),

    verifyOtp: (input: IVerifyOtpInput) =>
      apiClient.post<IVerifyOtpResponse, IVerifyOtpResponse>(
        API_ENDPOINTS.verifyOtp,
        input,
      ),

    resetPassword: (input: IResetPasswordInput) =>
      apiClient.post<IResetPasswordResponse, IResetPasswordResponse>(
        API_ENDPOINTS.resetPassword,
        input,
      ),

    devices: () =>
      apiClient.get<TAuthDevicesResponse, TAuthDevicesResponse>(API_ENDPOINTS.devices),
  }
}

export const client = new Client()
