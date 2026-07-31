import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { AuthTextField } from '@/features/auth/components/auth-text-field';
import { GoogleButton } from '@/features/auth/components/google-button';
import { OrDivider } from '@/features/auth/components/or-divider';
import {
  loginSchema,
  type TLoginFormValues,
} from '@/features/auth/schemas/auth-schemas';
import { useAppForm } from '@/hooks/use-app-form';
import { routes } from '@/routes/routes';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useAppForm({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit((_values: TLoginFormValues) => {
    toast.success(t('auth.toast.loginSuccess'));
    void navigate(routes.home);
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
          <AuthTextField
            control={form.control}
            name='email'
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            type='email'
            autoComplete='email'
          />

          <div className='flex w-full flex-col gap-2'>
            <AuthTextField
              control={form.control}
              name='password'
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              type='password'
              autoComplete='current-password'
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
