import useAuth from '@/features/auth/hooks/use-auth'
import { useMutation } from '@/hooks/use-mutation'
import { getRefreshToken } from '@/lib/cookie'
import { useQuery } from '@tanstack/react-query'
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
  const { authorize } = useAuth()

  return useMutation<ILoginResponse, ILoginInput>({
    mutationKey: [API_ENDPOINTS.login],
    mutationFn: client.auth.login,
    onSuccess(data) {
      authorize(data.accessToken, data.refreshToken)
    },
  })
}

export const useRegisterMutation = () => {
  const { authorize } = useAuth()

  return useMutation<IRegisterResponse, IRegisterInput>({
    mutationKey: [API_ENDPOINTS.register],
    mutationFn: client.auth.register,
    onSuccess(data) {
      authorize(data.accessToken, data.refreshToken)
    },
  })
}

/** Prefer `useAuth().unauthorize()` for UI logout so session state clears. */
export const useLogoutMutation = () => {
  return useMutation<ILogoutResponse, void>({
    mutationKey: [API_ENDPOINTS.logout],
    mutationFn: () =>
      client.auth.logout({
        refreshToken: getRefreshToken(),
      }),
  })
}

export const useRefreshTokenMutation = () => {
  const { authorize } = useAuth()

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
      authorize(data.accessToken, data.refreshToken)
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
