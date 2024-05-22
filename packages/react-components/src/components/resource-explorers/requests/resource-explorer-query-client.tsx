import { QueryClient } from '@tanstack/react-query';

export const resourceExplorerQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});
