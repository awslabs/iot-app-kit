import { type DescribeAlarmModelResponse } from '@aws-sdk/client-iot-events';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ALARM_INPUT_PROPERTY_ID_2,
  MOCK_ALARM_THRESHOLD_PROPERTY_ID,
  MOCK_ALARM_THRESHOLD_PROPERTY_ID_2,
} from './mockIds';

export const MOCK_ALARM_MODEL_NAME = 'alarmModelName';
export const MOCK_ALARM_MODEL_NAME_2 = 'alarmModelName2';

export const mockAlarmModelArn = `arn:aws:iotevents:us-east-1:123456789012:alarmModel/${MOCK_ALARM_MODEL_NAME}`;
export const mockAlarmModelArn2 = `arn:aws:iotevents:us-east-1:123456789012:alarmModel/${MOCK_ALARM_MODEL_NAME_2}`;

export const mockAlarmModel = {
  alarmModelArn: mockAlarmModelArn,
  alarmModelVersion: '1',
  creationTime: new Date(),
  lastUpdateTime: new Date(),
  status: 'ACTIVE',
  alarmModelName: MOCK_ALARM_MODEL_NAME,
  severity: 1,
  alarmRule: {
    simpleRule: {
      inputProperty: `$sitewise.assetModel.\`f6dca270-d4b9-4de0-9722-d57d3f260cb8\`.\`${MOCK_ALARM_INPUT_PROPERTY_ID}\`.propertyValue.value`,
      comparisonOperator: 'GREATER',
      threshold: `$sitewise.assetModel.\`f6dca270-d4b9-4de0-9722-d57d3f260cb8\`.\`${MOCK_ALARM_THRESHOLD_PROPERTY_ID}\`.propertyValue.value`,
    },
  },
} satisfies DescribeAlarmModelResponse;

export const mockAlarmModel2 = {
  alarmModelArn: mockAlarmModelArn2,
  alarmModelVersion: '1',
  creationTime: new Date(),
  lastUpdateTime: new Date(),
  status: 'ACTIVE',
  alarmModelName: MOCK_ALARM_MODEL_NAME_2,
  severity: 1,
  alarmRule: {
    simpleRule: {
      inputProperty: `$sitewise.assetModel.\`f6dca270-d4b9-4de0-9722-d57d3f260cb8\`.\`${MOCK_ALARM_INPUT_PROPERTY_ID_2}\`.propertyValue.value`,
      comparisonOperator: 'GREATER',
      threshold: `$sitewise.assetModel.\`f6dca270-d4b9-4de0-9722-d57d3f260cb8\`.\`${MOCK_ALARM_THRESHOLD_PROPERTY_ID_2}\`.propertyValue.value`,
    },
  },
} satisfies DescribeAlarmModelResponse;
