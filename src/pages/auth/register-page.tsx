import { FileField } from '@/components/form/file-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { GoogleButton } from '@/features/auth/components/google-button';
import { OrDivider } from '@/features/auth/components/or-divider';
import { registerSchema } from '@/features/auth/schemas/auth-schemas';
import { useAppForm } from '@/hooks/use-app-form';
import { useRegisterMutation } from '@/lib/data/auth';
import { routes } from '@/routes/routes';
import type { IRegisterInput } from '@/types/auth';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const form = useAppForm({
    schema: registerSchema,
    defaultValues: {
      tenantName: '',
      domain: '',
      logo: undefined,
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      imageProfile: undefined,
      phoneNumber: '',
    },
  });

  const onSubmit: SubmitHandler<IRegisterInput> = (data) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success(t('auth.toast.registerSuccess'));
        void navigate(routes.home);
      },
      onError: () => {
        toast.error(t('auth.toast.registerError'));
      },
    });
  };

  return (
    <AuthLayout artVariant='register'>
      <div className='flex w-full flex-col items-center gap-6 text-center'>
        <div className='flex w-full flex-col gap-3'>
          <h1 className='font-heading text-2xl font-bold text-neutral-950 sm:text-[1.75rem] sm:leading-snug'>
            {t('auth.register.title')}
          </h1>
          <p className='text-sm leading-relaxed text-neutral-400'>
            {t('auth.register.subtitle')}
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-4'
          noValidate
        >
          <Input
            label={t('auth.tenantName')}
            placeholder={t('auth.tenantNamePlaceholder')}
            autoComplete='organization'
            {...form.register('tenantName')}
            error={form.formState.errors.tenantName?.message}
          />
          <Input
            label={t('auth.domain')}
            placeholder={t('auth.domainPlaceholder')}
            {...form.register('domain')}
            error={form.formState.errors.domain?.message}
          />
          <FileField
            control={form.control}
            name='logo'
            label={t('auth.logo')}
            hint={t('auth.logoPlaceholder')}
          />

          <div className='grid gap-4 sm:grid-cols-2'>
            <Input
              label={t('auth.firstName')}
              placeholder={t('auth.firstNamePlaceholder')}
              autoComplete='given-name'
              {...form.register('firstName')}
              error={form.formState.errors.firstName?.message}
            />
            <Input
              label={t('auth.lastName')}
              placeholder={t('auth.lastNamePlaceholder')}
              autoComplete='family-name'
              error={form.formState.errors.lastName?.message}
            />
          </div>

          <Input
            label={t('auth.username')}
            placeholder={t('auth.usernamePlaceholder')}
            autoComplete='username'
            {...form.register('username')}
            error={form.formState.errors.username?.message}
          />
          <Input
            label={t('auth.phoneNumber')}
            placeholder={t('auth.phoneNumberPlaceholder')}
            type='tel'
            autoComplete='tel'
            {...form.register('phoneNumber')}
            error={form.formState.errors.phoneNumber?.message}
          />
          <Input
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            type='password'
            autoComplete='new-password'
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <FileField
            control={form.control}
            name='imageProfile'
            label={t('auth.imageProfile')}
            hint={t('auth.imageProfilePlaceholder')}
          />

          <div className='flex w-full flex-col gap-4 pt-1'>
            <Button
              type='submit'
              isLoading={registerMutation.isPending}
              className='h-14 w-full rounded-lg bg-purple-heart-900 text-base font-medium text-white hover:bg-purple-heart-800'
            >
              {t('auth.register.submit')}
            </Button>
            <OrDivider />
            <GoogleButton />
          </div>
        </form>

        <p className='text-sm text-neutral-400'>
          <span>{t('auth.register.hasAccount')} </span>
          <Link
            to={routes.login}
            className='font-medium text-purple-heart-700 hover:underline'
          >
            {t('auth.register.signIn')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
