import { QueryClient } from '@tanstack/react-query';

export const resourceExplorerQueryClient =
  process.env.NODE_ENV === 'test'
    ? // optimize for tests
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            gcTime: Infinity,
            retry: 0,
          },
        },
      })
    : new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: Infinity,
            // gcTime: Infinity,
          },
        },
      });
