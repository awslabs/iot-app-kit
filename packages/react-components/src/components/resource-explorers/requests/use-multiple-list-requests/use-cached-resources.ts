import { useQueryClient } from '@tanstack/react-query';

export interface UseCachedResourcesOptions {
  resourceId: string;
}

export type UseCachedResourcesResult<Resource> = Resource[];

/** Use resources loaded into the cache. */
export function useCachedResources<Resource>({
  resourceId,
}: UseCachedResourcesOptions): UseCachedResourcesResult<Resource> {
  const queryClient = useQueryClient();

  const resourcePages = queryClient.getQueriesData<Resource[]>([
    { resourceId },
  ]);
  const resources = resourcePages.flatMap(([_, resources = []]) => resources);

  return resources;
}
