import { routes } from '@/routes/routes'
import { useNavigate } from 'react-router-dom'
import { getNextStep, getPreviousStep } from '../constants'
import type { TOnboardingStepId } from '../types'

export function useOnboardingNavigation(stepId: TOnboardingStepId) {
  const navigate = useNavigate()

  const goTo = (step: TOnboardingStepId) => {
    void navigate(routes.onboardingStep(step))
  }

  const goNext = () => {
    const next = getNextStep(stepId)
    if (next) goTo(next)
  }

  const goBack = () => {
    const prev = getPreviousStep(stepId)
    if (prev) goTo(prev)
  }

  const skipToComplete = () => {
    goTo('complete')
  }

  const finish = () => {
    void navigate(routes.home)
  }

  return { goTo, goNext, goBack, skipToComplete, finish }
}
