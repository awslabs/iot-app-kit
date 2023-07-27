import {
  DescribeBulkImportJobCommand,
  type DescribeBulkImportJobCommandInput,
  type DescribeBulkImportJobCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useQuery, type UseQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseBulkImportJobProps extends WithClient {
  input?: DescribeBulkImportJobCommandInput;
  options?: UseQueryOptions<
    DescribeBulkImportJobCommandOutput,
    IoTSiteWiseServiceException,
    DescribeBulkImportJobCommandOutput,
    ReturnType<typeof iotSiteWiseKeys.bulkImportJobDescription>
  >;
}

/** Use an IoT SiteWise bulkImportJob description resource. */
export function useBulkImportJob({ client, input, options }: UseBulkImportJobProps) {
  return useQuery({
    enabled: input != null,
    queryKey: input != null ? iotSiteWiseKeys.bulkImportJobDescription(input) : undefined,
    queryFn: createQueryFn({ client }),
    ...options,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.bulkImportJobDescription>>) {
    return client.send(new DescribeBulkImportJobCommand(input), { abortSignal: signal });
  };
}
