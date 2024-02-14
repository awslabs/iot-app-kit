import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import invariant from 'tiny-invariant';

import { DashboardState } from '~/store/state';
import { listModeledDataStreamsRequestWithCompositeModels } from './listModeledDataStreamsRequestWithCompositeModels';
import { ListModeledDataStreamsRequest } from './listModeledDataStreamsRequest';
import { ModeledDataStreamCacheKeyFactory } from './modeledDataStreamCacheKeyFactory';
import type { SelectedAsset } from '../../types';
import type { ModeledDataStream } from '../types';

export interface UseModeledDataStreamsProps {
  assetProps: SelectedAsset[];
  client: IoTSiteWiseClient;
}

export interface UseModeledDataStreamsOutput {
  assetProperties: ModeledDataStream[];
  isFetching: boolean;
  isError: boolean;
}

export function useModeledDataStreams({
  assetProps,
  client,
}: UseModeledDataStreamsProps): UseModeledDataStreamsOutput {
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );

  const cacheKeyFactory = new ModeledDataStreamCacheKeyFactory();
  const queries =
    useQueries({
      queries: assetProps.map((selectedAsset) => ({
        // we store the descriptions in the cache using the {assetID, assetModelId} as the key
        queryKey: cacheKeyFactory.create(selectedAsset),
        queryFn: isEdgeModeEnabled
          ? createQueryFn(client)
          : createCompositeQueryFn(client),
      })),
    }) ?? [];

  const assetProperties = queries.flatMap(({ data = [] }) => data);
  const isFetching = queries.some(({ isFetching }) => isFetching);
  const isError = queries.some(({ isError }) => isError);

  return { assetProperties, isFetching, isError };
}

function createCompositeQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ selectedAsset }],
    signal,
  }: QueryFunctionContext<
    ReturnType<ModeledDataStreamCacheKeyFactory['create']>
  >) {
    invariant(
      selectedAsset,
      'Expected assetProp to be defined as required by the enabled flag.'
    );
    const request = new listModeledDataStreamsRequestWithCompositeModels({
      selectedAsset,
      client,
      signal,
    });
    const response = await request.send();

    return response;
  };
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ selectedAsset }],
    signal,
  }: QueryFunctionContext<
    ReturnType<ModeledDataStreamCacheKeyFactory['create']>
  >) {
    invariant(
      selectedAsset,
      'Expected assetProp to be defined as required by the enabled flag.'
    );

    const assetId = selectedAsset.assetId;
    const request = new ListModeledDataStreamsRequest({
      assetId,
      client,
      signal,
    });
    const response = await request.send();

    return response;
  };
}
