import {
  paginateBatchGetAssetPropertyValueHistory,
  type BatchGetAssetPropertyValueHistoryCommandInput,
  type BatchGetAssetPropertyValueHistoryCommandOutput,
  type BatchGetAssetPropertyValueHistoryErrorEntry,
  type BatchGetAssetPropertyValueHistorySkippedEntry,
  type BatchGetAssetPropertyValueHistorySuccessEntry,
  type IoTSiteWiseClient,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext, type UseQueryOptions } from '@tanstack/react-query';

import { assetPropertyValueKeys } from '../cache/index';

interface UseAssetPropertyValueHistoriesProps {
  commands: {
    input: Omit<BatchGetAssetPropertyValueHistoryCommandInput, 'nextToken'>;
    options: UseQueryOptions<
      Omit<BatchGetAssetPropertyValueHistoryCommandOutput, 'nextToken' | '$metadata'>,
      IoTSiteWiseServiceException,
      Omit<BatchGetAssetPropertyValueHistoryCommandOutput, 'nextToken' | '$metadata'>,
      ReturnType<typeof assetPropertyValueKeys.assetPropertyValueHistoryBatch>
    >;
  }[];
  client: IoTSiteWiseClient;
}

export function useAssetPropertyValueHistories({ commands, client }: UseAssetPropertyValueHistoriesProps) {
  return useQueries({
    queries: commands.map(({ input, options }) => ({
      queryKey: assetPropertyValueKeys.assetPropertyValueHistoryBatch(input),
      queryFn: createQueryFn(client),
      ...options,
    })),
  });
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof assetPropertyValueKeys.assetPropertyValueHistoryBatch>>) {
    const paginator = paginateBatchGetAssetPropertyValueHistory({ client, pageSize: 250 }, input);

    const errorEntries: BatchGetAssetPropertyValueHistoryErrorEntry[] = [];
    const skippedEntries: BatchGetAssetPropertyValueHistorySkippedEntry[] = [];
    const successEntries: BatchGetAssetPropertyValueHistorySuccessEntry[] = [];

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
