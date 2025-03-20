import {
  DescribeAlarmModelCommand,
  type IoTEventsClient,
} from '@aws-sdk/client-iot-events';
import type { DescribeAlarmModel } from '@iot-app-kit/core';

export function createDescribeAlarmModel(
  client: IoTEventsClient
): DescribeAlarmModel {
  return async (request, options) => {
    return client.send(new DescribeAlarmModelCommand(request), options);
  };
}
