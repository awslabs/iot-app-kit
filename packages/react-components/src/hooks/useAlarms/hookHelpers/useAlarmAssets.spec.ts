import { renderHook, waitFor } from '@testing-library/react';
import {
  AssetCompositeModel,
  AssetModelCompositeModel,
  AssetModelProperty,
  AssetProperty,
  DescribeAssetModelResponse,
  DescribeAssetResponse,
} from '@aws-sdk/client-iotsitewise';
import { useAlarmAssets } from './useAlarmAssets';
import {
  AlarmAssetModelRequest,
  AlarmAssetRequest,
  AlarmCompositeModelRequest,
  AlarmData,
  AlarmInputPropertyRequest,
} from '../types';
import { queryClient } from '../../../queries';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ASSET_ID,
  MOCK_ASSET_MODEL_ID,
  MOCK_COMPOSITE_MODEL_ID,
  MOCK_COMPOSITE_MODEL_ID_2,
  MOCK_COMPOSITE_MODEL_NAME_2,
  describeAssetMock,
  describeAssetModelMock,
  iotSiteWiseClientMock,
  mockAlarmCompositeModel,
  mockAlarmCompositeModel2,
  mockAlarmDataDescribeAsset,
  mockAlarmDataDescribeAssetModel,
  mockAlarmModelCompositeModel,
  mockAlarmModelCompositeModel2,
  mockInputProperty,
} from '../../../testing/alarms';

const mockDescribeAssetResponse = ({
  assetId = MOCK_ASSET_ID,
  compositeModels = [],
  assetProperties = [],
}: {
  assetId?: string;
  compositeModels?: AssetCompositeModel[];
  assetProperties?: AssetProperty[];
}): DescribeAssetResponse => ({
  assetModelId: MOCK_ASSET_MODEL_ID,
  assetId,
  assetArn: 'assetArn',
  assetName: 'assetName',
  assetProperties,
  assetHierarchies: [],
  assetCreationDate: new Date(),
  assetLastUpdateDate: new Date(),
  assetStatus: {
    state: 'ACTIVE',
  },
  assetCompositeModels: compositeModels,
});

const mockDescribeAssetModelResponse = ({
  assetModelId = MOCK_ASSET_MODEL_ID,
  compositeModels = [],
  assetModelProperties = [],
}: {
  assetModelId?: string;
  compositeModels?: AssetModelCompositeModel[];
  assetModelProperties?: AssetModelProperty[];
}): DescribeAssetModelResponse => ({
  assetModelId,
  assetModelArn: 'assetModelArn',
  assetModelName: 'assetModelName',
  assetModelDescription: 'assetModelDescription',
  assetModelProperties,
  assetModelHierarchies: [],
  assetModelCreationDate: new Date(),
  assetModelLastUpdateDate: new Date(),
  assetModelStatus: {
    state: 'ACTIVE',
  },
  assetModelCompositeModels: compositeModels,
});

describe('useAlarmAssets', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('should return AlarmData with content for one alarm in an alarm composite model request', async () => {
    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({ compositeModels: [mockAlarmCompositeModel] })
    );

    const alarmCompositeModelRequest: AlarmCompositeModelRequest = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
    };

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmCompositeModelRequest],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(
        mockAlarmDataDescribeAsset
      );
    });

    expect(describeAssetMock).toBeCalled();
    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should return AlarmData with content for one alarm in an alarm input property request', async () => {
    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({
        compositeModels: [mockAlarmCompositeModel],
        assetProperties: [mockInputProperty],
      })
    );

    const alarmInputPropertyRequest: AlarmInputPropertyRequest = {
      assetId: MOCK_ASSET_ID,
      inputPropertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
    };

    const expectedAlarmData: AlarmData = {
      ...mockAlarmDataDescribeAsset,
      inputProperty: [mockInputProperty],
    };

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmInputPropertyRequest],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData);
    });

    expect(describeAssetMock).toBeCalled();
    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should return AlarmData with content for multiple alarms in an alarm asset request', async () => {
    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({
        compositeModels: [mockAlarmCompositeModel, mockAlarmCompositeModel2],
      })
    );

    const mockAlarmDataDescribeAsset2: AlarmData = {
      ...mockAlarmDataDescribeAsset,
      compositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
      compositeModelName: MOCK_COMPOSITE_MODEL_NAME_2,
    };

    const alarmAssetRequest: AlarmAssetRequest = {
      assetId: MOCK_ASSET_ID,
    };

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmAssetRequest],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(2);
      expect(alarmDataResults.current[0]).toMatchObject(
        mockAlarmDataDescribeAsset
      );
      expect(alarmDataResults.current[1]).toMatchObject(
        mockAlarmDataDescribeAsset2
      );
    });

    expect(describeAssetMock).toBeCalled();
    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should return AlarmData with content for multiple alarms in an alarm asset model request', async () => {
    describeAssetModelMock.mockResolvedValue(
      mockDescribeAssetModelResponse({
        compositeModels: [
          mockAlarmModelCompositeModel,
          mockAlarmModelCompositeModel2,
        ],
      })
    );

    const alarmAssetModelRequest: AlarmAssetModelRequest = {
      assetModelId: MOCK_ASSET_MODEL_ID,
    };

    const mockAlarmDataDescribeAssetModel2: AlarmData = {
      ...mockAlarmDataDescribeAssetModel,
      compositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
      compositeModelName: MOCK_COMPOSITE_MODEL_NAME_2,
    };

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmAssetModelRequest],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(2);
      expect(alarmDataResults.current[0]).toMatchObject(
        mockAlarmDataDescribeAssetModel
      );
      expect(alarmDataResults.current[1]).toMatchObject(
        mockAlarmDataDescribeAssetModel2
      );
    });

    expect(describeAssetMock).not.toBeCalled();
    expect(describeAssetModelMock).toBeCalled();
  });

  it('should return no AlarmData when there are no alarms on an asset', async () => {
    describeAssetMock.mockResolvedValue(mockDescribeAssetResponse({}));

    const alarmAssetRequest: AlarmAssetRequest = {
      assetId: MOCK_ASSET_ID,
    };

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmAssetRequest],
      })
    );

    await waitFor(() => expect(alarmDataResults.current.length).toBe(0));

    expect(describeAssetMock).toBeCalled();
    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should return no AlarmData when there are no alarms on an asset model', async () => {
    describeAssetModelMock.mockResolvedValue(
      mockDescribeAssetModelResponse({})
    );

    const alarmAssetModelRequest: AlarmAssetModelRequest = {
      assetModelId: MOCK_ASSET_MODEL_ID,
    };

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmAssetModelRequest],
      })
    );

    await waitFor(() => expect(alarmDataResults.current.length).toBe(0));

    expect(describeAssetMock).not.toBeCalled();
    expect(describeAssetModelMock).toBeCalled();
  });

  it('should return AlarmData with content for multiple alarms in multiple requests', async () => {
    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({
        compositeModels: [mockAlarmCompositeModel, mockAlarmCompositeModel2],
      })
    );

    const alarmCompositeModelRequest1: AlarmCompositeModelRequest = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
    };

    const alarmCompositeModelRequest2: AlarmCompositeModelRequest = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
    };

    const mockAlarmDataDescribeAsset2: AlarmData = {
      ...mockAlarmDataDescribeAsset,
      compositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
      compositeModelName: MOCK_COMPOSITE_MODEL_NAME_2,
    };

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmCompositeModelRequest1, alarmCompositeModelRequest2],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(2);
      expect(alarmDataResults.current[0]).toMatchObject(
        mockAlarmDataDescribeAsset
      );
      expect(alarmDataResults.current[1]).toMatchObject(
        mockAlarmDataDescribeAsset2
      );
    });

    expect(describeAssetMock).toBeCalledTimes(1);
    expect(describeAssetModelMock).not.toBeCalled();
  });
});
