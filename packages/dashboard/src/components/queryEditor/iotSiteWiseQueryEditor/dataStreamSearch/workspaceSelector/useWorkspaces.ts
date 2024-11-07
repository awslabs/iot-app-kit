import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { ListWorkspacesRequest } from './listWorkspacesRequest';

const TWIN_MAKER_CACHE_KEY = [{ service: 'iottwinmaker' }] as const;

const CACHE_KEYS = {
  all: [{ ...TWIN_MAKER_CACHE_KEY[0], key: 'workspaces' }] as const,
  workspaces: () =>
    [{ ...CACHE_KEYS.all[0], resource: 'workspace summary' }] as const,
};

export interface UseWorkspacesOptions {
  client: IoTTwinMakerClient;
}

export function useWorkspaces({ client }: UseWorkspacesOptions) {
  const { data: workspaces = [], status } = useQuery({
    queryKey: CACHE_KEYS.workspaces(),
    queryFn: createQueryFn(client),
  });

  return { workspaces, status };
}

function createQueryFn(client: IoTTwinMakerClient) {
  return async function ({
    signal,
  }: QueryFunctionContext<ReturnType<typeof CACHE_KEYS.workspaces>>) {
    const request = new ListWorkspacesRequest({ client, signal });
    const response = await request.send();

    return response;
  };
}
