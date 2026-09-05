import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import {
  buildCreatePageBlocksFormData,
  buildCreatePageFormData,
  buildCreateSectionFormData,
  buildCreateStudentFormData,
  buildImportStudentsFormData,
  buildUpdateCourseFormData,
  buildUpdatePageFormData,
  buildUpdateSectionFormData,
} from '@/lib/data/client/form-data';
import { objectToFormData } from '@/lib/utils';
import type { IApiResponse } from '@/types/api';
import type {
  IForgetPasswordInput,
  IForgetPasswordResponse,
  ILoginInput,
  ILoginResponse,
  ILogoutInput,
  ILogoutResponse,
  IMeResponse,
  IRefreshTokenInput,
  IRefreshTokenResponse,
  IRegisterInput,
  IRegisterResponse,
  IResetPasswordInput,
  IResetPasswordResponse,
  IVerifyOtpInput,
  IVerifyOtpResponse,
  TAuthDevicesResponse,
} from '@/types/auth';
import type { ICourseResponse, IUpdateCourseInput } from '@/types/course-api';
import type {
  ICreatePageInput,
  IPage,
  IReorderPageItem,
  IUpdatePageInput,
} from '@/types/page';
import type {
  ICreatePageBlocksInput,
  IPageBlock,
  IReorderPageBlockItem,
  IUpdatePageBlocksInput,
} from '@/types/page-block';
import type {
  ICreateSectionInput,
  IReorderSectionItem,
  ISection,
  IUpdateSectionInput,
} from '@/types/section';
import type {
  ICreateStudentInput,
  IGetStudentsApiParams,
  IStudent,
  IStudentDetailResponse,
  IUpdateStudentInput,
} from '@/types/student';
import { HttpClient } from './http-client';

class Client {
  auth = {
    login: (input: ILoginInput) =>
      HttpClient.post<ILoginResponse>(API_ENDPOINTS.login, input),

    getMe: () => HttpClient.get<IApiResponse<IMeResponse>>(API_ENDPOINTS.me),

    register: (input: IRegisterInput) =>
      HttpClient.post<IApiResponse<IRegisterResponse>>(
        API_ENDPOINTS.register,
        objectToFormData(input),
      ),
    logout: (input?: ILogoutInput) =>
      HttpClient.post<ILogoutResponse>(API_ENDPOINTS.logout, input),

    refreshToken: (input: IRefreshTokenInput) =>
      HttpClient.post<IRefreshTokenResponse>(API_ENDPOINTS.refreshToken, input),

    forgetPassword: (input: IForgetPasswordInput) =>
      HttpClient.post<IForgetPasswordResponse>(
        API_ENDPOINTS.forgetPassword,
        input,
      ),

    verifyOtp: (input: IVerifyOtpInput) =>
      HttpClient.post<IVerifyOtpResponse>(API_ENDPOINTS.verifyOtp, input),

    resetPassword: (input: IResetPasswordInput) =>
      HttpClient.post<IResetPasswordResponse>(
        API_ENDPOINTS.resetPassword,
        input,
      ),

    devices: () => HttpClient.get<TAuthDevicesResponse>(API_ENDPOINTS.devices),
  };

  courses = {
    getById: (id: number) =>
      HttpClient.get<IApiResponse<ICourseResponse>>(
        API_ENDPOINTS.courseById(id),
      ),

    update: ({ id, ...input }: IUpdateCourseInput) =>
      HttpClient.put<IApiResponse<ICourseResponse>>(
        `${API_ENDPOINTS.courses}?id=${id}`,
        buildUpdateCourseFormData(input),
      ),

    delete: (id: number) =>
      HttpClient.delete<unknown>(`${API_ENDPOINTS.courses}?id=${id}`),
  };

  sections = {
    getAll: (courseId: number) =>
      HttpClient.get<IApiResponse<ISection[]>>(API_ENDPOINTS.sections, {
        params: { courseId },
      }),

    create: (input: ICreateSectionInput) =>
      HttpClient.post<IApiResponse<number>>(
        API_ENDPOINTS.sections,
        buildCreateSectionFormData(input),
      ),

    update: ({ id, ...input }: IUpdateSectionInput) =>
      HttpClient.put<IApiResponse<ISection>>(
        `${API_ENDPOINTS.sections}?id=${id}`,
        buildUpdateSectionFormData(input),
      ),

    delete: (id: number) =>
      HttpClient.delete<IApiResponse<string>>(
        `${API_ENDPOINTS.sections}?id=${id}`,
      ),

    reorder: (courseId: number, items: IReorderSectionItem[]) =>
      HttpClient.put<IApiResponse<string>>(
        `${API_ENDPOINTS.sectionReorder}?courseId=${courseId}`,
        items,
      ),
  };

  pages = {
    getAll: (sectionId: number) =>
      HttpClient.get<IApiResponse<IPage[]>>(API_ENDPOINTS.pages, {
        params: { sectionId },
      }),

    create: (input: ICreatePageInput) =>
      HttpClient.post<IApiResponse<number>>(
        API_ENDPOINTS.pages,
        buildCreatePageFormData(input),
      ),

    update: ({ id, ...input }: IUpdatePageInput) =>
      HttpClient.put<IApiResponse<IPage>>(
        `${API_ENDPOINTS.pages}?id=${id}`,
        buildUpdatePageFormData(input),
      ),

    delete: (id: number) =>
      HttpClient.delete<IApiResponse<string>>(
        `${API_ENDPOINTS.pages}?id=${id}`,
      ),

    reorder: (sectionId: number, items: IReorderPageItem[]) =>
      HttpClient.put<IApiResponse<string>>(
        `${API_ENDPOINTS.pageReorder}?sectionId=${sectionId}`,
        items,
      ),
  };

  pageBlocks = {
    getAll: (pageId: number) =>
      HttpClient.get<IApiResponse<IPageBlock[]>>(API_ENDPOINTS.pageBlocks, {
        params: { pageId },
      }),

    create: (input: ICreatePageBlocksInput) =>
      HttpClient.post<IApiResponse<string>>(
        API_ENDPOINTS.pageBlocks,
        buildCreatePageBlocksFormData(input),
      ),

    update: (input: IUpdatePageBlocksInput) =>
      HttpClient.put<IApiResponse<boolean>>(API_ENDPOINTS.pageBlocks, input),

    delete: (id: number) =>
      HttpClient.delete<IApiResponse<string>>(
        `${API_ENDPOINTS.pageBlocks}?id=${id}`,
      ),

    reorder: (pageId: number, items: IReorderPageBlockItem[]) =>
      HttpClient.put<IApiResponse<string>>(
        `${API_ENDPOINTS.pageBlockReorder}?pageId=${pageId}`,
        items,
      ),
  };

  students = {
    getAll: (params?: IGetStudentsApiParams) =>
      HttpClient.get<IApiResponse<IStudent[]>>(API_ENDPOINTS.students, {
        params,
      }),

    getById: (id: number) =>
      HttpClient.get<IApiResponse<IStudentDetailResponse>>(
        API_ENDPOINTS.studentById(id),
      ),

    create: (input: ICreateStudentInput) =>
      HttpClient.post<IApiResponse<unknown>>(
        API_ENDPOINTS.students,
        buildCreateStudentFormData(input),
      ),

    update: ({ id, ...input }: IUpdateStudentInput) =>
      HttpClient.put<IApiResponse<string>>(
        API_ENDPOINTS.studentById(id),
        input,
      ),

    importExcel: (file: File) =>
      HttpClient.post<IApiResponse<string>>(
        API_ENDPOINTS.studentsImport,
        buildImportStudentsFormData(file),
      ),

    delete: (id: number) =>
      HttpClient.delete<IApiResponse<string>>(API_ENDPOINTS.userById(id)),
  };
}

export const client = new Client();
