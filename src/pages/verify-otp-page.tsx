import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { AuthTextField } from '@/features/auth/components/auth-text-field'
import {
  verifyOtpSchema,
  type TVerifyOtpFormValues,
} from '@/features/auth/schemas/auth-schemas'
import { useAppForm } from '@/hooks/use-app-form'
import { routes } from '@/routes/routes'

export const VerifyOtpPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const form = useAppForm({
    schema: verifyOtpSchema,
    defaultValues: { code: '' },
  })

  const onSubmit = form.handleSubmit((_values: TVerifyOtpFormValues) => {
    toast.success(t('auth.toast.otpVerified'))
    void navigate(routes.resetPassword)
  })

  return (
    <AuthLayout artVariant='otp'>
      <div className='flex w-full flex-col items-center gap-6 text-center'>
        <div className='flex w-full flex-col gap-3'>
          <h1 className='font-heading text-3xl font-bold text-neutral-950 sm:text-[2rem] sm:leading-tight'>
            {t('auth.verifyOtp.title')}
          </h1>
          <p className='text-sm leading-relaxed text-neutral-400'>
            {t('auth.verifyOtp.subtitle')}
          </p>
        </div>

        <form onSubmit={onSubmit} className='flex w-full flex-col gap-6' noValidate>
          <AuthTextField
            control={form.control}
            name='code'
            label={t('auth.verifyOtp.codeLabel')}
            placeholder={t('auth.verifyOtp.codePlaceholder')}
            type='text'
            autoComplete='one-time-code'
          />

          <Button
            type='submit'
            className='h-14 w-full rounded-lg bg-purple-heart-900 text-base font-medium text-white hover:bg-purple-heart-800'
          >
            {t('auth.verifyOtp.submit')}
          </Button>
        </form>

        <p className='text-sm text-neutral-400'>
          <span>{t('auth.verifyOtp.didNotReceive')} </span>
          <button
            type='button'
            className='font-medium text-purple-heart-700 underline-offset-2 hover:underline'
            onClick={() => toast.message(t('auth.toast.resendCode'))}
          >
            {t('auth.verifyOtp.resend')}
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
