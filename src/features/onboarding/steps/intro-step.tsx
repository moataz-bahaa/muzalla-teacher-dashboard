import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { OnboardingShell } from '../components/onboarding-shell'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'

export const IntroStep: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { goNext, goBack } = useOnboardingNavigation('intro')
  const isRtl = i18n.dir() === 'rtl'
  const ForwardIcon = isRtl ? ChevronLeft : ChevronRight

  return (
    <OnboardingShell stepId='intro' contentClassName='justify-center'>
      <div className='flex max-w-4xl flex-col items-center gap-8 px-4 text-center'>
        <h1 className='font-heading text-3xl font-bold leading-tight text-purple-heart-950 sm:text-5xl'>
          {t('onboarding.intro.title')}
        </h1>
        <p className='text-xl font-medium text-purple-heart-700 sm:text-2xl'>
          {t('onboarding.intro.subtitle')}
        </p>
        <div className='flex flex-wrap items-center justify-center gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={goBack}
            className='h-14 rounded-md border-neutral-200 bg-white px-8 text-purple-heart-900'
          >
            {t('onboarding.actions.back')}
          </Button>
          <Button
            type='button'
            variant='purple'
            onClick={goNext}
            className='h-14 gap-2 rounded-md px-14 text-lg'
          >
            {t('onboarding.intro.cta')}
            <ForwardIcon className='size-6' />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  )
}
