import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { AuthTextField } from '@/features/auth/components/auth-text-field'
import { GoogleButton } from '@/features/auth/components/google-button'
import { OrDivider } from '@/features/auth/components/or-divider'
import {
  registerSchema,
  type TRegisterFormValues,
} from '@/features/auth/schemas/auth-schemas'
import { useAppForm } from '@/hooks/use-app-form'
import { routes } from '@/routes/routes'

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const form = useAppForm({
    schema: registerSchema,
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = form.handleSubmit((_values: TRegisterFormValues) => {
    toast.success(t('auth.toast.registerSuccess'))
    void navigate(routes.home)
  })

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

        <form onSubmit={onSubmit} className='flex w-full flex-col gap-5' noValidate>
          <AuthTextField
            control={form.control}
            name='email'
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            type='email'
            autoComplete='email'
          />
          <AuthTextField
            control={form.control}
            name='password'
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            type='password'
            autoComplete='new-password'
          />
          <AuthTextField
            control={form.control}
            name='confirmPassword'
            label={t('auth.confirmPassword')}
            placeholder={t('auth.passwordPlaceholder')}
            type='password'
            autoComplete='new-password'
          />

          <div className='flex w-full flex-col gap-4'>
            <Button
              type='submit'
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
          <Link to={routes.login} className='font-medium text-purple-heart-700 hover:underline'>
            {t('auth.register.signIn')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
