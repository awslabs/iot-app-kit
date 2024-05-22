import { useQueryClient } from '@tanstack/react-query';
import { resourceExplorerQueryClient } from '../resource-explorer-query-client';

export interface UseCachedResourcesOptions {
  allParameters: readonly unknown[];
}

export type UseCachedResourcesResult<Resource> = Resource[];

/** Use resources loaded into the cache. */
export function useCachedResources<Resource>({
  allParameters,
}: UseCachedResourcesOptions): UseCachedResourcesResult<Resource> {
  const queryClient = useQueryClient(resourceExplorerQueryClient);

  const resourcePages = queryClient.getQueriesData<Resource[]>({
    queryKey: [{ allParameters }],
  });
  const resources = resourcePages.flatMap(([_, resources = []]) => resources);

  return resources;
}
