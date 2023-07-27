import {
  paginateBatchGetAssetPropertyValue,
  type BatchGetAssetPropertyValueCommandInput,
  type BatchGetAssetPropertyValueCommandOutput,
  type BatchGetAssetPropertyValueErrorEntry,
  type BatchGetAssetPropertyValueSkippedEntry,
  type BatchGetAssetPropertyValueSuccessEntry,
  type IoTSiteWiseClient,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useQuery, type QueryFunctionContext, type UseQueryOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

interface UseAssetPropertyValueBatchProps extends WithClient {
  input: Omit<BatchGetAssetPropertyValueCommandInput, 'nextToken'>;
  options: UseQueryOptions<
    Omit<BatchGetAssetPropertyValueCommandOutput, 'nextToken' | '$metadata'>,
    IoTSiteWiseServiceException,
    Omit<BatchGetAssetPropertyValueCommandOutput, 'nextToken' | '$metadata'>,
    ReturnType<typeof iotSiteWiseKeys.assetPropertyValueBatch>
  >;
}

/** Use a batch of IoT SiteWise asset property values. */
export function useAssetPropertyValueBatch({ client, input, options }: UseAssetPropertyValueBatchProps) {
  return useQuery({
    queryKey: iotSiteWiseKeys.assetPropertyValueBatch(input),
    queryFn: createQueryFn(client),
    ...options,
  });
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.assetPropertyValueBatch>>) {
    const paginator = paginateBatchGetAssetPropertyValue({ client, pageSize: 250 }, input);

    const errorEntries: BatchGetAssetPropertyValueErrorEntry[] = [];
    const skippedEntries: BatchGetAssetPropertyValueSkippedEntry[] = [];
    const successEntries: BatchGetAssetPropertyValueSuccessEntry[] = [];

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
