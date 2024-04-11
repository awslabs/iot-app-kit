import { useQueryClient } from '@tanstack/react-query';

export interface UseCachedResourcesOptions {
  resource: string;
}

export type UseCachedResourcesResult<Resource> = Resource[];

/** Use resources loaded into the cache. */
export function useCachedResources<Resource>({
  resource,
}: UseCachedResourcesOptions): UseCachedResourcesResult<Resource> {
  const queryClient = useQueryClient();

  const resourcePages = queryClient.getQueriesData<Resource[]>([{ resource }]);
  const resources = resourcePages.flatMap(([_, resources = []]) => resources);

  return resources;
}
