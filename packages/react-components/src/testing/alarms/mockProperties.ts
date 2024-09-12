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

export const mockStateAssetProperty: AssetProperty = {
  id: 'stateId',
  name: ALARM_STATE_PROPERTY_NAME,
  dataType: 'STRING',
};

export const mockStateAssetProperty2: AssetProperty = {
  id: 'stateId2',
  name: ALARM_STATE_PROPERTY_NAME,
  dataType: 'STRING',
};

export const mockTypeAssetProperty: AssetProperty = {
  id: 'typeId',
  name: ALARM_TYPE_PROPERTY_NAME,
  dataType: 'STRING',
};

export const mockTypeAssetProperty2: AssetProperty = {
  id: 'typeId2',
  name: ALARM_STATE_PROPERTY_NAME,
  dataType: 'STRING',
};

export const mockSourceAssetProperty: AssetProperty = {
  id: 'sourceId',
  name: ALARM_SOURCE_PROPERTY_NAME,
  dataType: 'STRING',
};

export const mockSourceAssetProperty2: AssetProperty = {
  id: 'sourceId2',
  name: ALARM_STATE_PROPERTY_NAME,
  dataType: 'STRING',
};

export const mockDefaultAlarmState = 'NORMAL';
export const mockDefaultAlarmState2 = 'ACTIVE';
export const mockStateAssetModelProperty: AssetModelProperty = {
  ...mockStateAssetProperty,
  type: {
    attribute: {
      defaultValue: mockDefaultAlarmState,
    },
  },
};

export const mockDefaultAlarmType = 'IOT_EVENTS';
export const mockTypeAssetModelProperty: AssetModelProperty = {
  ...mockTypeAssetProperty,
  type: {
    attribute: {
      defaultValue: mockDefaultAlarmType,
    },
  },
};

export const mockSourceAssetModelProperty: AssetModelProperty = {
  ...mockSourceAssetProperty,
  type: {
    attribute: {
      defaultValue: mockAlarmModelArn,
    },
  },
};

export const mockInputProperty: AssetProperty = {
  id: MOCK_ALARM_INPUT_PROPERTY_ID,
  name: 'inputPropertyName',
  dataType: 'STRING',
};

export const mockInputProperty2: AssetProperty = {
  id: MOCK_ALARM_INPUT_PROPERTY_ID_2,
  name: 'inputPropertyName2',
  dataType: 'STRING',
};

export const mockStringAssetPropertyValue = (
  value: string
): AssetPropertyValue => ({
  value: {
    stringValue: value,
  },
  timestamp: {
    timeInSeconds: 100,
    offsetInNanos: 0,
  },
  quality: 'GOOD',
});

export const mockStateAssetPropertyValue: AssetPropertyValue =
  mockStringAssetPropertyValue(mockDefaultAlarmState);
export const mockTypeAssetPropertyValue: AssetPropertyValue =
  mockStringAssetPropertyValue(mockDefaultAlarmType);
export const mockSourceAssetPropertyValue: AssetPropertyValue =
  mockStringAssetPropertyValue(mockAlarmModelArn);

export const mockStateAssetPropertyValue2: AssetPropertyValue =
  mockStringAssetPropertyValue(mockDefaultAlarmState2);
export const mockSourceAssetPropertyValue2: AssetPropertyValue =
  mockStringAssetPropertyValue(mockAlarmModelArn2);
