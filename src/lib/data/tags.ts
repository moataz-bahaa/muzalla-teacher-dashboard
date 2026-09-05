import { client } from '@/lib/data/client';
import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import { useQuery } from '@tanstack/react-query';

export const useTagsQuery = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [API_ENDPOINTS.tags],
    queryFn: () => client.tags.getAll(),
  });

  return { tags: data?.data ?? [], isPending, isError, error };
};
