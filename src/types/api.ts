export interface IApiResponse<T> {
  success: boolean;
  errors?: any;
  message?: string;
  data?: T;
}
