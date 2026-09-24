import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import {
  forgetPasswordSchema,
  type TForgetPasswordFormValues,
} from '@/features/auth/schemas/auth-schemas';
import type { IForgetPasswordFlowState } from '@/features/auth/types';
import { useAppForm } from '@/hooks/use-app-form';
import { useForgetPasswordMutation } from '@/lib/data/auth';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const ForgetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const forgetPasswordMutation = useForgetPasswordMutation();
  const form = useAppForm({
    schema: forgetPasswordSchema,
    defaultValues: { email: '' },
  });

  const onSubmit = form.handleSubmit((values: TForgetPasswordFormValues) => {
    forgetPasswordMutation.mutate(values, {
      onSuccess(data) {
        toast.success(data.message);
        void navigate(routes.verifyOtp, {
          state: { email: values.email } satisfies IForgetPasswordFlowState,
        });
      },
      onError(error: unknown) {
        toast.error(getErrorMessage(error));
      },
    });
  });

  return (
    <AuthLayout artVariant='forget'>
      <div className='flex w-full flex-col items-center gap-6 text-center'>
        <div className='flex w-full flex-col gap-3'>
          <h1 className='font-heading text-3xl font-bold text-neutral-950 sm:text-[2rem] sm:leading-tight'>
            {t('auth.forgetPassword.title')}
          </h1>
          <p className='text-sm leading-relaxed text-neutral-400'>
            {t('auth.forgetPassword.subtitle')}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className='flex w-full flex-col gap-6'
          noValidate
        >
          <Input
            label={t('auth.forgetPassword.emailLabel')}
            placeholder={t('auth.emailPlaceholder')}
            type='email'
            autoComplete='email'
            {...form.register('email')}
          />

          <Button
            type='submit'
            isLoading={forgetPasswordMutation.isPending}
            className='h-14 w-full rounded-lg bg-purple-heart-900 text-base font-medium text-white hover:bg-purple-heart-800'
          >
            {t('auth.forgetPassword.submit')}
          </Button>
        </form>

        <Link
          to={routes.login}
          className='text-sm font-medium text-purple-heart-700 hover:underline'
        >
          {t('auth.forgetPassword.backToLogin')}
        </Link>
      </div>
    </AuthLayout>
  );
};
