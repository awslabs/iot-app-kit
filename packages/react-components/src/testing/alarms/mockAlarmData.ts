import { AlarmData } from '../../hooks/useAlarms';
import {
  mockAlarmModel,
  mockAlarmModel2,
  mockAlarmModelArn,
} from './mockAlarmModel';
import {
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
  mockTypeAssetModelProperty,
  mockTypeAssetProperty,
  mockTypeAssetProperty2,
  mockTypeAssetPropertyValue,
} from './mockProperties';

export const mockAlarmDataDescribeAsset: AlarmData = {
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
};

export const mockAlarmDataDescribeAsset2: AlarmData = {
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
};

export const mockAlarmDataDescribeAssetModel: AlarmData = {
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
};

export const mockAlarmDataGetAssetPropertyValue: AlarmData = {
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
};

export const mockAlarmDataGetAssetPropertyValue2: AlarmData = {
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
};

export const mockAlarmDataDescribeAlarmModel: AlarmData = {
  ...mockAlarmDataGetAssetPropertyValue,
  models: [mockAlarmModel],
};
export const mockAlarmDataDescribeAlarmModel2: AlarmData = {
  ...mockAlarmDataGetAssetPropertyValue2,
  models: [mockAlarmModel2],
};
