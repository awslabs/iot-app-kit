import { useQueries } from '@tanstack/react-query';

import { createDataStreamsWithLatestValue } from './create-data-streams-with-latest-value';
import { createRequestEntryBatches } from './create-request-entry-batches';
import type { CreateEntryId, DataStreamResource } from './types';
import { resourceExplorerQueryClient } from '../resource-explorer-query-client';
import type { BatchGetAssetPropertyValue } from '../../types/request-fn';
import type { DataStreamResourceWithLatestValue } from '../../types/resources';
import type { RequestIsLoading } from '../../types/common';
import { DEFAULT_LATEST_VALUE_REQUEST_INTERVAL } from '../../constants/defaults';

export interface UseLatestValuesOptions<DataStream extends DataStreamResource> {
  batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;
  dataStreams: DataStream[];
  createEntryId: CreateEntryId<DataStream>;
}

export interface UseLatestValuesResult<DataStream extends DataStreamResource> {
  dataStreamsWithLatestValue: DataStreamResourceWithLatestValue<DataStream>[];
  isLoading: RequestIsLoading;
}

export function useLatestValues<DataStream extends DataStreamResource>({
  batchGetAssetPropertyValue,
  dataStreams,
  createEntryId,
}: UseLatestValuesOptions<DataStream>): UseLatestValuesResult<DataStream> {
  const requestEntryBatches = createRequestEntryBatches(
    dataStreams,
    createEntryId
  );

  const results = useQueries(
    {
      queries: requestEntryBatches.map((entries) => ({
        enabled: batchGetAssetPropertyValue !== undefined,
        refetchInterval: DEFAULT_LATEST_VALUE_REQUEST_INTERVAL,
        queryKey: [
          {
            resourceId: 'LatestValueBatch',
            ...entries.map(({ entryId }) => entryId),
          },
        ],
        queryFn: async () => {
          try {
            if (!batchGetAssetPropertyValue) {
              throw new Error(
                'Expected an implementation for batchGetAssetPropertyValue to be defined'
              );
            }

            const { successEntries = [], errorEntries = [] } =
              await batchGetAssetPropertyValue({ entries });

            if (errorEntries.length > 0) {
              throw new Error(errorEntries[0].errorMessage);
            }

            const dataStreamsWithLatestValue = createDataStreamsWithLatestValue(
              entries,
              successEntries
            );

            return dataStreamsWithLatestValue;
          } catch (error) {
            console.error(error);

            return [];
          }
        },
      })),
    },
    resourceExplorerQueryClient
  );

  const dataStreamsWithLatestValue = results.flatMap(({ data = [] }) => data);
  const isLoading = results.some(({ isLoading }) => isLoading);

  return {
    dataStreamsWithLatestValue,
    isLoading,
  };
}
