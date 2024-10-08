import { act, renderHook, waitFor } from '@testing-library/react';
import { queryClient } from '../../../queries';
import { useAlarmState } from './useAlarmState';
import {
  batchGetAssetPropertyValueHistoryMock,
  batchGetAssetPropertyValueMock,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAsset,
  mockAlarmDataDescribeAsset2,
  mockDefaultAlarmState,
  mockDefaultAlarmState2,
  mockStringAssetPropertyValue,
} from '../../../testing/alarms';
import {
  BatchGetAssetPropertyValueHistoryRequest,
  BatchGetAssetPropertyValueRequest,
} from '@aws-sdk/client-iotsitewise';
import {
  BatchGetAssetPropertyValue,
  BatchGetAssetPropertyValueHistory,
} from '@iot-app-kit/core';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../testing/alarms/mockStatuses';

const TEST_REFRESH_RATE = 5000;
const TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE = 6000;

describe('useAlarmState', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('fetches the latest asset property when no viewport is provided.', async () => {
    const onUpdateAlarmStateData = jest.fn();
    jest.useFakeTimers();

    batchGetAssetPropertyValueMock.mockImplementation(
      (request: BatchGetAssetPropertyValueRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValue: mockStringAssetPropertyValue(
                mockDefaultAlarmState
              ),
            },
            {
              entryId: request.entries![1].entryId,
              assetPropertyValue: mockStringAssetPropertyValue(
                mockDefaultAlarmState2
              ),
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>;
      }
    );

    renderHook(() =>
      useAlarmState({
        onUpdateAlarmStateData,
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          {
            assetId: mockAlarmDataDescribeAsset.assetId,
            state: mockAlarmDataDescribeAsset.state,
          },
          {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            state: mockAlarmDataDescribeAsset2.state,
          },
        ],
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    await waitFor(() => {
      expect(onUpdateAlarmStateData).toBeCalledWith(
        expect.objectContaining({
          viewport: undefined,
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.state.property.id,
              },
              status: mockLoadingStatus,
            }),
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAsset2.assetId,
                propertyId: mockAlarmDataDescribeAsset2.state.property.id,
              },
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(onUpdateAlarmStateData).toBeCalledWith(
        expect.objectContaining({
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [mockStringAssetPropertyValue(mockDefaultAlarmState)],
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.state.property.id,
              },
              status: mockSuccessStatus,
            }),
            expect.objectContaining({
              data: [mockStringAssetPropertyValue(mockDefaultAlarmState2)],
              request: {
                assetId: mockAlarmDataDescribeAsset2.assetId,
                propertyId: mockAlarmDataDescribeAsset2.state.property.id,
              },
              status: mockSuccessStatus,
            }),
          ]),
        })
      );
    });

    expect(batchGetAssetPropertyValueHistoryMock).not.toHaveBeenCalled();

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledOnce();

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('fetches the latest asset property within a viewport.', async () => {
    const onUpdateAlarmStateData = jest.fn();
    jest.useFakeTimers();

    const mockAssetProperty1 = mockStringAssetPropertyValue(
      mockDefaultAlarmState,
      new Date()
    );
    const mockAssetProperty2 = mockStringAssetPropertyValue(
      mockDefaultAlarmState2,
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
      useAlarmState({
        onUpdateAlarmStateData,
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: { duration: '5m' },
        requests: [
          {
            assetId: mockAlarmDataDescribeAsset.assetId,
            state: mockAlarmDataDescribeAsset.state,
          },
          {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            state: mockAlarmDataDescribeAsset2.state,
          },
        ],
        fetchOnlyLatest: true,
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    await waitFor(() => {
      expect(onUpdateAlarmStateData).toBeCalledWith(
        expect.objectContaining({
          viewport: { duration: '5m' },
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.state.property.id,
              },
              status: mockLoadingStatus,
            }),
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAsset2.assetId,
                propertyId: mockAlarmDataDescribeAsset2.state.property.id,
              },
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(onUpdateAlarmStateData).toBeCalledWith(
        expect.objectContaining({
          viewport: { duration: '5m' },
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [mockAssetProperty1],
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.state.property.id,
              },
              status: mockSuccessStatus,
            }),
            expect.objectContaining({
              data: [mockAssetProperty2],
              request: {
                assetId: mockAlarmDataDescribeAsset2.assetId,
                propertyId: mockAlarmDataDescribeAsset2.state.property.id,
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
});
