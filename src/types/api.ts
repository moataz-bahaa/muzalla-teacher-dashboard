export interface IPagnationParams {
  page?: number;
  limit?: number;
}
export interface IPaginator<T> {
  status: string;
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  errors?: any;
  message?: string;
  data?: T;
}
