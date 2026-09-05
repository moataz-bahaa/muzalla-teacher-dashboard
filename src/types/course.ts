import type { ECourseStatus } from './page-block';

export type TCourseLessonType = 'video' | 'quiz' | 'article';

export interface IGetCoursesParams {
  keywords: string;
  tags: string[];
  priceFrom: number;
  priceTo: number;
  search?: string;
  page?: number;
}

export interface ITagResponse {
  id: number;
  name: string;
}

export interface ICourseResponse {
  id: number;
  name: string;
  description: string | null;
  levelName: string | null;
  durationInMinutes: number;
  tags: ITagResponse[];
  prerequisites: string | null;
  imageUrl: string;
  coverUrl: string;
  hasCertificate: boolean;
  status: ECourseStatus;
}

export interface IGetCoursesApiParams {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ICreateCourseInput {
  name: string;
  description?: string;
  levelId?: number;
  durationInMinutes: number;
  tags: number[];
  prerequisites?: string;
  cover: File;
  image: File;
  hasCertificate: boolean;
  status: ECourseStatus;
}

export interface IUpdateCourseInput {
  id: number;
  name?: string;
  description?: string;
  levelId?: number;
  durationInMinutes?: number;
  tags?: number[];
  prerequisites?: string;
  cover?: File;
  image?: File;
  hasCertificate?: boolean;
  status?: ECourseStatus;
}
