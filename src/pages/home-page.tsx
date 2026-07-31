import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { routes } from '@/routes/routes'
import { Button } from '@/components/ui/button'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
          {t('common.brand')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('common.teacherDashboard')}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="bg-purple-heart-900 hover:bg-purple-heart-800">
          <Link to={routes.courses}>{t('courses.title')}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={routes.login}>{t('auth.login.submit')}</Link>
        </Button>
      </div>
    </div>
  )
}
