import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';

import { batchGetLatestValues, createBatches } from './batchGetLatestValues';
import type { WithIoTSiteWiseClient } from '../../types';
import { assetPropertyValueKeys } from '../../data/assetPropertyValues';

export interface UseLatestValueProps extends WithIoTSiteWiseClient {
  /** List of asset properties to request lastest values for. */
  assetProperties: { assetId?: string; id?: string }[];
  /** Externally control if requests are being made. */
  isEnabled: boolean;
}

/** Regularly poll for and use the latest value for a given list of asset properties. */
export function useLatestValues({ assetProperties, isEnabled, client }: UseLatestValueProps) {
  // 10 second polling interval
  const REFETCH_INTERVAL = 10000;

  // prepare asset properties for batch requests
  const batches = createBatches(assetProperties.map(({ assetId, id }) => ({ assetId, propertyId: id })));

  const queries =
    useQueries({
      queries: batches.map((batch) => ({
        refetchInterval: REFETCH_INTERVAL,
        enabled: isEnabled && batch.length > 0,
        queryKey: assetPropertyValueKeys.batchLatestValues({ entries: batch }),
        queryFn: createUseLatestValuesQueryFn({ client }),
      })),
    }) ?? [];

  const latestValues = queries.flatMap(({ data = [] }) => data);
  const isFetching = queries.some(({ isFetching }) => isFetching);
  const isError = queries.some(({ isError }) => isError);

  return { latestValues, isFetching, isError };
}

// curried function to make it easier to pass in the client
function createUseLatestValuesQueryFn({ client }: WithIoTSiteWiseClient) {
  return async function ({
    queryKey: [{ entries = [] }],
    signal,
  }: QueryFunctionContext<ReturnType<(typeof assetPropertyValueKeys)['batchLatestValues']>>) {
    return batchGetLatestValues({ client, entries, signal });
  };
}
