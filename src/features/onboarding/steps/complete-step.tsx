import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { OnboardingShell } from '../components/onboarding-shell'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'

const CONFETTI_COLORS = ['#6900ee', '#4900a7', '#edecff', '#f97316', '#3b82f6', '#ef4444']

function fireConfetti() {
  const defaults = {
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
  }

  void confetti({
    ...defaults,
    particleCount: 80,
    spread: 70,
    origin: { y: 0.35 },
  })

  window.setTimeout(() => {
    void confetti({
      ...defaults,
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.55 },
    })
  }, 200)

  window.setTimeout(() => {
    void confetti({
      ...defaults,
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.55 },
    })
  }, 350)
}

export const CompleteStep: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { finish } = useOnboardingNavigation('complete')
  const isRtl = i18n.dir() === 'rtl'
  const ForwardIcon = isRtl ? ChevronLeft : ChevronRight

  useEffect(() => {
    fireConfetti()
  }, [])

  return (
    <OnboardingShell stepId='complete' contentClassName='relative justify-center'>
      <div className='relative z-10 flex flex-col items-center gap-16 px-4 text-center'>
        <h1 className='max-w-2xl font-heading text-3xl font-bold text-purple-heart-700 sm:text-5xl'>
          {t('onboarding.complete.title')}
        </h1>
        <Button
          type='button'
          variant='purple'
          onClick={finish}
          className='h-12 w-full max-w-[250px] gap-2 rounded-lg text-sm'
        >
          {t('onboarding.complete.cta')}
          <ForwardIcon className='size-3.5' />
        </Button>
      </div>
    </OnboardingShell>
  )
}
