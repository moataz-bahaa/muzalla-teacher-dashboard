import { cn } from '@/lib/utils'
import { CheckCircle2, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OnboardingShell } from '../components/onboarding-shell'
import { GENERATING_TASKS } from '../constants'
import { useOnboardingNavigation } from '../hooks/use-onboarding-navigation'

const TASK_THRESHOLDS = [20, 40, 60, 80, 100]

export const GeneratingStep: React.FC = () => {
  const { t } = useTranslation()
  const { goNext } = useOnboardingNavigation('generating')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 80)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress < 100) return
    const timeout = window.setTimeout(() => {
      goNext()
    }, 600)
    return () => window.clearTimeout(timeout)
    // Navigate once when the simulated build finishes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goNext is stable for this step
  }, [progress])

  return (
    <OnboardingShell stepId='generating' contentClassName='justify-center'>
      <div className='flex w-full max-w-md flex-col items-end gap-3'>
        {GENERATING_TASKS.map((taskKey, index) => {
          const done = progress >= TASK_THRESHOLDS[index]
          return (
            <div key={taskKey} className='flex items-center gap-3'>
              <p
                className={cn(
                  'text-lg font-medium',
                  done ? 'text-neutral-800' : 'text-neutral-400',
                )}
              >
                {t(taskKey)}
              </p>
              {done ? (
                <CheckCircle2 className='size-6 text-success-500' />
              ) : (
                <Circle className='size-6 text-neutral-300' />
              )}
            </div>
          )
        })}
      </div>

      <div className='relative mt-16 w-full max-w-3xl'>
        <div
          className='absolute -top-10 transition-all'
          style={{
            insetInlineStart: `calc(${Math.min(progress, 96)}% - 20px)`,
          }}
        >
          <div className='rounded-md bg-purple-heart-700 px-2 py-1.5 text-sm font-medium text-white'>
            {progress}%
          </div>
          <div className='mx-auto h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-purple-heart-700' />
        </div>
        <div className='relative h-2.5 w-full overflow-hidden rounded-full bg-neutral-300'>
          <div
            className='absolute inset-y-0 start-0 rounded-full bg-gradient-to-l from-purple-heart-700 to-purple-heart-900 transition-all duration-100'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </OnboardingShell>
  )
}
