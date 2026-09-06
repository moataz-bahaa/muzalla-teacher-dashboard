import type { IPagnationParams } from './api';
import type { ECourseStatus } from './page-block';
import type { ITag } from './tag';

export interface ICourse {
  id: number;
  name: string;
  description: string | null;
  levelName: string | null;
  durationInMinutes: number;
  tags: ITag[];
  prerequisites: string | null;
  imageUrl: string;
  coverUrl: string;
  hasCertificate: boolean;
  status: ECourseStatus;
}

export interface IGetCoursesParams extends IPagnationParams {
  search?: string;
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
  cover?: File;
  image?: File;
  hasCertificate: boolean;
  status: ECourseStatus;
}

export interface IUpdateCourseInput extends Partial<ICreateCourseInput> {
  id: number;
}
