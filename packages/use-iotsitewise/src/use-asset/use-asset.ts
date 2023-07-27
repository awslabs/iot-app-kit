import {
  DescribeAssetCommand,
  type DescribeAssetCommandInput,
  type DescribeAssetCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useQuery, type UseQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseAssetProps extends WithClient {
  input?: DescribeAssetCommandInput;
  options?: UseQueryOptions<
    DescribeAssetCommandOutput,
    IoTSiteWiseServiceException,
    DescribeAssetCommandOutput,
    ReturnType<typeof iotSiteWiseKeys.assetDescription>
  >;
}

/** Use an IoT SiteWise asset description resource. */
export function useAsset({ client, input, options }: UseAssetProps) {
  return useQuery({
    enabled: input != null,
    queryKey: input != null ? iotSiteWiseKeys.assetDescription(input) : undefined,
    queryFn: createQueryFn({ client }),
    ...options,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.assetDescription>>) {
    return client.send(new DescribeAssetCommand(input), { abortSignal: signal });
  };
}
