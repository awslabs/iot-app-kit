import { GetAssetPropertyValueCommand, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';

import { BatchFactory } from './batchFactory';
// import { BatchGetLatestValuesRequest } from './batchGetLatestValues';
import { EntryIdFactory } from './entryIdFactory';
import { LatestValueCacheKeyFactory } from './latestValueCacheKeyFactory';
import { LatestValueMapFactory } from './latestValueMapFactory';
import type { LatestValueMap } from './types';
import type { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import type { UnmodeledDataStream } from '../unmodeledDataStreamExplorer/types';

const POLLING_INTERVAL_IN_MS = 60_000;

export interface UseLatestValueProps {
  dataStreams: ModeledDataStream[] | UnmodeledDataStream[];
  /** Externally control if requests are being made. */
  isEnabled: boolean;
  client: IoTSiteWiseClient;
}

/** Regularly poll for and use the latest value for a given list of asset properties. */
export function useLatestValues({
  dataStreams,
  isEnabled,
  client,
}: UseLatestValueProps) {
  // Prepare asset properties for batch requests
  const cacheKeyFactory = new LatestValueCacheKeyFactory();
  const batchFactory = new BatchFactory(dataStreams);
  const batches = batchFactory.create();

  const queries =
    useQueries({
      queries: batches.map((batch) => ({
        refetchInterval: POLLING_INTERVAL_IN_MS,
        enabled: isEnabled && batch.length > 0,
        queryKey: cacheKeyFactory.create(batch),
        queryFn: createQueryFn(client),
      })),
    }) ?? [];

  const latestValueMaps = queries
    .map(({ data: latestValueMap }) => latestValueMap)
    .filter((latestValueMap): latestValueMap is LatestValueMap =>
      Boolean(latestValueMap)
    );
  const latestValueMap = latestValueMaps.reduce<LatestValueMap>(
    (acc, currentLatestValueMap) => {
      return { ...acc, ...currentLatestValueMap };
    },
    {}
  );

  function getLatestValue(dataStream: ModeledDataStream | UnmodeledDataStream) {
    const entryIdFactory = new EntryIdFactory(dataStream);
    const entryId = entryIdFactory.create();

    return latestValueMap[entryId];
  }

  return { getLatestValue };
}

// curried function to make it easier to pass in the client
function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ entries = [] }],
    // signal,
  }: QueryFunctionContext<ReturnType<LatestValueCacheKeyFactory['create']>>) {
    // const request = new BatchGetLatestValuesRequest({
    //   client,
    //   entries,
    //   signal,
    // });
    // const response = await request.send();

    const requests = entries.map((entry) => client.send(new GetAssetPropertyValueCommand({
      ...entry
    })).then(resp => ({ entryId: entry.entryId, assetPropertyValue: resp.propertyValue })));

    const successEntries = await Promise.all(requests);

    const latestValueMapFactory = new LatestValueMapFactory({
      successEntries,
      skippedEntries: [],
      errorEntries: [],
    });
    const latestValueMap = latestValueMapFactory.create();

    return latestValueMap;
  };
}
