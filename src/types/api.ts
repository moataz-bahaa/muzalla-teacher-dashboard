export interface IPagnationParams {
  page?: number;
  limit?: number;
}

export interface IPaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface IPaginator<T> {
  status: string;
  data: T;
  pagination: IPaginationMeta;
}

export interface IApiResponse<T> {
  success: boolean;
  errors?: any;
  message?: string;
  data?: T;
  pagination?: IPaginationMeta;
}
