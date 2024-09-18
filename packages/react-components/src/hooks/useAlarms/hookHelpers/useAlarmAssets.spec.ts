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
import type {
  AlarmAssetModelRequest,
  AlarmAssetRequest,
  AlarmCompositeModelRequest,
  AlarmDataInternal,
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
  mockAssetModelProperties,
  mockAssetProperties,
  mockInputProperty,
} from '../../../testing/alarms';

const mockDescribeAssetResponse = ({
  assetId = MOCK_ASSET_ID,
  compositeModels = [],
  assetProperties = mockAssetProperties,
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
  assetModelProperties = mockAssetModelProperties,
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

  it('should have the correct status', async () => {
    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({ compositeModels: [mockAlarmCompositeModel] })
    );

    const alarmAssetRequest = {
      assetId: MOCK_ASSET_ID,
    };

    const alarmCompositeModelRequest = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
    };

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmAssetRequest, alarmCompositeModelRequest],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current[0].status.isLoading).toBe(true);
      expect(alarmDataResults.current[1].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(alarmDataResults.current[0].status.isSuccess).toBe(true);
      expect(alarmDataResults.current[1].status.isSuccess).toBe(true);
    });
  });

  it('should return AlarmData with content for one alarm in an alarm composite model request', async () => {
    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({ compositeModels: [mockAlarmCompositeModel] })
    );

    const alarmCompositeModelRequest = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
    } satisfies AlarmCompositeModelRequest;

    const mockAlarmDataInternal = {
      ...mockAlarmDataDescribeAsset,
      request: alarmCompositeModelRequest,
      properties: mockAssetProperties,
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmCompositeModelRequest],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(mockAlarmDataInternal);
    });

    expect(describeAssetMock).toBeCalled();
    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should return AlarmData with content for one alarm in an alarm input property request', async () => {
    const mockProperties = [mockInputProperty];
    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({
        compositeModels: [mockAlarmCompositeModel],
        assetProperties: mockProperties,
      })
    );

    const alarmInputPropertyRequest = {
      assetId: MOCK_ASSET_ID,
      inputPropertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
    } satisfies AlarmInputPropertyRequest;

    const expectedAlarmData = {
      ...mockAlarmDataDescribeAsset,
      request: alarmInputPropertyRequest,
      properties: mockProperties,
    } satisfies AlarmDataInternal;

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

    const mockAlarmDataDescribeAsset2 = {
      ...mockAlarmDataDescribeAsset,
      compositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
      compositeModelName: MOCK_COMPOSITE_MODEL_NAME_2,
    };

    const alarmAssetRequest = {
      assetId: MOCK_ASSET_ID,
    } satisfies AlarmAssetRequest;

    const mockAlarmDataInternal = {
      ...mockAlarmDataDescribeAsset,
      request: alarmAssetRequest,
      properties: mockAssetProperties,
    } satisfies AlarmDataInternal;

    const mockAlarmDataInternal2 = {
      ...mockAlarmDataDescribeAsset2,
      request: alarmAssetRequest,
      properties: mockAssetProperties,
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmAssetRequest],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(2);
      expect(alarmDataResults.current[0]).toMatchObject(mockAlarmDataInternal);
      expect(alarmDataResults.current[1]).toMatchObject(mockAlarmDataInternal2);
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

    const alarmAssetModelRequest = {
      assetModelId: MOCK_ASSET_MODEL_ID,
    } satisfies AlarmAssetModelRequest;

    const mockAlarmDataDescribeAssetModel2 = {
      ...mockAlarmDataDescribeAssetModel,
      compositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
      compositeModelName: MOCK_COMPOSITE_MODEL_NAME_2,
    };

    const mockAlarmDataInternal = {
      ...mockAlarmDataDescribeAssetModel,
      request: alarmAssetModelRequest,
      properties: mockAssetModelProperties,
    } satisfies AlarmDataInternal;

    const mockAlarmDataInternal2 = {
      ...mockAlarmDataDescribeAssetModel2,
      request: alarmAssetModelRequest,
      properties: mockAssetModelProperties,
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmAssetModelRequest],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(2);
      expect(alarmDataResults.current[0]).toMatchObject(mockAlarmDataInternal);
      expect(alarmDataResults.current[1]).toMatchObject(mockAlarmDataInternal2);
    });

    expect(describeAssetMock).not.toBeCalled();
    expect(describeAssetModelMock).toBeCalled();
  });

  it('should return no AlarmData when there are no alarms on an asset', async () => {
    describeAssetMock.mockResolvedValue(mockDescribeAssetResponse({}));

    const alarmAssetRequest = {
      assetId: MOCK_ASSET_ID,
    } satisfies AlarmAssetRequest;

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

    const alarmAssetModelRequest = {
      assetModelId: MOCK_ASSET_MODEL_ID,
    } satisfies AlarmAssetModelRequest;

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

    const alarmCompositeModelRequest1 = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
    } satisfies AlarmCompositeModelRequest;

    const alarmCompositeModelRequest2 = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
    } satisfies AlarmCompositeModelRequest;

    const mockAlarmDataDescribeAsset2 = {
      ...mockAlarmDataDescribeAsset,
      compositeModelId: MOCK_COMPOSITE_MODEL_ID_2,
      compositeModelName: MOCK_COMPOSITE_MODEL_NAME_2,
    };

    const mockAlarmDataInternal1 = {
      ...mockAlarmDataDescribeAsset,
      request: alarmCompositeModelRequest1,
      properties: mockAssetProperties,
    } satisfies AlarmDataInternal;

    const mockAlarmDataInternal2 = {
      ...mockAlarmDataDescribeAsset2,
      request: alarmCompositeModelRequest2,
      properties: mockAssetProperties,
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmCompositeModelRequest1, alarmCompositeModelRequest2],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(2);
      expect(alarmDataResults.current[0]).toMatchObject(mockAlarmDataInternal1);
      expect(alarmDataResults.current[1]).toMatchObject(mockAlarmDataInternal2);
    });

    expect(describeAssetMock).toBeCalledTimes(1);
    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should return AlarmData with just request and status when query fails', async () => {
    describeAssetMock.mockRejectedValue('Failure calling DescribeAsset');

    const mockRequest = { assetId: MOCK_ASSET_ID };
    const expectedAlarmData = {
      assetId: MOCK_ASSET_ID,
      status: {
        isLoading: false,
        isRefetching: false,
        isSuccess: false,
        isError: true,
      },
      request: mockRequest,
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [mockRequest],
        retry: false,
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData);
    });

    expect(describeAssetMock).toBeCalledTimes(1);
  });
});
