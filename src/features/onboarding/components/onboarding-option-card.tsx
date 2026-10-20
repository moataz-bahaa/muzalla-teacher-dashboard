import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface IOnboardingOptionCardProps {
  titleKey: string
  descriptionKey: string
  selected?: boolean
  onClick?: () => void
  multi?: boolean
  className?: string
}

export const OnboardingOptionCard: React.FC<IOnboardingOptionCardProps> = ({
  titleKey,
  descriptionKey,
  selected = false,
  onClick,
  multi = false,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex h-full w-full flex-col gap-3 rounded-xl border-2 p-5 text-start transition-colors',
        selected
          ? 'border-purple-heart-700 bg-purple-heart-100'
          : 'border-neutral-200 bg-neutral-100 hover:border-neutral-300',
        className,
      )}
    >
      <div className='flex w-full items-start justify-between gap-3'>
        <div className='min-w-0 flex-1 text-start'>
          <p
            className={cn(
              'text-sm font-medium',
              selected ? 'text-purple-heart-700' : 'text-purple-heart-950',
              multi && selected && 'text-base',
            )}
          >
            {t(titleKey)}
          </p>
        </div>
        <div
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
            selected
              ? 'border-purple-heart-700 bg-purple-heart-700 text-white'
              : 'border-neutral-300 bg-white',
          )}
        >
          {selected && <Check className='size-3' strokeWidth={3} />}
        </div>
      </div>
      <p
        className={cn(
          'text-start text-xs leading-[18px]',
          selected ? 'text-purple-heart-900' : 'text-purple-heart-950',
        )}
      >
        {t(descriptionKey)}
      </p>
    </button>
  )
}
