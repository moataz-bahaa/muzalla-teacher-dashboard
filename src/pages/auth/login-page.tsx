import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { GoogleButton } from '@/features/auth/components/google-button';
import { OrDivider } from '@/features/auth/components/or-divider';
import {
  loginSchema,
  type TLoginFormValues,
} from '@/features/auth/schemas/auth-schemas';
import { useAppForm } from '@/hooks/use-app-form';
import { useLoginMutation } from '@/lib/data/auth';
import { routes } from '@/routes/routes';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const loginMutation = useLoginMutation();
  const form = useAppForm({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit((data: TLoginFormValues) => {
    loginMutation.mutate(data);
  });

  return (
    <AuthLayout artVariant='login'>
      <div className='flex w-full flex-col items-center gap-6 text-center'>
        <div className='flex w-full flex-col gap-3'>
          <h1 className='font-heading text-3xl font-bold text-neutral-950 sm:text-[2rem] sm:leading-tight'>
            {t('auth.login.title')}
          </h1>
          <p className='text-sm leading-relaxed text-neutral-400'>
            {t('auth.login.subtitle')}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className='flex w-full flex-col gap-5'
          noValidate
        >
          <Input
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            autoComplete='email'
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />

          <div className='flex w-full flex-col gap-2'>
            <Input
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              type='password'
              autoComplete='current-password'
              {...form.register('password')}
              error={form.formState.errors.password?.message}
            />
            <div className='flex justify-start'>
              <Link
                to={routes.forgetPassword}
                className='text-xs font-medium text-purple-heart-700 hover:underline'
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>
          </div>

          <div className='flex w-full flex-col gap-4'>
            <Button
              type='submit'
              isLoading={loginMutation.isPending}
              className='h-14 w-full rounded-lg bg-purple-heart-900 text-base font-medium text-white hover:bg-purple-heart-800'
            >
              {t('auth.login.submit')}
            </Button>
            <OrDivider />
            <GoogleButton />
          </div>
        </form>

        <p className='text-sm text-neutral-400'>
          <span>{t('auth.login.noAccount')} </span>
          <Link
            to={routes.register}
            className='font-medium text-purple-heart-700 hover:underline'
          >
            {t('auth.login.createAccount')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
