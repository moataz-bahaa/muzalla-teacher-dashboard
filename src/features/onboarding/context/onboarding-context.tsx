import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_ONBOARDING_STATE } from '../constants'
import type {
  IOnboardingProfile,
  IOnboardingState,
  TAdvantageId,
  TCourseDisplayMode,
  TSectionId,
  TTemplateId,
} from '../types'

interface IOnboardingContextValue {
  state: IOnboardingState
  updateProfile: (profile: Partial<IOnboardingProfile>) => void
  setCourseDisplay: (value: TCourseDisplayMode) => void
  setAdvantage: (value: TAdvantageId) => void
  setLogo: (file: File | null) => void
  setColorPaletteId: (id: string | null) => void
  toggleSection: (id: TSectionId) => void
  setTemplateId: (id: TTemplateId) => void
  reset: () => void
}

const OnboardingContext = createContext<IOnboardingContextValue | null>(null)

interface IOnboardingProviderProps {
  children: ReactNode
}

export const OnboardingProvider: React.FC<IOnboardingProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<IOnboardingState>(DEFAULT_ONBOARDING_STATE)

  const updateProfile = useCallback((profile: Partial<IOnboardingProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }))
  }, [])

  const setCourseDisplay = useCallback((value: TCourseDisplayMode) => {
    setState((prev) => ({ ...prev, courseDisplay: value }))
  }, [])

  const setAdvantage = useCallback((value: TAdvantageId) => {
    setState((prev) => ({ ...prev, advantage: value }))
  }, [])

  const setLogo = useCallback((file: File | null) => {
    setState((prev) => ({ ...prev, logo: file }))
  }, [])

  const setColorPaletteId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, colorPaletteId: id }))
  }, [])

  const toggleSection = useCallback((id: TSectionId) => {
    setState((prev) => {
      const exists = prev.sections.includes(id)
      if (exists) {
        if (id === 'hero') return prev
        return {
          ...prev,
          sections: prev.sections.filter((section) => section !== id),
        }
      }
      return { ...prev, sections: [...prev.sections, id] }
    })
  }, [])

  const setTemplateId = useCallback((id: TTemplateId) => {
    setState((prev) => ({ ...prev, templateId: id }))
  }, [])

  const reset = useCallback(() => {
    setState(DEFAULT_ONBOARDING_STATE)
  }, [])

  const value = useMemo(
    () => ({
      state,
      updateProfile,
      setCourseDisplay,
      setAdvantage,
      setLogo,
      setColorPaletteId,
      toggleSection,
      setTemplateId,
      reset,
    }),
    [
      state,
      updateProfile,
      setCourseDisplay,
      setAdvantage,
      setLogo,
      setColorPaletteId,
      toggleSection,
      setTemplateId,
      reset,
    ],
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding(): IOnboardingContextValue {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
