import type {
  IColorPalette,
  IOnboardingOption,
  IOnboardingState,
  TOnboardingStepId,
  TSectionId,
  TTemplateId,
} from './types'

export const ONBOARDING_STEPS: TOnboardingStepId[] = [
  'profile',
  'intro',
  'course-display',
  'advantage',
  'branding',
  'sections',
  'template',
  'generating',
  'complete',
]

/** Steps that show the 1–5 progress stepper (Figma setup wizard). */
export const STEPPER_STEPS: TOnboardingStepId[] = [
  'course-display',
  'advantage',
  'branding',
  'sections',
  'template',
]

export const STEPPER_STEP_NUMBER: Record<
  (typeof STEPPER_STEPS)[number],
  number
> = {
  'course-display': 1,
  advantage: 2,
  branding: 3,
  sections: 4,
  template: 5,
}

export const DEFAULT_ONBOARDING_STATE: IOnboardingState = {
  profile: {
    fullName: '',
    websiteName: '',
    email: '',
    phone: '',
    phoneCode: '+20',
    country: 'eg',
    language: 'en',
  },
  courseDisplay: null,
  advantage: null,
  logo: null,
  colorPaletteId: null,
  sections: ['hero'],
  templateId: null,
}

export const COURSE_DISPLAY_OPTIONS: IOnboardingOption[] = [
  {
    id: 'level',
    titleKey: 'onboarding.courseDisplay.options.level.title',
    descriptionKey: 'onboarding.courseDisplay.options.level.description',
  },
  {
    id: 'academic-year',
    titleKey: 'onboarding.courseDisplay.options.academicYear.title',
    descriptionKey: 'onboarding.courseDisplay.options.academicYear.description',
  },
]

export const ADVANTAGE_OPTIONS: IOnboardingOption[] = [
  {
    id: 'exclusive-content',
    titleKey: 'onboarding.advantage.options.exclusiveContent.title',
    descriptionKey: 'onboarding.advantage.options.exclusiveContent.description',
  },
  {
    id: 'teaching-method',
    titleKey: 'onboarding.advantage.options.teachingMethod.title',
    descriptionKey: 'onboarding.advantage.options.teachingMethod.description',
  },
  {
    id: 'student-support',
    titleKey: 'onboarding.advantage.options.studentSupport.title',
    descriptionKey: 'onboarding.advantage.options.studentSupport.description',
  },
]

export const SECTION_OPTIONS: IOnboardingOption[] = [
  {
    id: 'hero',
    titleKey: 'onboarding.sections.options.hero.title',
    descriptionKey: 'onboarding.sections.options.hero.description',
  },
  {
    id: 'about',
    titleKey: 'onboarding.sections.options.about.title',
    descriptionKey: 'onboarding.sections.options.about.description',
  },
  {
    id: 'services',
    titleKey: 'onboarding.sections.options.services.title',
    descriptionKey: 'onboarding.sections.options.services.description',
  },
  {
    id: 'latest-courses',
    titleKey: 'onboarding.sections.options.latestCourses.title',
    descriptionKey: 'onboarding.sections.options.latestCourses.description',
  },
  {
    id: 'full-catalog',
    titleKey: 'onboarding.sections.options.fullCatalog.title',
    descriptionKey: 'onboarding.sections.options.fullCatalog.description',
  },
  {
    id: 'top-courses',
    titleKey: 'onboarding.sections.options.topCourses.title',
    descriptionKey: 'onboarding.sections.options.topCourses.description',
  },
  {
    id: 'student-reviews',
    titleKey: 'onboarding.sections.options.studentReviews.title',
    descriptionKey: 'onboarding.sections.options.studentReviews.description',
  },
  {
    id: 'pricing',
    titleKey: 'onboarding.sections.options.pricing.title',
    descriptionKey: 'onboarding.sections.options.pricing.description',
  },
  {
    id: 'social',
    titleKey: 'onboarding.sections.options.social.title',
    descriptionKey: 'onboarding.sections.options.social.description',
  },
  {
    id: 'student-results',
    titleKey: 'onboarding.sections.options.studentResults.title',
    descriptionKey: 'onboarding.sections.options.studentResults.description',
  },
  {
    id: 'footer',
    titleKey: 'onboarding.sections.options.footer.title',
    descriptionKey: 'onboarding.sections.options.footer.description',
  },
]

export const COLOR_PALETTES: IColorPalette[] = [
  { id: 'purple', colors: ['#a370f7', '#fffbf6', '#504746'] },
  { id: 'maroon', colors: ['#8b1e3f', '#fffbf6', '#23395b'] },
  { id: 'blue', colors: ['#6ea8fe', '#fffbf6', '#474973'] },
  { id: 'cyan', colors: ['#7ed1ed', '#fffbf6', '#fde5c1'] },
  { id: 'sky', colors: ['#5dade2', '#fff8e7', '#d4a574'] },
  { id: 'lavender', colors: ['#d2c4fb', '#fffbf6', '#aff8c8'] },
  { id: 'plum', colors: ['#51344d', '#fffbf6', '#e17726'] },
  { id: 'red', colors: ['#c0392b', '#fffbf6', '#0f1013'] },
]

export const TEMPLATE_IDS: TTemplateId[] = [
  'template-a',
  'template-b',
  'template-c',
]

export const GENERATING_TASKS = [
  'onboarding.generating.tasks.colors',
  'onboarding.generating.tasks.images',
  'onboarding.generating.tasks.sections',
  'onboarding.generating.tasks.content',
  'onboarding.generating.tasks.finalize',
] as const

export const COUNTRY_OPTIONS = [
  { value: 'eg', labelKey: 'onboarding.profile.countries.eg' },
  { value: 'sa', labelKey: 'onboarding.profile.countries.sa' },
  { value: 'ae', labelKey: 'onboarding.profile.countries.ae' },
  { value: 'kw', labelKey: 'onboarding.profile.countries.kw' },
  { value: 'qa', labelKey: 'onboarding.profile.countries.qa' },
] as const

export const LANGUAGE_OPTIONS = [
  { value: 'en', labelKey: 'onboarding.profile.languages.en' },
  { value: 'ar', labelKey: 'onboarding.profile.languages.ar' },
] as const

export const PHONE_CODE_OPTIONS = [
  { value: '+20', label: '+20' },
  { value: '+966', label: '+966' },
  { value: '+971', label: '+971' },
  { value: '+965', label: '+965' },
  { value: '+974', label: '+974' },
] as const

export function isSectionId(value: string): value is TSectionId {
  return SECTION_OPTIONS.some((option) => option.id === value)
}

export function getNextStep(step: TOnboardingStepId): TOnboardingStepId | null {
  const index = ONBOARDING_STEPS.indexOf(step)
  if (index < 0 || index >= ONBOARDING_STEPS.length - 1) return null
  return ONBOARDING_STEPS[index + 1]
}

export function getPreviousStep(
  step: TOnboardingStepId,
): TOnboardingStepId | null {
  const index = ONBOARDING_STEPS.indexOf(step)
  if (index <= 0) return null
  return ONBOARDING_STEPS[index - 1]
}

export function isOnboardingStepId(value: string): value is TOnboardingStepId {
  return ONBOARDING_STEPS.includes(value as TOnboardingStepId)
}
