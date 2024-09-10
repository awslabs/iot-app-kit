import { useMemo } from 'react';
import {
  DescribeAssetModelRequest,
  IoTSiteWise,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { DescribeAssetModel } from '@iot-app-kit/core';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { queryClient } from '../queryClient';
import { DescribeAssetModelCacheKeyFactory } from './describeAssetModelQueryKeyFactory';
import { hasRequestFunction, isAssetModelId } from '../predicates';
import { useIoTSiteWiseClient } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { QueryOptionsGlobal } from '../useLatestAssetPropertyValues';

export type UseDescribeAssetModelsOptions = {
  iotSiteWiseClient?: IoTSiteWiseClient | IoTSiteWise;
  describeAssetModelRequests?: (DescribeAssetModelRequest | undefined)[];
} & QueryOptionsGlobal;

/**
 * useDescribeAssetModels is a hook to call IoT SiteWise DescribeAssetModel on a list of assetModelIds
 * AssetModelIds may not be defined in the list, which will disable its query
 *
 * @param iotSiteWiseClient is an AWS SDK IoT SiteWise client
 * @param describeAssetModelRequests is a list of DescribeAssetModel requests
 * @returns list of tanstack query results with a DescribeAssetModelResponse
 */
export function useDescribeAssetModels({
  iotSiteWiseClient,
  describeAssetModelRequests = [],
  retry,
}: UseDescribeAssetModelsOptions) {
  const { describeAssetModel } = useIoTSiteWiseClient({ iotSiteWiseClient });

  // Memoize the queries to ensure they don't rerun if the same assetModelIds are used on a rerender
  const queries = useMemo(
    () =>
      describeAssetModelRequests.map((describeAssetModelRequest) => {
        const cacheKeyFactory = new DescribeAssetModelCacheKeyFactory({
          ...describeAssetModelRequest,
        });
        return {
          enabled: isEnabled({
            assetModelId: describeAssetModelRequest?.assetModelId,
            describeAssetModel,
          }),
          queryKey: cacheKeyFactory.create(),
          queryFn: createQueryFn(describeAssetModel),
          retry,
        };
      }),
    [describeAssetModelRequests, describeAssetModel, retry]
  );

  return useQueries({ queries }, queryClient);
}

// Query is enabled if both an assetModelId and describeAssetModel request function is available
const isEnabled = ({
  assetModelId,
  describeAssetModel,
}: {
  assetModelId?: string;
  describeAssetModel?: DescribeAssetModel;
}) =>
  isAssetModelId(assetModelId) &&
  hasRequestFunction<DescribeAssetModel>(describeAssetModel);

// Query function calls describeAssetModel with the given assetModelId and request function
const createQueryFn = (describeAssetModel?: DescribeAssetModel) => {
  return async ({
    queryKey: [{ assetModelId }],
    signal,
  }: QueryFunctionContext<
    ReturnType<DescribeAssetModelCacheKeyFactory['create']>
  >) => {
    invariant(
      hasRequestFunction<DescribeAssetModel>(describeAssetModel),
      'Expected client with DescribeAssetModel to be defined as required by the enabled flag.'
    );

    invariant(
      isAssetModelId(assetModelId),
      'Expected assetModelId to be defined as required by the enabled flag.'
    );

    try {
      return await describeAssetModel(
        { assetModelId },
        { abortSignal: signal }
      );
    } catch (error) {
      handleError({ assetModelId }, error);
    }
  };
};

const handleError = (
  request: DescribeAssetModelRequest,
  error: unknown
): never => {
  console.error(`Failed to describe asset model. Error: ${error}`);
  console.info('Request input:');
  console.table(request);

  throw error;
};
