import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { queryClient } from '../queryClient';
import { DescribeAssetModelCacheKeyFactory } from './describeAssetModelQueryKeyFactory';
import { hasRequestFunction, isAssetModelId } from '../predicates';
import { useIoTSiteWiseClient } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { DescribeAssetModel } from '@iot-app-kit/core';
import { useMemo } from 'react';

export interface UseDescribeAssetModelsOptions {
  iotSiteWiseClient?: IoTSiteWiseClient | IoTSiteWise;
  assetModelIds?: (string | undefined)[];
}

/**
 * useDescribeAssetModels is a hook to call IoT SiteWise DescribeAssetModel on a list of assetModelIds
 * AssetModelIds may not be defined in the list, which will disable its query
 *
 * @param client is an AWS SDK IoT SiteWise client
 * @param assetModelIds is a list of assetModelIds where IoT SiteWise DescribeAssetModel API is called on each
 * @returns list of tanstack query results with a DescribeAssetModelResponse
 */
export function useDescribeAssetModels({
  iotSiteWiseClient,
  assetModelIds = [],
}: UseDescribeAssetModelsOptions) {
  const { describeAssetModel } = useIoTSiteWiseClient({ iotSiteWiseClient });

  // Memoize the queries to ensure they don't rerun if the same assetModelIds are used on a rerender
  const queries = useMemo(
    () =>
      assetModelIds.map((assetModelId, index) => {
        const cacheKeyFactory = new DescribeAssetModelCacheKeyFactory({
          assetModelId,
        });
        return {
          enabled: isEnabled({
            assetModelId: assetModelIds[index],
            describeAssetModel,
          }),
          queryKey: cacheKeyFactory.create(),
          queryFn: createQueryFn(describeAssetModel),
        };
      }),
    [assetModelIds, describeAssetModel]
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

    return await describeAssetModel({ assetModelId }, { abortSignal: signal });
  };
};
