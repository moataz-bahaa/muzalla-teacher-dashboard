import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export const OrDivider: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation()

  return (
    <div className={cn('flex w-full items-center gap-3 py-2', className)}>
      <div className='h-px flex-1 bg-neutral-200' />
      <span className='text-sm font-medium text-success-900'>{t('common.or')}</span>
      <div className='h-px flex-1 bg-neutral-200' />
    </div>
  )
}
