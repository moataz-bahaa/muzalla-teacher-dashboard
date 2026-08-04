export interface ILoginInput {
  email: string;
  password: string;
  tenantId?: number;
  deviceId?: string;
  deviceName?: string;
  ip?: string;
  location?: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterInput {
  TenantName: string;
  Domain: string;
  Logo?: File;
  FirstName: string;
  LastName: string;
  Username: string;
  Password: string;
  ImageProfile?: File;
  PhoneNumber: string;
}

export interface IRegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IForgetPasswordInput {
  email: string;
}

export interface IForgetPasswordResponse {
  message?: string;
}

export interface IVerifyOtpInput {
  email: string;
  code: string;
}

export interface IVerifyOtpResponse {
  message?: string;
  resetToken?: string;
}

export interface IResetPasswordInput {
  email: string;
  code: string;
  password: string;
  resetToken?: string;
}

export interface IResetPasswordResponse {
  message?: string;
}

export interface IRefreshTokenInput {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ILogoutInput {
  refreshToken?: string;
}

export interface ILogoutResponse {
  message?: string;
}

export interface IAuthDevice {
  id: number | string;
  deviceName?: string;
  deviceId?: string;
  ip?: string;
  location?: string;
  createdAt?: string;
  lastUsedAt?: string;
}

export type TAuthDevicesResponse = IAuthDevice[];
