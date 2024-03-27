import type { BaseQueryKey } from '../types/queries';

export function createBaseQueryKey<Resource extends string>(
  resourceName: Resource
): BaseQueryKey<Resource> {
  return [{ resource: resourceName }] as const;
}

export function handleQueryError(resource: string, error: unknown) {
  console.error(`Failed to request ${resource} resources.`, error);

  throw error;
}
