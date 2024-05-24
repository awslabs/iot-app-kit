import { useQueryClient } from '@tanstack/react-query';

import type { QueryKey } from './types';
import { resourceExplorerQueryClient } from '../resource-explorer-query-client';

export interface UseCachedResourcesOptions {
  resourceId: string;
  allParameters: readonly unknown[];
}

export type UseCachedResourcesResult<Resource> = Resource[];

/** Use resources loaded into the cache. */
export function useCachedResources<Resource>({
  resourceId,
  allParameters,
}: UseCachedResourcesOptions): UseCachedResourcesResult<Resource> {
  const queryClient = useQueryClient(resourceExplorerQueryClient);

  const resourcePages = queryClient.getQueriesData<Resource[]>({
    queryKey: [{ resourceId, allParameters }],
    // Further filter the data to prevent partial matching on allParameters
    predicate: (query) => {
      return (
        JSON.stringify((query.queryKey as QueryKey)[0].allParameters) ===
        JSON.stringify(allParameters)
      );
    },
  });

  const resources = resourcePages.flatMap(([_, resources = []]) => resources);

  return resources;
}
