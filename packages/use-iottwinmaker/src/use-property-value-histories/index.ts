import {
  paginateGetPropertyValueHistory,
  type GetPropertyValueHistoryCommandInput,
  type GetPropertyValueHistoryCommandOutput,
  type IoTTwinMakerClient,
  type IoTTwinMakerServiceException,
  type PropertyValueHistory,
} from '@aws-sdk/client-iottwinmaker';
import { useQueries, type QueryFunctionContext, type UseQueryOptions } from '@tanstack/react-query';

import { propertyValueKeys } from '../cache';

interface UsePropertyValueHistoriesProps {
  client: IoTTwinMakerClient;
  queries: {
    input: GetPropertyValueHistoryCommandInput;
    options: UseQueryOptions<
      GetPropertyValueHistoryCommandOutput['propertyValues'],
      IoTTwinMakerServiceException,
      GetPropertyValueHistoryCommandOutput['propertyValues'],
      ReturnType<typeof propertyValueKeys.propertyValueHistory>
    >;
  }[];
}

export function usePropertyValueHistories({ client, queries }: UsePropertyValueHistoriesProps) {
  return useQueries({
    queries: queries.map(({ input, options }) => ({
      queryKey: propertyValueKeys.propertyValueHistory(input),
      queryFn: createQueryFn(client),
      ...options,
    })),
  });
}

function createQueryFn(client: IoTTwinMakerClient) {
  return async function ({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof propertyValueKeys.propertyValueHistory>>) {
    const paginator = paginateGetPropertyValueHistory({ client, pageSize: 200 }, input);

    const propertyValues: PropertyValueHistory[] = [];
    for await (const { propertyValues: propertyValuesPage = [] } of paginator) {
      propertyValues.push(...propertyValuesPage);

      if (signal?.aborted) {
        break;
      }
    }

    return propertyValues;
  };
}
