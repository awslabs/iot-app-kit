import { useMemo } from 'react';
import {
  DescribeAlarmModelRequest,
  IoTEvents,
  IoTEventsClient,
} from '@aws-sdk/client-iot-events';
import { DescribeAlarmModel } from '@iot-app-kit/core';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { queryClient } from '../queryClient';
import { DescribeAlarmModelCacheKeyFactory } from './describeAlarmModelQueryKeyFactory';
import { hasRequestFunction, isAlarmModelId } from '../predicates';
import { useIoTEventsClient } from '../../hooks/requestFunctions/useIoTEventsClient';
import { QueryOptionsGlobal } from '../common/types';

export type UseDescribeAlarmModelsOptions = {
  iotEventsClient?: IoTEventsClient | IoTEvents;
  requests?: (DescribeAlarmModelRequest | undefined)[];
} & QueryOptionsGlobal;

/**
 * useDescribeAlarmModels is a hook to call IoT Events DescribeAlarmModel on a list of alarmModelNames
 * to retrieve the last version of the alarmModels
 * AlarmModelNames may not be defined in the list, which will disable its query
 *
 * @param iotEventsClient is an AWS SDK IoT Events client
 * @param alarmModelNames is a list of alarmModelNames where IoT Events DescribeAlarmModel API is called on each
 * @returns list of tanstack query results with a DescribeAlarmModelResponse
 */
export function useDescribeAlarmModels({
  iotEventsClient,
  requests = [],
  retry,
}: UseDescribeAlarmModelsOptions) {
  const { describeAlarmModel } = useIoTEventsClient({
    iotEventsClient,
  });

  // Memoize the queries to ensure they don't rerun if the same alarmModelNames are used on a rerender
  const queries = useMemo(
    () =>
      requests.map((describeAlarmModelRequest) => {
        const cacheKeyFactory = new DescribeAlarmModelCacheKeyFactory({
          ...describeAlarmModelRequest,
        });
        return {
          enabled: isEnabled({
            alarmModelName: describeAlarmModelRequest?.alarmModelName,
            describeAlarmModel,
          }),
          queryKey: cacheKeyFactory.create(),
          queryFn: createQueryFn(describeAlarmModel),
          retry,
        };
      }),
    [requests, describeAlarmModel, retry]
  );

  return useQueries({ queries }, queryClient);
}

// Query is enabled if both an alarmModelName and describeAlarmModel request function is available
const isEnabled = ({
  alarmModelName,
  describeAlarmModel,
}: {
  alarmModelName?: string;
  describeAlarmModel?: DescribeAlarmModel;
}) =>
  isAlarmModelId(alarmModelName) &&
  hasRequestFunction<DescribeAlarmModel>(describeAlarmModel);

// Query function calls describeAlarmModel with the given assetModelName and request function
const createQueryFn = (describeAlarmModel?: DescribeAlarmModel) => {
  return async ({
    queryKey: [{ alarmModelName, alarmModelVersion }],
    signal,
  }: QueryFunctionContext<
    ReturnType<DescribeAlarmModelCacheKeyFactory['create']>
  >) => {
    invariant(
      hasRequestFunction<DescribeAlarmModel>(describeAlarmModel),
      'Expected client with DescribeAlarmModel to be defined as required by the enabled flag.'
    );

    invariant(
      isAlarmModelId(alarmModelName),
      'Expected alarmModelName to be defined as required by the enabled flag.'
    );
    try {
      return await describeAlarmModel(
        { alarmModelName, alarmModelVersion },
        { abortSignal: signal }
      );
    } catch (error) {
      handleError({ alarmModelName, alarmModelVersion }, error);
    }
  };
};

const handleError = (
  request: DescribeAlarmModelRequest,
  error: unknown
): never => {
  console.error(`Failed to describe alarm model. Error: ${error}`);
  console.info('Request input:');
  console.table(request);

  throw error;
};
