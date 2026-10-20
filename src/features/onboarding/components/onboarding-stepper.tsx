import { cn } from '@/lib/utils'
import { STEPPER_STEPS } from '../constants'

interface IOnboardingStepperProps {
  currentStep: number
  className?: string
}

export const OnboardingStepper: React.FC<IOnboardingStepperProps> = ({
  currentStep,
  className,
}) => {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-3xl items-center justify-center gap-0',
        className,
      )}
      role='list'
      aria-label='Setup progress'
    >
      {STEPPER_STEPS.map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber <= currentStep
        const isCurrent = stepNumber === currentStep
        const isLast = index === STEPPER_STEPS.length - 1

        return (
          <div
            key={stepNumber}
            role='listitem'
            className={cn('flex items-center', !isLast && 'flex-1')}
          >
            <div
              className={cn(
                'relative flex size-[34px] shrink-0 items-center justify-center rounded-full text-sm font-medium shadow-sm',
                isActive
                  ? 'bg-purple-heart-700 text-white'
                  : 'bg-neutral-200 text-neutral-800',
                isCurrent && 'ring-2 ring-purple-heart-300 ring-offset-2',
              )}
            >
              {stepNumber}
            </div>
            {!isLast && (
              <div
                className={cn(
                  'mx-2 h-px min-w-8 flex-1',
                  stepNumber < currentStep
                    ? 'bg-purple-heart-700'
                    : 'bg-neutral-300',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
