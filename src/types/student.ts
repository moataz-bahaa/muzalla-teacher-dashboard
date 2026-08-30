export type TStudentStatus = 'active' | 'inactive';

export interface IStudentEnrolledCourse {
  id: number;
  title: string;
  progress: number;
}

export interface IStudent {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatarUrl: string;
  active: boolean;
  academicYear: string;
  enrolledCourses: IStudentEnrolledCourse[];
}

export interface ICreateStudentInput {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  password: string;
  imageProfile: File | null;
}

export interface IUpdateStudentInput extends Partial<ICreateStudentInput> {
  id: number;
}

export interface IGetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TStudentStatus | 'all';
  academicYear?: string | 'all';
}
