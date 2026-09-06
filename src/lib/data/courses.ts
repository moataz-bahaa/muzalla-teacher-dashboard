import { useMutation, type UseMutationProps } from '@/hooks/use-mutation';
import { client } from '@/lib/data/client';
import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import type { IApiResponse } from '@/types/api';
import type { ICreateCourseInput, IGetCoursesParams } from '@/types/course';
import { ECourseStatus } from '@/types/page-block';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useCoursesQuery = (params: IGetCoursesParams = {}) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [API_ENDPOINTS.courses, params],
    queryFn: () => client.courses.getAll(params),
  });

  return {
    courses: data?.data ?? [],
    pagination: data?.pagination,
    isPending,
    isError,
    error,
  };
};

export const useAddCourseMutation = (
  options?: Omit<
    UseMutationProps<IApiResponse<number>, ICreateCourseInput>,
    'mutationKey' | 'mutationFn' | 'invalidateQueryFilter'
  >,
) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.courses, 'create'],
    mutationFn: client.courses.create,
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.courses] },
    ...options,
    onSuccess(data, variables, onMutateResult, context) {
      toast.success(
        variables.status === ECourseStatus.Draft
          ? t('courses.toast.draftSaved')
          : t('courses.toast.saved'),
      );
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(error) {
      toast.error(error.message || t('courses.toast.saveError'));
    },
  });
};
