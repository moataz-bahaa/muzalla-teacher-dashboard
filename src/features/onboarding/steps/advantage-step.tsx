import { useTranslation } from 'react-i18next'
import { OnboardingNavButtons } from '../components/onboarding-nav-buttons'
import { OnboardingOptionCard } from '../components/onboarding-option-card'
import { OnboardingShell } from '../components/onboarding-shell'
import { ADVANTAGE_OPTIONS } from '../constants'
import { useOnboarding } from '../context/onboarding-context'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'
import type { TAdvantageId } from '../types'

export const AdvantageStep: React.FC = () => {
  const { t } = useTranslation()
  const { state, setAdvantage } = useOnboarding()
  const { goNext, goBack, skipToComplete } =
    useOnboardingNavigation('advantage')

  return (
    <OnboardingShell stepId='advantage' showSkip onSkip={skipToComplete}>
      <h1 className='mb-12 max-w-3xl text-center font-heading text-2xl font-bold text-purple-heart-950 sm:text-4xl'>
        {t('onboarding.advantage.title')}
      </h1>

      <div className='grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-3'>
        {ADVANTAGE_OPTIONS.map((option) => (
          <OnboardingOptionCard
            key={option.id}
            titleKey={option.titleKey}
            descriptionKey={option.descriptionKey}
            selected={state.advantage === option.id}
            onClick={() => setAdvantage(option.id as TAdvantageId)}
            className='min-h-[138px]'
          />
        ))}
      </div>

      <OnboardingNavButtons
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!state.advantage}
      />
    </OnboardingShell>
  )
}
