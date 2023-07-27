import {
  DescribeAlarmModelCommand,
  type DescribeAlarmModelCommandInput,
  type DescribeAlarmModelCommandOutput,
  type IoTEventsServiceException,
} from '@aws-sdk/client-iot-events';
import { useQuery, type UseQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotEventsKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseAlarmModelProps extends WithClient {
  input?: DescribeAlarmModelCommandInput;
  options?: UseQueryOptions<
    DescribeAlarmModelCommandOutput,
    IoTEventsServiceException,
    DescribeAlarmModelCommandOutput,
    ReturnType<typeof iotEventsKeys.alarmModelDescription>
  >;
}

/** Use an IoT Events alarm model description resource. */
export function useAlarmModel({ client, input, options }: UseAlarmModelProps) {
  return useQuery({
    enabled: input != null,
    queryKey: input != null ? iotEventsKeys.alarmModelDescription(input) : undefined,
    queryFn: createQueryFn({ client }),
    ...options,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotEventsKeys.alarmModelDescription>>) {
    return client.send(new DescribeAlarmModelCommand(input), { abortSignal: signal });
  };
}
