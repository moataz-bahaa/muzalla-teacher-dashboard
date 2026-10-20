import { useTranslation } from 'react-i18next'
import { ColorPaletteCard } from '../components/color-palette-card'
import { LogoDropzone } from '../components/logo-dropzone'
import { OnboardingNavButtons } from '../components/onboarding-nav-buttons'
import { OnboardingShell } from '../components/onboarding-shell'
import { COLOR_PALETTES } from '../constants'
import { useOnboarding } from '../context/onboarding-context'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'

export const BrandingStep: React.FC = () => {
  const { t } = useTranslation()
  const { state, setLogo, setColorPaletteId } = useOnboarding()
  const { goNext, goBack, skipToComplete } =
    useOnboardingNavigation('branding')

  return (
    <OnboardingShell stepId='branding' showSkip onSkip={skipToComplete}>
      <div className='flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex flex-1 flex-col items-start gap-4 text-start'>
          <h1 className='font-heading text-2xl font-bold text-purple-heart-950 sm:text-4xl'>
            {t('onboarding.branding.title')}
          </h1>
          <p className='max-w-lg text-lg font-medium text-purple-heart-700'>
            {t('onboarding.branding.description')}
          </p>

          <div className='my-4 flex w-full max-w-lg items-center gap-3'>
            <div className='h-px flex-1 bg-neutral-300' />
            <span className='text-lg font-medium text-purple-heart-700'>
              {t('onboarding.branding.or')}
            </span>
            <div className='h-px flex-1 bg-neutral-300' />
          </div>

          <p className='mb-2 w-full max-w-lg text-xl font-medium text-purple-heart-700'>
            {t('onboarding.branding.chooseColors')}
          </p>
        </div>

        <LogoDropzone file={state.logo} onChange={setLogo} />
      </div>

      <div className='mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {COLOR_PALETTES.map((palette) => (
          <ColorPaletteCard
            key={palette.id}
            palette={palette}
            selected={state.colorPaletteId === palette.id}
            onClick={() => setColorPaletteId(palette.id)}
          />
        ))}
      </div>

      <OnboardingNavButtons
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!state.logo && !state.colorPaletteId}
      />
    </OnboardingShell>
  )
}
