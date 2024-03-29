import { useQueryClient } from '@tanstack/react-query';

export interface UseQueryResourcesOptions {
  resource: string;
}

export function useQueryResources<Resource>({
  resource,
}: UseQueryResourcesOptions) {
  const queryClient = useQueryClient();

  const resourcePages = queryClient.getQueriesData<Resource[]>([{ resource }]);
  const resources = resourcePages.flatMap(([_, resources = []]) => resources);

  return resources;
}
