import {
  DescribeAlarmModelCommand,
  type IoTEventsClient,
} from '@aws-sdk/client-iot-events';
import type { DescribeAlarmModel } from '@iot-app-kit/core';

/**
 * IoT Events request function implementations
 *
 * Accepts an IoTEventsClient and converts it to a specific
 * API callback that can be resolved with a Promise. In other
 * words, these are converters from the command pattern client
 * to a promise pattern client API.
 *
 * @experimental Do not use in production.
 */

export function createDescribeAlarmModel(
  client: IoTEventsClient
): DescribeAlarmModel {
  const describeAlarmModel: DescribeAlarmModel = async (request, options) => {
    return client.send(new DescribeAlarmModelCommand(request), options);
  };

  return describeAlarmModel;
}
