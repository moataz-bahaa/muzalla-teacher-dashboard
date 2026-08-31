import type { ECourseStatus } from './page-block';

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

export interface IUpdateCourseInput {
  id: number;
  name?: string;
  description?: string;
  status?: ECourseStatus;
}
