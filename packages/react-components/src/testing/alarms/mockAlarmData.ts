import { AlarmData } from '../../hooks/useAlarms';
import {
  MOCK_ASSET_ID,
  MOCK_ASSET_MODEL_ID,
  MOCK_COMPOSITE_MODEL_ID,
  MOCK_COMPOSITE_MODEL_ID_2,
  MOCK_COMPOSITE_MODEL_NAME,
  MOCK_COMPOSITE_MODEL_NAME_2,
} from './mockIds';
import {
  mockDefaultAlarmSource,
  mockDefaultAlarmState,
  mockDefaultAlarmType,
  mockSourceAssetModelProperty,
  mockSourceAssetProperty,
  mockSourceAssetProperty2,
  mockStateAssetModelProperty,
  mockStateAssetProperty,
  mockStateAssetProperty2,
  mockTypeAssetModelProperty,
  mockTypeAssetProperty,
  mockTypeAssetProperty2,
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
          stringValue: mockDefaultAlarmSource,
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
