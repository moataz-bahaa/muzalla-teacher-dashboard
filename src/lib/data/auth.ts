import useAuth from '@/features/auth/hooks/use-auth';
import { useMutation } from '@/hooks/use-mutation';
import { getRefreshToken } from '@/lib/cookie';
import { routes } from '@/routes/routes';
import type { IApiResponse } from '@/types/api';
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
} from '@/types/auth';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { client } from './client';
import { API_ENDPOINTS } from './client/endpoints';

export const useLoginMutation = () => {
  const { authorize } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation<ILoginResponse, ILoginInput>({
    mutationKey: [API_ENDPOINTS.login],
    mutationFn: client.auth.login,
    onSuccess(data) {
      authorize(data.accessToken, data.refreshToken);
      toast.success(t('auth.toast.loginSuccess'));
      void navigate(routes.home);
    },
    onError: () => {
      toast.error(t('auth.toast.loginError'));
    },
  });
};

export const useRegisterMutation = () => {
  const { authorize } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation<IApiResponse<IRegisterResponse>, IRegisterInput>({
    mutationKey: [API_ENDPOINTS.register],
    mutationFn: client.auth.register,
    onSuccess(data) {
      if (!data.data) {
        throw new Error('No data returned from server');
      }
      authorize(data.data?.token, data.data?.refreshToken);
      toast.success(data.message ?? t('auth.toast.registerSuccess'));
      void navigate(routes.home);
    },
    onError(error) {
      toast.error(error.message || t('auth.toast.registerError'));
    },
  });
};

/** Prefer `useAuth().unauthorize()` for UI logout so session state clears. */
export const useLogoutMutation = () => {
  return useMutation<ILogoutResponse, void>({
    mutationKey: [API_ENDPOINTS.logout],
    mutationFn: () =>
      client.auth.logout({
        refreshToken: getRefreshToken(),
      }),
  });
};

export const useRefreshTokenMutation = () => {
  const { authorize } = useAuth();

  return useMutation<IRefreshTokenResponse, void>({
    mutationKey: [API_ENDPOINTS.refreshToken],
    mutationFn: () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(new Error('Missing refresh token'));
      }
      return client.auth.refreshToken({ refreshToken });
    },
    onSuccess(data) {
      authorize(data.accessToken, data.refreshToken);
    },
  });
};

export const useForgetPasswordMutation = () => {
  return useMutation<IForgetPasswordResponse, IForgetPasswordInput>({
    mutationKey: [API_ENDPOINTS.forgetPassword],
    mutationFn: client.auth.forgetPassword,
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation<IVerifyOtpResponse, IVerifyOtpInput>({
    mutationKey: [API_ENDPOINTS.verifyOtp],
    mutationFn: client.auth.verifyOtp,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation<IResetPasswordResponse, IResetPasswordInput>({
    mutationKey: [API_ENDPOINTS.resetPassword],
    mutationFn: client.auth.resetPassword,
  });
};

export const useAuthDevicesQuery = () => {
  return useQuery<TAuthDevicesResponse>({
    queryKey: [API_ENDPOINTS.devices],
    queryFn: client.auth.devices,
  });
};

export const useMe = () => {
  const { isAuthorized } = useAuth();
  const { isPending, isError, data, error } = useQuery({
    queryKey: [API_ENDPOINTS.me],
    queryFn: client.auth.getMe,
    enabled: isAuthorized,
  });

  return {
    isPending,
    isError,
    me: data?.data,
    error,
  };
};
