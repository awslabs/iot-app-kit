import { QueryCache, QueryClient } from '@tanstack/react-query';

// 10 minutes
const STALE_TIME = 1000 * 60 * 10;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
    },
  },
  queryCache: new QueryCache(),
});
