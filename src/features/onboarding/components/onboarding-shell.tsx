import { PageBreadcrumb } from '@/components/page-breadcrumb'
import { routes } from '@/routes/routes'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { STEPPER_STEP_NUMBER, STEPPER_STEPS } from '../constants'
import type { TOnboardingStepId } from '../types'
import { OnboardingStepper } from './onboarding-stepper'

interface IOnboardingShellProps {
  stepId: TOnboardingStepId
  children: ReactNode
  onSkip?: () => void
  showSkip?: boolean
  className?: string
  contentClassName?: string
}

const OnboardingBreadcrumb: React.FC = () => {
  const { t } = useTranslation()
  const [slot, setSlot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setSlot(document.getElementById('dashboard-breadcrumb'))
  }, [])

  if (!slot) return null

  return createPortal(
    <PageBreadcrumb
      items={[
        { label: t('dashboard.home'), to: routes.home },
        { label: t('onboarding.breadcrumb') },
      ]}
    />,
    slot,
  )
}

export const OnboardingShell: React.FC<IOnboardingShellProps> = ({
  stepId,
  children,
  onSkip,
  showSkip = false,
  className,
  contentClassName,
}) => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const SkipIcon = isRtl ? ChevronLeft : ChevronRight
  const showStepper = STEPPER_STEPS.includes(
    stepId as (typeof STEPPER_STEPS)[number],
  )
  const stepperNumber = showStepper
    ? STEPPER_STEP_NUMBER[stepId as (typeof STEPPER_STEPS)[number]]
    : 0

  return (
    <div className={cn('relative flex min-h-[calc(100svh-8rem)] flex-col', className)}>
      <OnboardingBreadcrumb />

      {(showStepper || showSkip) && (
        <div className='mb-8 flex items-center justify-between gap-4'>
          <div className='hidden w-20 sm:block' />
          {showStepper ? (
            <OnboardingStepper currentStep={stepperNumber} className='flex-1' />
          ) : (
            <div className='flex-1' />
          )}
          {showSkip ? (
            <button
              type='button'
              onClick={onSkip}
              className='inline-flex shrink-0 items-center gap-1 text-xl font-medium text-purple-heart-900 hover:text-purple-heart-700'
            >
              {t('onboarding.actions.skip')}
              <SkipIcon className='size-6' />
            </button>
          ) : (
            <div className='hidden w-20 sm:block' />
          )}
        </div>
      )}

      <div
        className={cn(
          'mx-auto flex w-full max-w-6xl flex-1 flex-col items-center',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
