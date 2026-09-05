import { useMutation, type UseMutationProps } from '@/hooks/use-mutation';
import { client } from '@/lib/data/client';
import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import type { IApiResponse } from '@/types/api';
import type {
  ICreateStudentInput,
  IGetStudentsApiParams,
  IUpdateStudentInput,
} from '@/types/student';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useStudentsQuery = (params: IGetStudentsApiParams = {}) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [API_ENDPOINTS.students, params],
    queryFn: () => client.students.getAll(params),
  });

  return { students: data?.data ?? [], isPending, isError, error };
};

export const useStudentQuery = (id: number) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [API_ENDPOINTS.students, id],
    queryFn: () => client.students.getById(id),
    enabled: id > 0,
  });

  return { student: data?.data, isPending, isError, error };
}

export const useAddStudentMutation = (
  options?: Omit<
    UseMutationProps<IApiResponse<unknown>, ICreateStudentInput>,
    'mutationKey' | 'mutationFn' | 'invalidateQueryFilter'
  >,
) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.students, 'create'],
    mutationFn: client.students.create,
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.students] },
    ...options,
    onSuccess(data, variables, onMutateResult, context) {
      toast.success(t('students.toast.saved'));
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(error) {
      toast.error(error.message || t('students.toast.saveError'));
    },
  });
};

export const useEditStudentMutation = (
  options?: Omit<
    UseMutationProps<void, IUpdateStudentInput>,
    'mutationKey' | 'mutationFn' | 'invalidateQueryFilter'
  >,
) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.students, 'update'],
    mutationFn: async (input: IUpdateStudentInput) => {
      await client.students.update(input);
    },
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.students] },
    ...options,
    onSuccess(data, variables, onMutateResult, context) {
      toast.success(t('students.toast.saved'));
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(error, variables, onMutateResult, context) {
      toast.error(error.message || t('students.toast.saveError'));
      options?.onError?.(error, variables, onMutateResult, context);
    },
  });
};

export const useImportStudentsMutation = (
  options?: Omit<
    UseMutationProps<void, File>,
    'mutationKey' | 'mutationFn' | 'invalidateQueryFilter'
  >,
) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.students, 'import'],
    mutationFn: async (file: File) => {
      await client.students.importExcel(file);
    },
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.students] },
    ...options,
    onSuccess(data, variables, onMutateResult, context) {
      toast.success(t('students.toast.imported'));
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(error) {
      toast.error(error.message || t('students.toast.importError'));
    },
  });
};
