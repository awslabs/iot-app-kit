import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { DescribeTimeSeriesCacheKeyFactory } from './describeTimeSeriesCacheKeyFactory';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import invariant from 'tiny-invariant';
import { DescribeTimeSeries } from './describeTimeSeries';

function isEnabled(alias: string | undefined): alias is string {
  return Boolean(alias);
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ alias }],
    signal,
  }: QueryFunctionContext<ReturnType<DescribeTimeSeriesCacheKeyFactory['create']>>) {
    invariant(isEnabled(alias), 'Expected alias to be defined given the enabled condition.');

    const request = new DescribeTimeSeries({ alias, client, signal });
    const response = await request.send();

    return response;
  };
}

export const useDescribeUnmodeledTimeSeries = (queryConfig: StyledSiteWiseQueryConfig, client: IoTSiteWiseClient) => {
  const cacheKeyFactory = new DescribeTimeSeriesCacheKeyFactory();
  const unmodeledProps = queryConfig.query?.properties ?? [];

  const unmodeledQueries =
    useQueries({
      queries: unmodeledProps.map(({ propertyAlias: alias }) => ({
        enabled: isEnabled(alias),
        queryKey: cacheKeyFactory.create(alias),
        queryFn: createQueryFn(client),
      })),
    }) ?? [];

  const unmodeledAssetDescription = unmodeledQueries.flatMap(({ data = [] }) => data);
  const isError = unmodeledQueries.some(({ isError }) => isError);
  const isFetching = unmodeledQueries.some(({ isFetching }) => isFetching);
  const isLoading = unmodeledQueries.some(({ isLoading }) => isLoading);
  const isSuccess = unmodeledQueries.every(({ isSuccess }) => isSuccess);

  return { unmodeledAssetDescription, isError, isFetching, isLoading, isSuccess };
};
