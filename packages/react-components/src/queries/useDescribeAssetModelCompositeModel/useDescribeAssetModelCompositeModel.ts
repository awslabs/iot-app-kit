import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { AssetModelCompositeModelCacheKeyFactory } from './assetModelCompositeModelQueryKeyFactory';
import { GetDescribeAssetCompositeModelRequest } from './getDescribeAssetModelCompositeModelRequest';
import { queryClient } from '../queryClient';
import {
  hasClient,
  isAssetModelCompositeModelId,
  isAssetModelId,
} from '../predicates';

export type UseDescribeAssetModelCompositeModelOptions = {
  assetModelId?: string;
  assetModelCompositeModelId?: string;
  client?: IoTSiteWiseClient;
};

/**
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/iotsitewise/command/DescribeAssetModelCompositeModelCommand/
 * Retrieves information about an asset model composite model (also known as an asset model component).
 */
export function useDescribeAssetModelCompositeModel({
  assetModelId,
  assetModelCompositeModelId,
  client,
}: UseDescribeAssetModelCompositeModelOptions) {
  const cacheKeyFactory = new AssetModelCompositeModelCacheKeyFactory({
    assetModelId,
    assetModelCompositeModelId,
  });

  return useQuery(
    {
      enabled: isEnabled({ assetModelId, assetModelCompositeModelId, client }),
      queryKey: cacheKeyFactory.create(),
      queryFn: createQueryFn(client),
    },
    queryClient
  );
}

const isEnabled = ({
  assetModelId,
  assetModelCompositeModelId,
  client,
}: {
  assetModelId?: string;
  assetModelCompositeModelId?: string;
  client?: IoTSiteWiseClient;
}) =>
  isAssetModelId(assetModelId) &&
  isAssetModelCompositeModelId(assetModelCompositeModelId) &&
  hasClient(client);

const createQueryFn = (client?: IoTSiteWiseClient) => {
  return async ({
    queryKey: [{ assetModelId, assetModelCompositeModelId }],
    signal,
  }: QueryFunctionContext<
    ReturnType<AssetModelCompositeModelCacheKeyFactory['create']>
  >) => {
    invariant(
      hasClient(client),
      'Expected client to be defined as required by the enabled flag.'
    );

    invariant(
      isAssetModelId(assetModelId),
      'Expected assetModelId to be defined given the enabled condition.'
    );
    invariant(
      isAssetModelCompositeModelId(assetModelCompositeModelId),
      'Expected assetModelCompositeModelId to be defined given the enabled condition.'
    );

    const request = new GetDescribeAssetCompositeModelRequest({
      assetModelId,
      assetModelCompositeModelId,
      client,
      signal,
    });

    const response = await request.send();

    return response;
  };
};
