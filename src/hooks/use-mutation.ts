import {
  type InvalidateQueryFilters,
  type UseMutationOptions,
  useQueryClient,
  useMutation as useReactQueryMuation,
} from '@tanstack/react-query';

export interface UseMutationProps<TData, TVars> extends UseMutationOptions<
  TData,
  any,
  TVars
> {
  invalidateQueryFilter?: InvalidateQueryFilters;
}

export const useMutation = <TData, TVars>({
  invalidateQueryFilter,
  ...props
}: UseMutationProps<TData, TVars>) => {
  // we can have common logic here like.
  // Ex.1 showing response message
  // Ex.2 invalidating queries

  const queryClient = useQueryClient();

  const mutation = useReactQueryMuation({
    ...props,
    onSuccess(data, variables, onMutateResult, context) {
      if (invalidateQueryFilter) {
        queryClient.invalidateQueries(invalidateQueryFilter);
      }
      props.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(error, variables, onMutateResult, context) {
      console.log(error);
      props.onError?.(error, variables, onMutateResult, context);
    },
  });

  return mutation;
};
