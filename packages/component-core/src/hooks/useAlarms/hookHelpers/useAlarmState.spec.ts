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
  mockDefaultAlarmState3,
  mockStringAssetPropertyValue,
} from '../../../testing/alarms';
import {
  type BatchGetAssetPropertyValueHistoryRequest,
  type BatchGetAssetPropertyValueRequest,
} from '@aws-sdk/client-iotsitewise';
import {
  type BatchGetAssetPropertyValue,
  type BatchGetAssetPropertyValueHistory,
  type Viewport,
} from '@iot-app-kit/core';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../testing/alarms/mockStatuses';

const TEST_REFRESH_RATE = 5000;
const TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE = 6000;
const TEN_MINUTES_IN_MILLI = 10 * 60 * 1000;

const now = new Date();

const mockAssetProperty1 = mockStringAssetPropertyValue(
  mockDefaultAlarmState,
  now
);
const mockAssetProperty2 = mockStringAssetPropertyValue(
  mockDefaultAlarmState2,
  now
);

const VIEWPORT = { duration: '5m' };

const onUpdateAlarmStateData = vi.fn();

const waitForLoading = async (viewport?: Viewport) => {
  await waitFor(() => {
    expect(onUpdateAlarmStateData).toBeCalledWith(
      expect.objectContaining({
        viewport,
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
};

describe('useAlarmState', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('fetches the latest asset property when no viewport is provided.', async () => {
    vi.useFakeTimers();

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

    await waitForLoading();

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
      vi.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('fetches the latest asset property within a viewport.', async () => {
    vi.useFakeTimers();

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
        viewport: VIEWPORT,
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

    await waitForLoading(VIEWPORT);

    await waitFor(() => {
      expect(onUpdateAlarmStateData).toBeCalledWith(
        expect.objectContaining({
          viewport: VIEWPORT,
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
      vi.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('fetches values within a viewport and one value before the start', async () => {
    vi.useFakeTimers();

    const mockAssetPropertyBeforeStart = mockStringAssetPropertyValue(
      mockDefaultAlarmState3,
      new Date(now.getTime() - TEN_MINUTES_IN_MILLI)
    );

    /**
     * We create a separate batcher based on the maxResults we want to see in each query
     * The first 2 queries in useAlarmState request 1 datapoint, and the second 2 request
     * any number (Infinity). So we will mock two expected batcher responses.
     */

    // First batch will be for MOST_RECENT_BEFORE_START/END
    batchGetAssetPropertyValueHistoryMock.mockImplementationOnce(
      (request: BatchGetAssetPropertyValueHistoryRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            // MOST_RECENT_BEFORE_END
            {
              entryId: request.entries![0].entryId,
              assetPropertyValueHistory: [mockAssetProperty1],
            },
            // MOST_RECENT_BEFORE_START
            {
              entryId: request.entries![1].entryId,
              assetPropertyValueHistory: [mockAssetPropertyBeforeStart],
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    // Second batch will be for HISTORICAL/LIVE REFRESH
    batchGetAssetPropertyValueHistoryMock.mockImplementationOnce(
      (request: BatchGetAssetPropertyValueHistoryRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            // HISTORICAL
            {
              entryId: request.entries![0].entryId,
              assetPropertyValueHistory: [mockAssetProperty1],
            },
            // LIVE REFRESH
            {
              entryId: request.entries![1].entryId,
              assetPropertyValueHistory: [mockAssetProperty1],
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    renderHook(() =>
      useAlarmState({
        onUpdateAlarmStateData,
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: VIEWPORT,
        requests: [
          {
            assetId: mockAlarmDataDescribeAsset.assetId,
            state: mockAlarmDataDescribeAsset.state,
          },
        ],
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    await waitFor(() => {
      expect(onUpdateAlarmStateData).toBeCalledWith(
        expect.objectContaining({
          viewport: VIEWPORT,
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: [],
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.state.property.id,
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
          viewport: VIEWPORT,
          assetPropertyValueSummaries: expect.arrayContaining([
            expect.objectContaining({
              // Not deduped yet
              data: [
                mockAssetProperty1,
                mockAssetPropertyBeforeStart,
                mockAssetProperty1,
                mockAssetProperty1,
              ],
              request: {
                assetId: mockAlarmDataDescribeAsset.assetId,
                propertyId: mockAlarmDataDescribeAsset.state.property.id,
              },
              status: mockSuccessStatus,
            }),
          ]),
        })
      );
    });

    expect(batchGetAssetPropertyValueMock).not.toHaveBeenCalled();

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

    /**
     * First batch on refresh will be for MOST_RECENT_BEFORE_END
     * MOST_RECENT_BEFORE_START is only called once
     */
    batchGetAssetPropertyValueHistoryMock.mockImplementationOnce(
      (request: BatchGetAssetPropertyValueHistoryRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            // MOST_RECENT_BEFORE_END
            {
              entryId: request.entries![0].entryId,
              assetPropertyValueHistory: [mockAssetProperty1],
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    /**
     * Second batch on refresh will be for LIVE REFRESH
     * HISTORICAL is only called once
     */
    batchGetAssetPropertyValueHistoryMock.mockImplementationOnce(
      (request: BatchGetAssetPropertyValueHistoryRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            // LIVE REFRESH
            {
              entryId: request.entries![0].entryId,
              assetPropertyValueHistory: [mockAssetProperty1],
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    act(() => {
      vi.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(4);

    vi.useRealTimers();
  });
});
