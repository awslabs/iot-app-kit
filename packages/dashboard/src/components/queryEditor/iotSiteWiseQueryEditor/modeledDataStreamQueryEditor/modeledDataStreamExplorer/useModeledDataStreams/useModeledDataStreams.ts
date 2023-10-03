import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { ListModeledDataStreamsRequest } from './listModeledDataStreamsRequest';
import { ModeledDataStreamCacheKeyFactory } from './modeledDataStreamCacheKeyFactory';

export interface UseModeledDataStreamsProps {
  assetIds: string[];
  client: IoTSiteWiseClient;
}

export function useModeledDataStreams({ assetIds, client }: UseModeledDataStreamsProps) {
  const cacheKeyFactory = new ModeledDataStreamCacheKeyFactory();
  const queries =
    useQueries({
      queries: assetIds.map((assetId) => ({
        // we store the descriptions in the cache using the assetId as the key
        queryKey: cacheKeyFactory.create(assetId),
        queryFn: createQueryFn(client),
      })),
    }) ?? [];

  const assetProperties = queries.flatMap(({ data = [] }) => data);
  const isFetching = queries.some(({ isFetching }) => isFetching);

  return { assetProperties, isFetching };
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<ReturnType<ModeledDataStreamCacheKeyFactory['create']>>) {
    invariant(assetId, 'Expected assetId to be defined as required by the enabled flag.');

    const request = new ListModeledDataStreamsRequest({ assetId, client, signal });
    const response = await request.send();

    return response;
  };
}
