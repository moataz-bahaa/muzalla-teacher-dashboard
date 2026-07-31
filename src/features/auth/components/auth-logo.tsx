import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { routes } from '@/routes/routes'

export const AuthLogo: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Link
      to={routes.login}
      className='flex items-center justify-center gap-1 text-purple-heart-900'
      aria-label={t('common.brand')}
      dir='ltr'
    >
      <img src='/auth/logo-mark.svg' alt='' className='h-11 w-auto' />
      <span className='font-heading text-[2.5rem] font-semibold leading-none tracking-tight lowercase'>
        uzalla
      </span>
    </Link>
  )
}
