import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function usePlatformQuery<T>(
  key: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    retryDelay: 2_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
