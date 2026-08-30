import { useMutation, type UseMutationProps } from '@/hooks/use-mutation';
import { client } from '@/lib/data/client';
import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import type {
  ICreateStudentInput,
  IStudent,
  IUpdateStudentInput,
} from '@/types/student';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useAddStudentMutation = (
  options?: Omit<
    UseMutationProps<IStudent, ICreateStudentInput>,
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
    UseMutationProps<IStudent, IUpdateStudentInput>,
    'mutationKey' | 'mutationFn' | 'invalidateQueryFilter'
  >,
) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.students, 'update'],
    mutationFn: client.students.update,
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
