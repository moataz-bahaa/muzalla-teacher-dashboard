import { useTranslation } from 'react-i18next'
import type { TAuthArtVariant } from '@/features/auth/components/auth-art-panel'
import { AuthArtPanel } from '@/features/auth/components/auth-art-panel'
import { AuthLogo } from '@/features/auth/components/auth-logo'
import { LanguageSwitcher } from '@/features/auth/components/language-switcher'
import { cn } from '@/lib/utils'

interface IAuthLayoutProps {
  children: React.ReactNode
  artVariant?: TAuthArtVariant
  className?: string
}

export const AuthLayout: React.FC<IAuthLayoutProps> = ({
  children,
  artVariant = 'login',
  className,
}) => {
  const { i18n } = useTranslation()
  const formDir = i18n.language.startsWith('ar') ? 'rtl' : 'ltr'

  return (
    <div className='relative flex min-h-svh items-center justify-center bg-neutral-200 p-4 sm:p-6 lg:p-10'>
      <LanguageSwitcher className='absolute end-4 top-4 z-20 sm:end-6 sm:top-6' />

      <div
        dir='ltr'
        className='flex w-full max-w-360 flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:min-h-[640px] lg:flex-row lg:items-stretch lg:gap-7 lg:p-8'
      >
        <div className='w-full shrink-0 lg:w-[46%]'>
          <AuthArtPanel variant={artVariant} />
        </div>

        <div
          dir={formDir}
          className={cn(
            'mx-auto flex w-full max-w-100 flex-1 flex-col items-center justify-center gap-8 py-2 lg:py-6',
            className,
          )}
        >
          <AuthLogo />
          {children}
        </div>
      </div>
    </div>
  )
}
