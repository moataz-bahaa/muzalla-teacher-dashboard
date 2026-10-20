import { useTranslation } from 'react-i18next'
import { OnboardingNavButtons } from '../components/onboarding-nav-buttons'
import { OnboardingOptionCard } from '../components/onboarding-option-card'
import { OnboardingShell } from '../components/onboarding-shell'
import { COURSE_DISPLAY_OPTIONS } from '../constants'
import { useOnboarding } from '../context/onboarding-context'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'
import type { TCourseDisplayMode } from '../types'

export const CourseDisplayStep: React.FC = () => {
  const { t } = useTranslation()
  const { state, setCourseDisplay } = useOnboarding()
  const { goNext, goBack, skipToComplete } = useOnboardingNavigation(
    'course-display',
  )

  return (
    <OnboardingShell
      stepId='course-display'
      showSkip
      onSkip={skipToComplete}
    >
      <h1 className='mb-12 max-w-3xl text-center font-heading text-2xl font-bold text-purple-heart-950 sm:text-4xl'>
        {t('onboarding.courseDisplay.title')}
      </h1>

      <div className='grid w-full max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2'>
        {COURSE_DISPLAY_OPTIONS.map((option) => (
          <OnboardingOptionCard
            key={option.id}
            titleKey={option.titleKey}
            descriptionKey={option.descriptionKey}
            selected={state.courseDisplay === option.id}
            onClick={() => setCourseDisplay(option.id as TCourseDisplayMode)}
            className='min-h-[138px]'
          />
        ))}
      </div>

      <OnboardingNavButtons
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!state.courseDisplay}
      />
    </OnboardingShell>
  )
}
