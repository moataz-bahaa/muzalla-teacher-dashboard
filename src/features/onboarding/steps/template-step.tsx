import { useTranslation } from 'react-i18next'
import { OnboardingNavButtons } from '../components/onboarding-nav-buttons'
import { OnboardingShell } from '../components/onboarding-shell'
import { TemplatePreviewCard } from '../components/template-preview-card'
import { TEMPLATE_IDS } from '../constants'
import { useOnboarding } from '../context/onboarding-context'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'

export const TemplateStep: React.FC = () => {
  const { t } = useTranslation()
  const { state, setTemplateId } = useOnboarding()
  const { goNext, goBack, skipToComplete } =
    useOnboardingNavigation('template')

  return (
    <OnboardingShell stepId='template' showSkip onSkip={skipToComplete}>
      <h1 className='mb-10 max-w-3xl text-center font-heading text-2xl font-bold text-purple-heart-950 sm:text-4xl'>
        {t('onboarding.template.title')}
      </h1>

      <div className='flex w-full flex-wrap items-start justify-center gap-8'>
        {TEMPLATE_IDS.map((id) => (
          <TemplatePreviewCard
            key={id}
            id={id}
            selected={state.templateId === id}
            onClick={() => setTemplateId(id)}
          />
        ))}
      </div>

      <OnboardingNavButtons
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!state.templateId}
      />
    </OnboardingShell>
  )
}
