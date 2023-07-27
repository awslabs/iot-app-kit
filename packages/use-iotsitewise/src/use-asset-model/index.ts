import {
  DescribeAssetModelCommand,
  type DescribeAssetModelCommandInput,
  type DescribeAssetModelCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useQuery, type UseQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseAssetModelProps extends WithClient {
  input?: DescribeAssetModelCommandInput;
  options?: UseQueryOptions<
    DescribeAssetModelCommandOutput,
    IoTSiteWiseServiceException,
    DescribeAssetModelCommandOutput,
    ReturnType<typeof iotSiteWiseKeys.assetModelDescription>
  >;
}

/** Use an IoT SiteWise asset model description resource. */
export function useAssetModel({ client, input, options }: UseAssetModelProps) {
  return useQuery({
    enabled: input != null,
    queryKey: input != null ? iotSiteWiseKeys.assetModelDescription(input) : undefined,
    queryFn: createQueryFn({ client }),
    ...options,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.assetModelDescription>>) {
    return client.send(new DescribeAssetModelCommand(input), { abortSignal: signal });
  };
}
