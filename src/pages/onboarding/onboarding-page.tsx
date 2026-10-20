import { AdvantageStep } from '@/features/onboarding/steps/advantage-step'
import { BrandingStep } from '@/features/onboarding/steps/branding-step'
import { CompleteStep } from '@/features/onboarding/steps/complete-step'
import { CourseDisplayStep } from '@/features/onboarding/steps/course-display-step'
import { GeneratingStep } from '@/features/onboarding/steps/generating-step'
import { IntroStep } from '@/features/onboarding/steps/intro-step'
import { ProfileStep } from '@/features/onboarding/steps/profile-step'
import { SectionsStep } from '@/features/onboarding/steps/sections-step'
import { TemplateStep } from '@/features/onboarding/steps/template-step'
import { OnboardingProvider } from '@/features/onboarding/context/onboarding-context'
import { isOnboardingStepId } from '@/features/onboarding/constants'
import type { TOnboardingStepId } from '@/features/onboarding/types'
import { routes } from '@/routes/routes'
import { Navigate, useParams } from 'react-router-dom'

const STEP_COMPONENTS: Record<TOnboardingStepId, React.FC> = {
  profile: ProfileStep,
  intro: IntroStep,
  'course-display': CourseDisplayStep,
  advantage: AdvantageStep,
  branding: BrandingStep,
  sections: SectionsStep,
  template: TemplateStep,
  generating: GeneratingStep,
  complete: CompleteStep,
}

const OnboardingStepRouter: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>()

  if (!stepId || !isOnboardingStepId(stepId)) {
    return <Navigate to={routes.onboardingStep('profile')} replace />
  }

  const StepComponent = STEP_COMPONENTS[stepId]
  return <StepComponent />
}

export const OnboardingPage: React.FC = () => {
  return (
    <OnboardingProvider>
      <OnboardingStepRouter />
    </OnboardingProvider>
  )
}
