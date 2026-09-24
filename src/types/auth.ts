export interface ILoginInput {
  username: string;
  password: string;
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
  tenantName: string;
  domain: string;
  logo?: File;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  imageProfile?: File;
  phoneNumber: string;
}

export interface IRegisterResponse {
  token: string;
  refreshToken: string;
  expiration: string;
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
  token?: string;
}

export interface IResetPasswordInput {
  token: string;
  password: string;
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

export interface IMeResponse {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  profileImage: string | null;
  role: string;
  tenantId: number;
}
