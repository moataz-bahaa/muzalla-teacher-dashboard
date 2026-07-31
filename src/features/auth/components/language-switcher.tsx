import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { i18n, t } = useTranslation()
  const current = i18n.language.startsWith('ar') ? 'ar' : 'en'

  const setLanguage = (lng: 'en' | 'ar') => {
    void i18n.changeLanguage(lng)
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-0.5 text-xs font-medium',
        className,
      )}
      role='group'
      aria-label={t('common.language')}
    >
      <button
        type='button'
        onClick={() => setLanguage('en')}
        className={cn(
          'rounded-md px-2.5 py-1 transition-colors',
          current === 'en'
            ? 'bg-purple-heart-900 text-white'
            : 'text-neutral-500 hover:text-purple-heart-900',
        )}
      >
        {t('common.english')}
      </button>
      <button
        type='button'
        onClick={() => setLanguage('ar')}
        className={cn(
          'rounded-md px-2.5 py-1 transition-colors',
          current === 'ar'
            ? 'bg-purple-heart-900 text-white'
            : 'text-neutral-500 hover:text-purple-heart-900',
        )}
      >
        {t('common.arabic')}
      </button>
    </div>
  )
}
