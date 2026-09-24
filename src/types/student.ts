import type { IPagnationParams } from './api';

export type TStudentStatus = 'active' | 'inactive';

export const ACADEMIC_YEARS = ['year1', 'year2', 'year3', 'year4'] as const;

export type TAcademicYear = (typeof ACADEMIC_YEARS)[number];

export interface IStudent {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string | null;
  isActive: boolean;
  levelName: string | null;
  profileImage: string | null;
}

export interface IStudentDetailResponse extends IStudent {
  enrolledCourses: { id: number; name: string }[];
}

export interface ICreateStudentInput {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  password: string;
  profileImage: File | null;
}

export interface IUpdateStudentInput extends Partial<ICreateStudentInput> {
  id: number;
  isActive?: boolean;
}

export interface IGetStudentsParams extends IPagnationParams {
  isActive?: boolean;
  levelId?: number;
  search?: string;
  status?: TStudentStatus | 'all';
  level?: string | 'all';
}
