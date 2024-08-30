import type {
  DescribeAlarmModelRequest,
  DescribeAlarmModelResponse,
} from '@aws-sdk/client-iot-events';
import { RequestFunction } from './common';

/**
 * First-class function for requesting a single IoT Events alarm model summary
 * resource from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iotevents/latest/apireference/API_DescribeAlarmModel.html}
 */
export type DescribeAlarmModel = RequestFunction<
  DescribeAlarmModelRequest,
  DescribeAlarmModelResponse
>;
