import {
  paginateGetPropertyValue,
  type GetPropertyValueCommandInput,
  type GetPropertyValueCommandOutput,
  type IoTTwinMakerClient,
  type IoTTwinMakerServiceException,
  type PropertyValueHistory,
} from '@aws-sdk/client-iottwinmaker';
import { useQueries, type QueryFunctionContext, type UseQueryOptions } from '@tanstack/react-query';

import { propertyValueKeys } from '../cache';

interface UsePropertyValuesProps {
  client: IoTTwinMakerClient;
  queries: {
    input: GetPropertyValueCommandInput;
    options: UseQueryOptions<
      GetPropertyValueCommandOutput['propertyValues'],
      IoTTwinMakerServiceException,
      GetPropertyValueCommandOutput['propertyValues'],
      ReturnType<typeof propertyValueKeys.propertyValueHistory>
    >;
  }[];
}

export function usePropertyValues({ client, queries }: UsePropertyValuesProps) {
  return useQueries({
    queries: queries.map(({ input, options }) => ({
      queryKey: propertyValueKeys.propertyValue(input),
      queryFn: createQueryFn(client),
      ...options,
    })),
  });
}

function createQueryFn(client: IoTTwinMakerClient) {
  return async function ({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof propertyValueKeys.propertyValue>>) {
    const paginator = paginateGetPropertyValue({ client, pageSize: 200 }, input);

    const propertyValues: PropertyValue[] = [];
    for await (const { propertyValues: propertyValuesPage = [] } of paginator) {
      propertyValues.push(...propertyValuesPage);

      if (signal?.aborted) {
        break;
      }
    }

    return propertyValues;
  };
}
