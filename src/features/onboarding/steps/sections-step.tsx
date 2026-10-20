import { useTranslation } from 'react-i18next'
import { OnboardingNavButtons } from '../components/onboarding-nav-buttons'
import { OnboardingOptionCard } from '../components/onboarding-option-card'
import { OnboardingShell } from '../components/onboarding-shell'
import { SECTION_OPTIONS } from '../constants'
import { useOnboarding } from '../context/onboarding-context'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'
import type { TSectionId } from '../types'

export const SectionsStep: React.FC = () => {
  const { t } = useTranslation()
  const { state, toggleSection } = useOnboarding()
  const { goNext, goBack, skipToComplete } =
    useOnboardingNavigation('sections')

  return (
    <OnboardingShell stepId='sections' showSkip onSkip={skipToComplete}>
      <h1 className='mb-10 max-w-3xl text-center font-heading text-2xl font-bold text-purple-heart-950 sm:text-4xl'>
        {t('onboarding.sections.title')}
      </h1>

      <div className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {SECTION_OPTIONS.map((option) => (
          <OnboardingOptionCard
            key={option.id}
            titleKey={option.titleKey}
            descriptionKey={option.descriptionKey}
            selected={state.sections.includes(option.id as TSectionId)}
            onClick={() => toggleSection(option.id as TSectionId)}
            multi
            className='min-h-[100px]'
          />
        ))}
      </div>

      <OnboardingNavButtons
        onBack={goBack}
        onNext={goNext}
        nextDisabled={state.sections.length === 0}
      />
    </OnboardingShell>
  )
}
