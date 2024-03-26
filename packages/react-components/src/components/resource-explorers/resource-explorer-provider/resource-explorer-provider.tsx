import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useMemo, type PropsWithChildren } from 'react';

export type ResourceExplorerProviderProps = PropsWithChildren;

/**
 * Necessary provider for the resource explorer.
 *
 * @experimental
 */
export function ResourceExplorerProvider({
  children,
}: ResourceExplorerProviderProps) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
