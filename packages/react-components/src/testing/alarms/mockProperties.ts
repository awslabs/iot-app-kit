import {
  AssetModelProperty,
  AssetProperty,
  AssetPropertyValue,
} from '@aws-sdk/client-iotsitewise';
import {
  ALARM_SOURCE_PROPERTY_NAME,
  ALARM_STATE_PROPERTY_NAME,
  ALARM_TYPE_PROPERTY_NAME,
} from '../../hooks/useAlarms/constants';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ALARM_INPUT_PROPERTY_ID_2,
} from './mockIds';
import { mockAlarmModelArn, mockAlarmModelArn2 } from './mockAlarmModel';

export const mockAssetProperties = [
  {
    id: 'property1',
    name: 'propertyName1',
    dataType: 'STRING',
  },
  {
    id: 'property1',
    name: 'propertyName1',
    dataType: 'STRING',
  },
] satisfies AssetProperty[];

export const mockAssetModelProperties = [
  {
    id: 'property1',
    name: 'propertyName1',
    dataType: 'STRING',
    type: {},
  },
  {
    id: 'property1',
    name: 'propertyName1',
    dataType: 'STRING',
    type: {},
  },
] satisfies AssetModelProperty[];

export const mockStateAssetProperty = {
  id: 'stateId',
  name: ALARM_STATE_PROPERTY_NAME,
  dataType: 'STRING',
} satisfies AssetProperty;

export const mockStateAssetProperty2 = {
  id: 'stateId2',
  name: ALARM_STATE_PROPERTY_NAME,
  dataType: 'STRING',
} satisfies AssetProperty;

export const mockTypeAssetProperty = {
  id: 'typeId',
  name: ALARM_TYPE_PROPERTY_NAME,
  dataType: 'STRING',
} satisfies AssetProperty;

export const mockTypeAssetProperty2 = {
  id: 'typeId2',
  name: ALARM_STATE_PROPERTY_NAME,
  dataType: 'STRING',
} satisfies AssetProperty;

export const mockSourceAssetProperty = {
  id: 'sourceId',
  name: ALARM_SOURCE_PROPERTY_NAME,
  dataType: 'STRING',
} satisfies AssetProperty;

export const mockSourceAssetProperty2 = {
  id: 'sourceId2',
  name: ALARM_STATE_PROPERTY_NAME,
  dataType: 'STRING',
} satisfies AssetProperty;

export const mockDefaultAlarmStateRuleEvaluation = {
  simpleRule: {
    inputProperty: 41,
    operator: 'GREATER',
    threshold: 30,
  },
};
export const mockDefaultAlarmState = JSON.stringify({
  stateName: 'NORMAL',
  ruleEvaluation: mockDefaultAlarmStateRuleEvaluation,
});

export const mockDefaultAlarmState2 = JSON.stringify({
  stateName: 'ACTIVE',
  ruleEvaluation: {
    simpleRule: {
      inputProperty: 41,
      operator: 'GREATER',
      threshold: 30,
    },
  },
});

export const mockStateAssetModelProperty = {
  ...mockStateAssetProperty,
  type: {
    attribute: {
      defaultValue: mockDefaultAlarmState,
    },
  },
} satisfies AssetModelProperty;

export const mockDefaultAlarmType = 'IOT_EVENTS';
export const mockTypeAssetModelProperty = {
  ...mockTypeAssetProperty,
  type: {
    attribute: {
      defaultValue: mockDefaultAlarmType,
    },
  },
} satisfies AssetModelProperty;

export const mockSourceAssetModelProperty = {
  ...mockSourceAssetProperty,
  type: {
    attribute: {
      defaultValue: mockAlarmModelArn,
    },
  },
} satisfies AssetModelProperty;

export const mockInputProperty = {
  id: MOCK_ALARM_INPUT_PROPERTY_ID,
  name: 'inputPropertyName',
  dataType: 'STRING',
} satisfies AssetProperty;

export const mockInputProperty2 = {
  id: MOCK_ALARM_INPUT_PROPERTY_ID_2,
  name: 'inputPropertyName2',
  dataType: 'STRING',
} satisfies AssetProperty;

export const mockStringAssetPropertyValue = (
  value: string,
  date?: Date
): AssetPropertyValue => ({
  value: {
    stringValue: value,
  },
  timestamp: {
    timeInSeconds: date ? date.getTime() / 1000 : 100,
    offsetInNanos: 0,
  },
  quality: 'GOOD',
});

export const mockDoubleAssetPropertyValue = (
  value: number,
  date?: Date
): AssetPropertyValue => ({
  value: {
    doubleValue: value,
  },
  timestamp: {
    timeInSeconds: date ? date.getTime() / 1000 : 100,
    offsetInNanos: 0,
  },
  quality: 'GOOD',
});

export const mockStateAssetPropertyValue = mockStringAssetPropertyValue(
  mockDefaultAlarmState
) satisfies AssetPropertyValue;
export const mockTypeAssetPropertyValue = mockStringAssetPropertyValue(
  mockDefaultAlarmType
) satisfies AssetPropertyValue;
export const mockSourceAssetPropertyValue = mockStringAssetPropertyValue(
  mockAlarmModelArn
) satisfies AssetPropertyValue;

export const mockStateAssetPropertyValue2 = mockStringAssetPropertyValue(
  mockDefaultAlarmState2
) satisfies AssetPropertyValue;
export const mockSourceAssetPropertyValue2 = mockStringAssetPropertyValue(
  mockAlarmModelArn2
) satisfies AssetPropertyValue;
