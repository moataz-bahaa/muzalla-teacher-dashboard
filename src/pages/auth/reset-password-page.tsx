import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { AuthTextField } from '@/features/auth/components/auth-text-field'
import type { IForgetPasswordFlowState } from '@/features/auth/types'
import {
  resetPasswordSchema,
  type TResetPasswordFormValues,
} from '@/features/auth/schemas/auth-schemas'
import { useAppForm } from '@/hooks/use-app-form'
import { useResetPasswordMutation } from '@/lib/data/auth'
import { routes } from '@/routes/routes'

export const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const flowState = location.state as IForgetPasswordFlowState | null
  const email = flowState?.email
  const code = flowState?.code
  const resetToken = flowState?.resetToken

  const resetPasswordMutation = useResetPasswordMutation()
  const form = useAppForm({
    schema: resetPasswordSchema,
    defaultValues: { password: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (!email || !code) {
      void navigate(routes.forgetPassword, { replace: true })
    }
  }, [code, email, navigate])

  const onSubmit = form.handleSubmit((values: TResetPasswordFormValues) => {
    if (!email || !code) return

    resetPasswordMutation.mutate(
      {
        email,
        code,
        password: values.password,
        resetToken,
      },
      {
        onSuccess: () => {
          toast.success(t('auth.toast.passwordChanged'))
          void navigate(routes.login)
        },
        onError: () => {
          toast.error(t('auth.toast.resetPasswordError'))
        },
      },
    )
  })

  return (
    <AuthLayout artVariant="reset">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <div className="flex w-full flex-col gap-3">
          <h1 className="font-heading text-3xl font-bold text-neutral-950 sm:text-[2rem] sm:leading-tight">
            {t('auth.resetPassword.title')}
          </h1>
          <p className="text-sm leading-relaxed text-neutral-400">
            {t('auth.resetPassword.subtitle')}
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full flex-col gap-5" noValidate>
          <AuthTextField
            control={form.control}
            name="password"
            label={t('auth.resetPassword.newPassword')}
            placeholder={t('auth.passwordPlaceholder')}
            type="password"
            autoComplete="new-password"
          />
          <AuthTextField
            control={form.control}
            name="confirmPassword"
            label={t('auth.resetPassword.confirmPassword')}
            placeholder={t('auth.passwordPlaceholder')}
            type="password"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            isLoading={resetPasswordMutation.isPending}
            className="h-14 w-full rounded-lg bg-purple-heart-900 text-base font-medium text-white hover:bg-purple-heart-800"
          >
            {t('auth.resetPassword.submit')}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
