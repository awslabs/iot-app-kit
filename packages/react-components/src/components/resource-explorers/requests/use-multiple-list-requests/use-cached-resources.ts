import { useQueryClient } from '@tanstack/react-query';
import { resourceExplorerQueryClient } from '../../resource-explorer-query-client';

export interface UseCachedResourcesOptions {
  resourceId: string;
  stringParams: string;
}

export type UseCachedResourcesResult<Resource> = Resource[];

/** Use resources loaded into the cache. */
export function useCachedResources<Resource>({
  resourceId,
  stringParams,
}: UseCachedResourcesOptions): UseCachedResourcesResult<Resource> {
  const queryClient = useQueryClient(resourceExplorerQueryClient);

  const resourcePages = queryClient.getQueriesData<Resource[]>({
    queryKey: [{ resourceId, stringParams }],
  });
  const resources = resourcePages.flatMap(([_, resources = []]) => resources);

  return resources;
}
