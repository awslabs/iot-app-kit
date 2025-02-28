import type { AlarmDataInternal } from '../../hooks/useAlarms';
import {
  mockAlarmModel,
  mockAlarmModel2,
  mockAlarmModelArn,
} from './mockAlarmModel';
import {
  MOCK_ALARM_INPUT_PROPERTY_2_NAME,
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ALARM_INPUT_PROPERTY_ID_2,
  MOCK_ALARM_INPUT_PROPERTY_NAME,
  MOCK_ASSET_ID,
  MOCK_ASSET_MODEL_ID,
  MOCK_COMPOSITE_MODEL_ID,
  MOCK_COMPOSITE_MODEL_ID_2,
  MOCK_COMPOSITE_MODEL_NAME,
  MOCK_COMPOSITE_MODEL_NAME_2,
} from './mockIds';
import {
  mockDefaultAlarmState,
  mockDefaultAlarmType,
  mockSourceAssetModelProperty,
  mockSourceAssetProperty,
  mockSourceAssetProperty2,
  mockSourceAssetPropertyValue,
  mockSourceAssetPropertyValue2,
  mockStateAssetModelProperty,
  mockStateAssetProperty,
  mockStateAssetProperty2,
  mockStateAssetPropertyValue,
  mockStateAssetPropertyValue2,
  mockThresholdAssetProperty,
  mockTypeAssetModelProperty,
  mockTypeAssetProperty,
  mockTypeAssetProperty2,
  mockTypeAssetPropertyValue,
} from './mockProperties';

export const mockAlarmDataDescribeAsset = {
  assetModelId: MOCK_ASSET_MODEL_ID,
  assetId: MOCK_ASSET_ID,
  compositeModelId: MOCK_COMPOSITE_MODEL_ID,
  compositeModelName: MOCK_COMPOSITE_MODEL_NAME,
  state: {
    property: mockStateAssetProperty,
  },
  type: {
    property: mockTypeAssetProperty,
  },
  source: {
    property: mockSourceAssetProperty,
  },
  status: {
    isLoading: false,
    isError: false,
    isRefetching: false,
    isSuccess: true,
  },
} satisfies AlarmDataInternal;

export const mockAlarmDataDescribeAsset2 = {
  assetModelId: MOCK_ASSET_MODEL_ID,
  assetId: MOCK_ASSET_ID,
  compositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
  compositeModelName: MOCK_COMPOSITE_MODEL_NAME_2,
  state: {
    property: mockStateAssetProperty2,
  },
  type: {
    property: mockTypeAssetProperty2,
  },
  source: {
    property: mockSourceAssetProperty2,
  },
  status: {
    isLoading: false,
    isError: false,
    isRefetching: false,
    isSuccess: true,
  },
} satisfies AlarmDataInternal;

export const mockAlarmDataDescribeAssetModel = {
  assetModelId: MOCK_ASSET_MODEL_ID,
  compositeModelId: MOCK_COMPOSITE_MODEL_ID,
  compositeModelName: MOCK_COMPOSITE_MODEL_NAME,
  state: {
    property: mockStateAssetModelProperty,
    data: [
      {
        value: {
          stringValue: mockDefaultAlarmState,
        },
        timestamp: undefined,
      },
    ],
  },
  type: {
    property: mockTypeAssetModelProperty,
    data: [
      {
        value: {
          stringValue: mockDefaultAlarmType,
        },
        timestamp: undefined,
      },
    ],
  },
  source: {
    property: mockSourceAssetModelProperty,
    data: [
      {
        value: {
          stringValue: mockAlarmModelArn,
        },
        timestamp: undefined,
      },
    ],
  },
  status: {
    isLoading: false,
    isError: false,
    isRefetching: false,
    isSuccess: true,
  },
} satisfies AlarmDataInternal;

export const mockAlarmDataGetAssetPropertyValue = {
  ...mockAlarmDataDescribeAsset,
  state: {
    property: mockStateAssetProperty,
    data: [mockStateAssetPropertyValue],
  },
  type: {
    property: mockTypeAssetProperty,
    data: [mockTypeAssetPropertyValue],
  },
  source: {
    property: mockSourceAssetProperty,
    data: [mockSourceAssetPropertyValue],
  },
} satisfies AlarmDataInternal;

export const mockAlarmDataGetAssetPropertyValue2 = {
  ...mockAlarmDataDescribeAsset2,
  state: {
    property: mockStateAssetProperty2,
    data: [mockStateAssetPropertyValue2],
  },
  type: {
    property: mockTypeAssetProperty2,
    data: [mockTypeAssetPropertyValue],
  },
  source: {
    property: mockSourceAssetProperty2,
    data: [mockSourceAssetPropertyValue2],
  },
} satisfies AlarmDataInternal;

export const mockAlarmDataDescribeAlarmModel = {
  ...mockAlarmDataGetAssetPropertyValue,
  models: [mockAlarmModel],
} satisfies AlarmDataInternal;
export const mockAlarmDataDescribeAlarmModel2 = {
  ...mockAlarmDataGetAssetPropertyValue2,
  models: [mockAlarmModel2],
} satisfies AlarmDataInternal;

export const mockAlarmDataWithInputProperty = {
  ...mockAlarmDataDescribeAlarmModel,
  inputProperty: [
    {
      property: {
        id: MOCK_ALARM_INPUT_PROPERTY_ID,
        name: MOCK_ALARM_INPUT_PROPERTY_NAME,
        dataType: 'DOUBLE',
      },
    },
  ],
} satisfies AlarmDataInternal;
export const mockAlarmDataWithInputProperty2 = {
  ...mockAlarmDataDescribeAlarmModel2,
  inputProperty: [
    {
      property: {
        id: MOCK_ALARM_INPUT_PROPERTY_ID_2,
        name: MOCK_ALARM_INPUT_PROPERTY_2_NAME,
        dataType: 'DOUBLE',
      },
    },
  ],
} satisfies AlarmDataInternal;

export const mockAlarmDataWithThresholds = {
  ...mockAlarmDataWithInputProperty,
  thresholds: [mockThresholdAssetProperty],
} satisfies AlarmDataInternal;
