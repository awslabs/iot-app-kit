import {
  ListAlarmModelsCommand,
  type ListAlarmModelsCommandInput,
  type ListAlarmModelsCommandOutput,
  type IoTEventsServiceException,
} from '@aws-sdk/client-iot-events';
import { useInfiniteQuery, type UseInfiniteQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotEventsKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseAlarmModelsProps extends WithClient {
  input?: ListAlarmModelsCommandInput;
  options?: UseInfiniteQueryOptions<
    ListAlarmModelsCommandOutput,
    IoTEventsServiceException,
    ListAlarmModelsCommandOutput,
    ListAlarmModelsCommandOutput,
    ReturnType<typeof iotEventsKeys.alarmModelSummaryList>
  >;
}

/** Use IoT Events alarm model summary resources. */
export function useAlarmModels({ client, input, options }: UseAlarmModelsProps) {
  return useInfiniteQuery({
    ...options,
    enabled: input != null,
    queryKey: input != null ? iotEventsKeys.alarmModelSummaryList(input) : undefined,
    queryFn: createQueryFn({ client }),
    getNextPageParam: ({ nextToken }) => nextToken,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    pageParam: nextToken,
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotEventsKeys.alarmModelSummaryList>>) {
    return client.send(new ListAlarmModelsCommand({ ...input, nextToken }), { abortSignal: signal });
  };
}
