import { client } from '@/lib/data/client';
import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import { useQuery } from '@tanstack/react-query';

export const useLevelsQuery = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [API_ENDPOINTS.levels],
    queryFn: () => client.constants.getLevels(),
  });

  return { levels: data?.data ?? [], isPending, isError, error };
};
