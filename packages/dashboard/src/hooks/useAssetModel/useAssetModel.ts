import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { AssetModelCacheKeyFactory } from './assetModelCacheKeyFactory';
import { DescribeAssetModelRequest } from './describeAssetModelRequest';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';

type SingleAssetRequest = {
  assetModelId?: string;
  assetModelIds?: never;
};

type MultiAssetRequest = {
  assetModelIds?: string[];
  assetModelId?: never;
};

export type UseAssetModelOptions = {
  client: IoTSiteWiseClient;
} & (SingleAssetRequest | MultiAssetRequest);

/** Use the list of child assets for an asset with a given asset ID. */
export function useAssetModel({ assetModelId, assetModelIds, client }: UseAssetModelOptions) {
  const cacheKeyFactory = new AssetModelCacheKeyFactory();

  const requestIds = assetModelId !== undefined ? [assetModelId] : assetModelIds ?? [];

  const queries =
    useQueries({
      queries: requestIds.map((id) => ({
        // we need assetId and hierarchyId to make a successful request
        enabled: isEnabled(id),
        queryKey: cacheKeyFactory.create(id),
        queryFn: createQueryFn(client),
      })),
    }) ?? [];

  const assetModelResponses = createNonNullableList(queries.map(({ data }) => data));
  const assetModel = assetModelId !== undefined ? assetModelResponses.at(0) : undefined;
  const assetModels = assetModelIds !== undefined ? assetModelResponses : undefined;

  const isError = queries.some(({ isError }) => isError);
  const isFetching = queries.some(({ isFetching }) => isFetching);
  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isSuccess = queries.every(({ isSuccess }) => isSuccess);

  return { assetModel, assetModels, isError, isFetching, isLoading, isSuccess };
}

function isEnabled(assetModelId: string | undefined): assetModelId is string {
  return Boolean(assetModelId);
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetModelId }],
    signal,
  }: QueryFunctionContext<ReturnType<AssetModelCacheKeyFactory['create']>>) {
    invariant(isEnabled(assetModelId), 'Expected asset model ID to be defined as required by the enabled flag.');

    const request = new DescribeAssetModelRequest({ assetModelId, client, signal });
    const response = await request.send();

    return response;
  };
}
