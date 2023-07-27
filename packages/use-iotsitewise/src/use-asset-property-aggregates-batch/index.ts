import {
  paginateBatchGetAssetPropertyAggregates,
  type BatchGetAssetPropertyAggregatesCommandInput,
  type BatchGetAssetPropertyAggregatesCommandOutput,
  type BatchGetAssetPropertyAggregatesErrorEntry,
  type BatchGetAssetPropertyAggregatesSkippedEntry,
  type BatchGetAssetPropertyAggregatesSuccessEntry,
  type IoTSiteWiseClient,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext, type UseQueryOptions } from '@tanstack/react-query';

import { assetPropertyValueKeys } from '../cache/index';

interface UseAssetPropertyAggregatesProps {
  commands: {
    input: Omit<BatchGetAssetPropertyAggregatesCommandInput, 'nextToken'>;
    options: UseQueryOptions<
      Omit<BatchGetAssetPropertyAggregatesCommandOutput, 'nextToken' | '$metadata'>,
      IoTSiteWiseServiceException,
      Omit<BatchGetAssetPropertyAggregatesCommandOutput, 'nextToken' | '$metadata'>,
      ReturnType<typeof assetPropertyValueKeys.assetPropertyAggregatesBatch>
    >;
  }[];
  client: IoTSiteWiseClient;
}

export function useAssetPropertyAggregates({ commands, client }: UseAssetPropertyAggregatesProps) {
  return useQueries({
    queries: commands.map(({ input, options }) => ({
      queryKey: assetPropertyValueKeys.assetPropertyAggregatesBatch(input),
      queryFn: createQueryFn(client),
      ...options,
    })),
  });
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof assetPropertyValueKeys.assetPropertyAggregatesBatch>>) {
    const paginator = paginateBatchGetAssetPropertyAggregates({ client, pageSize: 250 }, input);

    const errorEntries: BatchGetAssetPropertyAggregatesErrorEntry[] = [];
    const skippedEntries: BatchGetAssetPropertyAggregatesSkippedEntry[] = [];
    const successEntries: BatchGetAssetPropertyAggregatesSuccessEntry[] = [];

    for await (const {
      errorEntries: errorEntriesPage = [],
      skippedEntries: skippedEntriesPage = [],
      successEntries: successEntriesPage = [],
    } of paginator) {
      errorEntries.push(...errorEntriesPage);
      skippedEntries.push(...skippedEntriesPage);
      successEntries.push(...successEntriesPage);

      if (signal?.aborted) {
        break;
      }
    }

    return {
      errorEntries,
      skippedEntries,
      successEntries,
    };
  };
}
