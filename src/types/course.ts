export type TCourseStatus = 'published' | 'inactive'
export type TPricingType = 'subscription' | 'fixed'

export interface ICourse {
  id: number
  title: string
  description: string
  coverUrl: string
  tags: string[]
  price: number
  currency: string
  publishedAt: string
  status: TCourseStatus
  level?: string
  pricingType: TPricingType
  allowMarketplace?: boolean
}

export interface ICourseFilters {
  keywords: string
  tags: string[]
  priceFrom: number
  priceTo: number
}

export interface ICreateCourseFormValues {
  title: string
  tags: string[]
  level: string
  description: string
  pricingType: TPricingType
  price: number | null
  allowMarketplace: boolean
  coverUrl: string | null
}

export interface IDeleteCourseModalData {
  course: ICourse
}
