export type TOnboardingStepId =
  | 'profile'
  | 'intro'
  | 'course-display'
  | 'advantage'
  | 'branding'
  | 'sections'
  | 'template'
  | 'generating'
  | 'complete'

export type TCourseDisplayMode = 'level' | 'academic-year'

export type TAdvantageId = 'exclusive-content' | 'teaching-method' | 'student-support'

export type TSectionId =
  | 'hero'
  | 'about'
  | 'services'
  | 'latest-courses'
  | 'student-reviews'
  | 'pricing'
  | 'full-catalog'
  | 'top-courses'
  | 'footer'
  | 'social'
  | 'student-results'

export type TTemplateId = 'template-a' | 'template-b' | 'template-c'

export interface IColorPalette {
  id: string
  colors: [string, string, string]
}

export interface IOnboardingProfile {
  fullName: string
  websiteName: string
  email: string
  phone: string
  phoneCode: string
  country: string
  language: string
}

export interface IOnboardingState {
  profile: IOnboardingProfile
  courseDisplay: TCourseDisplayMode | null
  advantage: TAdvantageId | null
  logo: File | null
  colorPaletteId: string | null
  sections: TSectionId[]
  templateId: TTemplateId | null
}

export interface IOnboardingOption {
  id: string
  titleKey: string
  descriptionKey: string
}
