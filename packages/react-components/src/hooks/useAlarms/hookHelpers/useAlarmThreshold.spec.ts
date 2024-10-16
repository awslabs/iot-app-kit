import { act, renderHook, waitFor } from '@testing-library/react';
import {
  BatchGetAssetPropertyValueHistoryRequest,
  BatchGetAssetPropertyValueRequest,
} from '@aws-sdk/client-iotsitewise';
import {
  BatchGetAssetPropertyValue,
  BatchGetAssetPropertyValueHistory,
} from '@iot-app-kit/core';
import { queryClient } from '../../../queries';
import { useAlarmThreshold } from './useAlarmThreshold';
import {
  MOCK_ALARM_THRESHOLD_PROPERTY_ID,
  MOCK_ALARM_THRESHOLD_PROPERTY_ID_2,
  batchGetAssetPropertyValueHistoryMock,
  batchGetAssetPropertyValueMock,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAlarmModel,
  mockAlarmDataDescribeAlarmModel2,
  mockDoubleAssetPropertyValue,
} from '../../../testing/alarms';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../testing/alarms/mockStatuses';

const TEST_REFRESH_RATE = 5000;
const TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE = 6000;

const MOCK_THRESHOLD = 30;
const MOCK_THRESHOLD_2 = 15;

describe('useAlarmThreshold', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('fetches the latest threshold asset property when no viewport is provided.', async () => {
    const onUpdateAlarmThresholdData = jest.fn();
    batchGetAssetPropertyValueMock.mockImplementation(
      (request: BatchGetAssetPropertyValueRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValue: mockDoubleAssetPropertyValue(MOCK_THRESHOLD),
            },
            {
              entryId: request.entries![1].entryId,
              assetPropertyValue:
                mockDoubleAssetPropertyValue(MOCK_THRESHOLD_2),
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>;
      }
    );

    renderHook(() =>
      useAlarmThreshold({
        onUpdateAlarmThresholdData,
        fetchThresholds: true,
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          {
            assetId: mockAlarmDataDescribeAlarmModel.assetId,
            models: mockAlarmDataDescribeAlarmModel.models,
          },
          {
            assetId: mockAlarmDataDescribeAlarmModel2.assetId,
            models: mockAlarmDataDescribeAlarmModel2.models,
          },
        ],
        refreshRate: Infinity,
      })
    );

    await waitFor(() => {
      expect(onUpdateAlarmThresholdData).toBeCalledWith(
        expect.objectContaining({
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAlarmModel.assetId,
                propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID,
              },
              status: mockLoadingStatus,
            }),
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAlarmModel2.assetId,
                propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID_2,
              },
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(onUpdateAlarmThresholdData).toBeCalledWith(
        expect.objectContaining({
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [mockDoubleAssetPropertyValue(MOCK_THRESHOLD)],
              request: {
                assetId: mockAlarmDataDescribeAlarmModel.assetId,
                propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID,
              },
              status: mockSuccessStatus,
            }),
            expect.objectContaining({
              data: [mockDoubleAssetPropertyValue(MOCK_THRESHOLD_2)],
              request: {
                assetId: mockAlarmDataDescribeAlarmModel2.assetId,
                propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID_2,
              },
              status: mockSuccessStatus,
            }),
          ]),
        })
      );
    });

    expect(batchGetAssetPropertyValueHistoryMock).not.toHaveBeenCalled();

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledOnce();
  });

  it('fetches the latest threshold asset property within a viewport.', async () => {
    const onUpdateAlarmThresholdData = jest.fn();
    jest.useFakeTimers();

    const mockAssetProperty1 = mockDoubleAssetPropertyValue(
      MOCK_THRESHOLD,
      new Date()
    );

    const mockAssetProperty2 = mockDoubleAssetPropertyValue(
      MOCK_THRESHOLD_2,
      new Date()
    );

    batchGetAssetPropertyValueHistoryMock.mockImplementation(
      (request: BatchGetAssetPropertyValueHistoryRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValueHistory: [mockAssetProperty1],
            },
            {
              entryId: request.entries![1].entryId,
              assetPropertyValueHistory: [mockAssetProperty2],
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    renderHook(() =>
      useAlarmThreshold({
        onUpdateAlarmThresholdData,
        fetchThresholds: true,
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: { duration: '5m' },
        requests: [
          {
            assetId: mockAlarmDataDescribeAlarmModel.assetId,
            models: mockAlarmDataDescribeAlarmModel.models,
          },
          {
            assetId: mockAlarmDataDescribeAlarmModel2.assetId,
            models: mockAlarmDataDescribeAlarmModel2.models,
          },
        ],
        fetchOnlyLatest: true,
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    await waitFor(() => {
      expect(onUpdateAlarmThresholdData).toBeCalledWith(
        expect.objectContaining({
          viewport: { duration: '5m' },
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAlarmModel.assetId,
                propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID,
              },
              status: mockLoadingStatus,
            }),
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAlarmModel2.assetId,
                propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID_2,
              },
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(onUpdateAlarmThresholdData).toBeCalledWith(
        expect.objectContaining({
          viewport: { duration: '5m' },
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [mockAssetProperty1],
              request: {
                assetId: mockAlarmDataDescribeAlarmModel.assetId,
                propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID,
              },
              status: mockSuccessStatus,
            }),
            expect.objectContaining({
              data: [mockAssetProperty2],
              request: {
                assetId: mockAlarmDataDescribeAlarmModel2.assetId,
                propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID_2,
              },
              status: mockSuccessStatus,
            }),
          ]),
        })
      );
    });

    expect(batchGetAssetPropertyValueMock).not.toHaveBeenCalled();

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledOnce();

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('no queries run when hook disabled', async () => {
    const onUpdateAlarmThresholdData = jest.fn();
    renderHook(() =>
      useAlarmThreshold({
        onUpdateAlarmThresholdData,
        fetchThresholds: false,
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: { duration: '5m' },
        requests: [
          {
            assetId: mockAlarmDataDescribeAlarmModel.assetId,
            models: mockAlarmDataDescribeAlarmModel.models,
          },
          {
            assetId: mockAlarmDataDescribeAlarmModel2.assetId,
            models: mockAlarmDataDescribeAlarmModel2.models,
          },
        ],
        fetchOnlyLatest: true,
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    expect(batchGetAssetPropertyValueHistoryMock).not.toHaveBeenCalled();
    expect(batchGetAssetPropertyValueMock).not.toHaveBeenCalled();
    expect(onUpdateAlarmThresholdData).not.toHaveBeenCalled();
  });
});
