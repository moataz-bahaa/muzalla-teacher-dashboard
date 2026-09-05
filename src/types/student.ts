export type TStudentStatus = 'active' | 'inactive';

export interface IStudentEnrolledCourse {
  id: number;
  title: string;
}

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
  imageProfile: File | null;
}

export interface IUpdateStudentInput {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface IGetStudentsApiParams {
  isActive?: boolean;
  levelId?: number;
  page?: number;
  size?: number;
}

export interface IGetStudentsParams {
  page?: number;
  size?: number;
  search?: string;
  status?: TStudentStatus | 'all';
  academicYear?: string | 'all';
}
export const ACADEMIC_YEARS = ['year1', 'year2', 'year3', 'year4'] as const;
