import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { routes } from '@/routes/routes'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <main className='flex min-h-svh flex-col items-center justify-center gap-6 p-8'>
      <div className='text-center'>
        <h1 className='font-heading text-4xl font-bold tracking-tight text-foreground'>
          {t('common.brand')}
        </h1>
        <p className='mt-2 text-muted-foreground'>{t('common.teacherDashboard')}</p>
      </div>
      <Link
        to={routes.login}
        className='rounded-lg bg-purple-heart-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-heart-800'
      >
        {t('auth.login.submit')}
      </Link>
    </main>
  )
}

