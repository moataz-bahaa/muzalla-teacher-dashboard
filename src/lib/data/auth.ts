import { useMutation } from '@/hooks/use-mutation'
import { useQuery } from '@tanstack/react-query'
import {
  clearAuthTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/cookie'
import { client } from './client'
import { API_ENDPOINTS } from './client/endpoints'
import type {
  IForgetPasswordInput,
  IForgetPasswordResponse,
  ILoginInput,
  ILoginResponse,
  ILogoutResponse,
  IRefreshTokenResponse,
  IRegisterInput,
  IRegisterResponse,
  IResetPasswordInput,
  IResetPasswordResponse,
  IVerifyOtpInput,
  IVerifyOtpResponse,
  TAuthDevicesResponse,
} from '@/types/auth'

export const useLoginMutation = () => {
  return useMutation<ILoginResponse, ILoginInput>({
    mutationKey: [API_ENDPOINTS.login],
    mutationFn: client.auth.login,
    onSuccess(data) {
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
    },
  })
}

export const useRegisterMutation = () => {
  return useMutation<IRegisterResponse, IRegisterInput>({
    mutationKey: [API_ENDPOINTS.register],
    mutationFn: client.auth.register,
    onSuccess(data) {
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
    },
  })
}

export const useLogoutMutation = () => {
  return useMutation<ILogoutResponse, void>({
    mutationKey: [API_ENDPOINTS.logout],
    mutationFn: () =>
      client.auth.logout({
        refreshToken: getRefreshToken(),
      }),
    onSuccess() {
      clearAuthTokens()
    },
  })
}

export const useRefreshTokenMutation = () => {
  return useMutation<IRefreshTokenResponse, void>({
    mutationKey: [API_ENDPOINTS.refreshToken],
    mutationFn: () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        return Promise.reject(new Error('Missing refresh token'))
      }
      return client.auth.refreshToken({ refreshToken })
    },
    onSuccess(data) {
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
    },
  })
}

export const useForgetPasswordMutation = () => {
  return useMutation<IForgetPasswordResponse, IForgetPasswordInput>({
    mutationKey: [API_ENDPOINTS.forgetPassword],
    mutationFn: client.auth.forgetPassword,
  })
}

export const useVerifyOtpMutation = () => {
  return useMutation<IVerifyOtpResponse, IVerifyOtpInput>({
    mutationKey: [API_ENDPOINTS.verifyOtp],
    mutationFn: client.auth.verifyOtp,
  })
}

export const useResetPasswordMutation = () => {
  return useMutation<IResetPasswordResponse, IResetPasswordInput>({
    mutationKey: [API_ENDPOINTS.resetPassword],
    mutationFn: client.auth.resetPassword,
  })
}

export const useAuthDevicesQuery = () => {
  return useQuery<TAuthDevicesResponse>({
    queryKey: [API_ENDPOINTS.devices],
    queryFn: client.auth.devices,
  })
}
