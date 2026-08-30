export type TCourseStatus = 'published' | 'inactive';
export type TPricingType = 'subscription' | 'fixed';
export type TCourseLessonType = 'video' | 'quiz' | 'article';

export interface ICourseLesson {
  id: number;
  title: string;
  type: TCourseLessonType;
  duration?: string;
}

export interface ICourse {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  tags: string[];
  price: number;
  currency: string;
  publishedAt: string;
  status: TCourseStatus;
  level?: string;
  pricingType: TPricingType;
  allowMarketplace?: boolean;
  instructor: string;
  subject: string;
  academicYear: string;
  outcomes?: string[];
  lessons?: ICourseLesson[];
}

export interface IGetCoursesParams {
  keywords: string;
  tags: string[];
  priceFrom: number;
  priceTo: number;
  search?: string;
  page?: number;
}

export interface ICreateCourseFormValues {
  title: string;
  tags: string[];
  level: string;
  description: string;
  pricingType: TPricingType;
  price: number | null;
  allowMarketplace: boolean;
  coverUrl: string | null;
}
