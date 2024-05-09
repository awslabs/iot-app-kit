import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useQueries } from '@tanstack/react-query';
import {
  createDescribeAssetPropertyQueryFn,
  isDescribeAssetPropertyEnabled,
} from '../useDescribeAssetProperty';
import { createNonNullableList } from '../../utils/createNonNullableList';
import { DescribeAssetPropertyCacheKeyFactory } from '../useDescribeAssetProperty/describeAssetPropertyQueryKeyFactory';
import { queryClient } from '../queryClient';

export interface UseDescribeAssetPropertiesOptions {
  client?: IoTSiteWiseClient;
  describeAssetPropertyRequests?: { assetId?: string; propertyId?: string }[];
}

export const useDescribeAssetProperties = ({
  client,
  describeAssetPropertyRequests = [],
}: UseDescribeAssetPropertiesOptions) => {
  const queries =
    useQueries(
      {
        queries: describeAssetPropertyRequests.map(
          ({ assetId, propertyId }) => ({
            enabled: isDescribeAssetPropertyEnabled({
              assetId,
              propertyId,
              client,
            }),
            queryKey: new DescribeAssetPropertyCacheKeyFactory({
              assetId,
              propertyId,
            }).create(),
            queryFn: createDescribeAssetPropertyQueryFn(client),
          })
        ),
      },
      queryClient
    ) ?? [];

  const data = createNonNullableList(queries.flatMap(({ data }) => data));

  const isError = queries.some(({ isError }) => isError);
  const isFetching = queries.some(({ isFetching }) => isFetching);
  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isSuccess = queries.every(({ isSuccess }) => isSuccess);

  return {
    data,
    isError,
    isFetching,
    isLoading,
    isSuccess,
  };
};
