import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useRef, type PropsWithChildren } from 'react';

export type ResourceExplorerProviderProps = PropsWithChildren;

/**
 * Necessary provider for the resource explorer.
 *
 * @experimental Do not use in production.
 */
export function ResourceExplorerProvider({
  children,
}: ResourceExplorerProviderProps) {
  const queryClientRef = useRef<QueryClient | undefined>(undefined);

  // Ensure the query client instance is never null.
  function getQueryClient(): QueryClient {
    if (!queryClientRef.current) {
      const queryClient = new QueryClient();

      queryClientRef.current = queryClient;

      return queryClient;
    }

    return queryClientRef.current;
  }

  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
