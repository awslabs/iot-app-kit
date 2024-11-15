import { renderHook, waitFor } from '@testing-library/react';
import { useAlarmAssets } from './useAlarmAssets';
import type {
  AlarmCompositeModelRequest,
  AlarmInputPropertyRequest,
} from '../types';
import { queryClient } from '../../../queries';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ASSET_ID,
  MOCK_COMPOSITE_MODEL_ID,
  describeAssetMock,
  describeAssetModelMock,
  iotSiteWiseClientMock,
  mockAlarmCompositeModel,
  mockInputProperty,
} from '../../../testing/alarms';
import { mockDescribeAssetResponse } from '../../../testing/alarms/mockDescribeAsset';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../testing/alarms/mockStatuses';

describe('useAlarmAssets', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('should have the correct status', async () => {
    const onSummarizeAlarmsMock = jest.fn();

    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({ compositeModels: [mockAlarmCompositeModel] })
    );

    const alarmAssetRequest = {
      assetId: MOCK_ASSET_ID,
    };

    const alarmCompositeModelRequest = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
    } satisfies AlarmCompositeModelRequest;

    const mockAlarmDataInternal = {
      ...mockAlarmDataDescribeAsset,
      request: alarmCompositeModelRequest,
      properties: mockAssetProperties,
    } satisfies AlarmDataInternal;

    renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmAssetRequest, alarmCompositeModelRequest],
        onSummarizeAlarms: onSummarizeAlarmsMock,
      })
    );

    await waitFor(() => {
      expect(onSummarizeAlarmsMock).toBeCalledWith(
        expect.objectContaining({
          assetSummaries: expect.arrayContaining([
            expect.objectContaining({
              request: alarmAssetRequest,
              status: mockLoadingStatus,
            }),
            expect.objectContaining({
              request: alarmCompositeModelRequest,
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(onSummarizeAlarmsMock).toBeCalledWith(
        expect.objectContaining({
          assetSummaries: expect.arrayContaining([
            expect.objectContaining({
              request: alarmAssetRequest,
              status: mockSuccessStatus,
            }),
            expect.objectContaining({
              request: alarmCompositeModelRequest,
              status: mockSuccessStatus,
            }),
          ]),
        })
      );
    });
  });

  it('should return AlarmData with content for one alarm in an alarm composite model request', async () => {
    const onSummarizeAlarmsMock = jest.fn();

    describeAssetMock.mockResolvedValue(
      mockDescribeAssetResponse({ compositeModels: [mockAlarmCompositeModel] })
    );

    const alarmCompositeModelRequest = {
      assetId: MOCK_ASSET_ID,
      assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
    } satisfies AlarmCompositeModelRequest;

    renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmCompositeModelRequest],
        onSummarizeAlarms: onSummarizeAlarmsMock,
      })
    );

    await waitFor(() => {
      expect(onSummarizeAlarmsMock).toBeCalledWith(
        expect.objectContaining({
          assetSummaries: expect.arrayContaining([
            expect.objectContaining({
              request: alarmCompositeModelRequest,
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    expect(describeAssetMock).toBeCalled();
    expect(describeAssetModelMock).not.toBeCalled();
  });

  it('should return AlarmData with content for one alarm in an alarm input property request', async () => {
    const onSummarizeAlarmsMock = jest.fn();

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

    renderHook(() =>
      useAlarmAssets({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [alarmInputPropertyRequest],
        onSummarizeAlarms: onSummarizeAlarmsMock,
      })
    );

    await waitFor(() => {
      expect(onSummarizeAlarmsMock).toBeCalledWith(
        expect.objectContaining({
          assetSummaries: expect.arrayContaining([
            expect.objectContaining({
              request: alarmInputPropertyRequest,
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    expect(describeAssetMock).toBeCalled();
    expect(describeAssetModelMock).not.toBeCalled();
  });
});
