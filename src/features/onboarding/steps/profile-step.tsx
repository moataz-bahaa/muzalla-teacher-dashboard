import { Input } from '@/components/ui/form/input'
import { SelectField } from '@/components/ui/form/select-field'
import { useTranslation } from 'react-i18next'
import { OnboardingNavButtons } from '../components/onboarding-nav-buttons'
import { OnboardingShell } from '../components/onboarding-shell'
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  PHONE_CODE_OPTIONS,
} from '../constants'
import { useOnboarding } from '../context/onboarding-context'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'

export const ProfileStep: React.FC = () => {
  const { t } = useTranslation()
  const { state, updateProfile } = useOnboarding()
  const { goNext } = useOnboardingNavigation('profile')
  const { profile } = state

  const domainPreview = profile.websiteName.trim()
    ? `${profile.websiteName.trim().toLowerCase().replace(/\s+/g, '')}.muzalla.com`
    : 'your-site.muzalla.com'

  const canContinue =
    profile.fullName.trim().length > 0 &&
    profile.websiteName.trim().length > 0 &&
    profile.email.trim().length > 0

  return (
    <OnboardingShell stepId='profile' contentClassName='max-w-5xl'>
      <div className='mb-10 w-full text-center'>
        <h1 className='font-heading text-3xl font-bold text-purple-heart-950 sm:text-5xl'>
          {t('onboarding.profile.title')}
        </h1>
        <p className='mt-3 text-xl font-bold text-purple-heart-800 sm:text-3xl'>
          {t('onboarding.profile.subtitle')}
        </p>
      </div>

      <div className='mb-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-3'>
        {[
          {
            icon: '/onboarding/code-browser.svg',
            label: t('onboarding.profile.benefits.noCode'),
          },
          {
            icon: '/onboarding/credit-card.svg',
            label: t('onboarding.profile.benefits.noFees'),
          },
          {
            icon: '/onboarding/hourglass.svg',
            label: t('onboarding.profile.benefits.noWait'),
          },
        ].map((benefit) => (
          <div
            key={benefit.label}
            className='flex flex-col items-center gap-3 text-center'
          >
            <img src={benefit.icon} alt='' width={48} height={48} className='size-12' />
            <p className='text-lg font-medium text-purple-heart-950 sm:text-2xl'>
              {benefit.label}
            </p>
          </div>
        ))}
      </div>

      <div className='grid w-full grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2'>
        <Input
          label={t('onboarding.profile.fields.fullName')}
          placeholder='Ali Sayed Hassan'
          value={profile.fullName}
          onChange={(event) => updateProfile({ fullName: event.target.value })}
          className='bg-white shadow-sm'
        />
        <div className='flex flex-col gap-1.5'>
          <Input
            label={t('onboarding.profile.fields.websiteName')}
            placeholder='Ekhledis'
            value={profile.websiteName}
            onChange={(event) =>
              updateProfile({ websiteName: event.target.value })
            }
            className='bg-white shadow-sm'
          />
          <p className='text-[13px] font-medium text-purple-heart-800'>
            {t('onboarding.profile.domainLabel')}: {domainPreview}
          </p>
        </div>
        <Input
          label={t('onboarding.profile.fields.email')}
          type='email'
          placeholder='Ali@gmail.com'
          value={profile.email}
          onChange={(event) => updateProfile({ email: event.target.value })}
          className='bg-white shadow-sm'
        />
        <div className='flex w-full flex-col gap-1.5'>
          <label className='text-sm font-medium text-neutral-800'>
            {t('onboarding.profile.fields.phone')}
          </label>
          <div className='flex h-12 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm'>
            <select
              value={profile.phoneCode}
              onChange={(event) =>
                updateProfile({ phoneCode: event.target.value })
              }
              className='w-20 border-e border-neutral-200 bg-transparent px-2 text-sm font-bold text-neutral-500 outline-none'
            >
              {PHONE_CODE_OPTIONS.map((code) => (
                <option key={code.value} value={code.value}>
                  {code.label}
                </option>
              ))}
            </select>
            <input
              value={profile.phone}
              onChange={(event) => updateProfile({ phone: event.target.value })}
              placeholder='1063010392'
              className='min-w-0 flex-1 bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400'
            />
          </div>
        </div>
        <SelectField
          label={t('onboarding.profile.fields.country')}
          value={profile.country}
          onChange={(value) => updateProfile({ country: value })}
          options={COUNTRY_OPTIONS.map((option) => ({
            value: option.value,
            label: t(option.labelKey),
          }))}
          className='[&_button]:h-12 [&_button]:bg-white [&_button]:shadow-sm'
        />
        <SelectField
          label={t('onboarding.profile.fields.language')}
          value={profile.language}
          onChange={(value) => updateProfile({ language: value })}
          options={LANGUAGE_OPTIONS.map((option) => ({
            value: option.value,
            label: t(option.labelKey),
          }))}
          className='[&_button]:h-12 [&_button]:bg-white [&_button]:shadow-sm'
        />
      </div>

      <p className='mt-10 text-center text-sm text-purple-heart-950'>
        {t('onboarding.profile.legal.prefix')}{' '}
        <a href='#' className='text-purple-heart-700 underline'>
          {t('onboarding.profile.legal.agreement')}
        </a>{' '}
        {t('onboarding.profile.legal.and')}{' '}
        <a href='#' className='text-purple-heart-700 underline'>
          {t('onboarding.profile.legal.privacy')}
        </a>
      </p>

      <OnboardingNavButtons
        hideBack
        onNext={goNext}
        nextDisabled={!canContinue}
      />
    </OnboardingShell>
  )
}
