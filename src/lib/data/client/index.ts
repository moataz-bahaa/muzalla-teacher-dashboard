import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import { objectToFormData } from '@/lib/utils';
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
} from '@/types/auth';
import { HttpClient } from './axios';

class Client {
  auth = {
    login: (input: ILoginInput) =>
      HttpClient.post<ILoginResponse>(API_ENDPOINTS.login, input),

    register: (input: IRegisterInput) =>
      HttpClient.post<IRegisterResponse>(
        API_ENDPOINTS.register,
        objectToFormData(input),
      ),

    logout: (input?: ILogoutInput) =>
      HttpClient.post<ILogoutResponse>(API_ENDPOINTS.logout, input),

    refreshToken: (input: IRefreshTokenInput) =>
      HttpClient.post<IRefreshTokenResponse>(API_ENDPOINTS.refreshToken, input),

    forgetPassword: (input: IForgetPasswordInput) =>
      HttpClient.post<IForgetPasswordResponse>(
        API_ENDPOINTS.forgetPassword,
        input,
      ),

    verifyOtp: (input: IVerifyOtpInput) =>
      HttpClient.post<IVerifyOtpResponse>(API_ENDPOINTS.verifyOtp, input),

    resetPassword: (input: IResetPasswordInput) =>
      HttpClient.post<IResetPasswordResponse>(
        API_ENDPOINTS.resetPassword,
        input,
      ),

    devices: () => HttpClient.get<TAuthDevicesResponse>(API_ENDPOINTS.devices),
  };

  courses = {
    delete: (id: number) =>
      HttpClient.delete<unknown>(API_ENDPOINTS.courseById(id)),
  };

  students = {
    // TODO
    delete: async (_id: number) => Promise.resolve({}),
  };
}

export const client = new Client();
