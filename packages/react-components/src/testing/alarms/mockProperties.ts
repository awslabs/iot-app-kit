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
import { MOCK_ALARM_INPUT_PROPERTY_ID } from './mockIds';

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

export const mockDefaultAlarmSource = 'alarmModelArn';
export const mockSourceAssetModelProperty: AssetModelProperty = {
  ...mockSourceAssetProperty,
  type: {
    attribute: {
      defaultValue: mockDefaultAlarmSource,
    },
  },
};

export const mockInputProperty: AssetProperty = {
  id: MOCK_ALARM_INPUT_PROPERTY_ID,
  name: 'inputPropertyName',
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
  mockStringAssetPropertyValue(mockDefaultAlarmSource);
