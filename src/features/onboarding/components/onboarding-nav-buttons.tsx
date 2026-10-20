import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface IOnboardingNavButtonsProps {
  onNext?: () => void
  onBack?: () => void
  nextLabel?: string
  backLabel?: string
  nextDisabled?: boolean
  hideBack?: boolean
  className?: string
}

export const OnboardingNavButtons: React.FC<IOnboardingNavButtonsProps> = ({
  onNext,
  onBack,
  nextLabel,
  backLabel,
  nextDisabled = false,
  hideBack = false,
  className,
}) => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const ForwardIcon = isRtl ? ChevronLeft : ChevronRight
  const BackIcon = isRtl ? ChevronRight : ChevronLeft

  return (
    <div
      className={cn(
        'mt-auto flex w-full flex-wrap items-center justify-center gap-4 pt-10',
        className,
      )}
    >
      {!hideBack && (
        <Button
          type='button'
          variant='outline'
          onClick={onBack}
          className='h-12 w-full max-w-[250px] gap-2 rounded-lg border-neutral-100 bg-neutral-100 text-purple-heart-900 hover:bg-neutral-200'
        >
          <BackIcon className='size-3.5' />
          {backLabel ?? t('onboarding.actions.back')}
        </Button>
      )}
      <Button
        type='button'
        variant='purple'
        onClick={onNext}
        disabled={nextDisabled}
        className='h-12 w-full max-w-[250px] gap-2 rounded-lg text-sm'
      >
        {nextLabel ?? t('onboarding.actions.next')}
        <ForwardIcon className='size-3.5' />
      </Button>
    </div>
  )
}
