import { act, renderHook, waitFor } from '@testing-library/react';
import { queryClient } from '../../../queries';
import { useAlarmState, UseAlarmStateOptions } from './useAlarmState';
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
import { sub } from 'date-fns';
import { cloneDeep } from 'lodash';

const TEST_REFRESH_RATE = 5000;
const TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE = 6000;

describe('useAlarmState', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('fetches the latest asset property when no viewport is provided.', async () => {
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

    const { result } = renderHook(() =>
      useAlarmState({
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarms: [
          cloneDeep(mockAlarmDataDescribeAsset),
          cloneDeep(mockAlarmDataDescribeAsset2),
        ],
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    await waitFor(() => {
      expect(result.current[0].status.isLoading).toBe(true);
      expect(result.current[1].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current[0].status.isSuccess).toBe(true);
      expect(result.current[1].status.isSuccess).toBe(true);
    });

    expect(batchGetAssetPropertyValueHistoryMock).not.toHaveBeenCalled();

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledOnce();
    expect(result.current[0].state?.data).toEqual([
      mockStringAssetPropertyValue(mockDefaultAlarmState),
    ]);
    expect(result.current[1].state?.data).toEqual([
      mockStringAssetPropertyValue(mockDefaultAlarmState2),
    ]);

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('fetches the latest asset property within a viewport.', async () => {
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

    const { result } = renderHook(() =>
      useAlarmState({
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: { duration: '5m' },
        alarms: [
          cloneDeep(mockAlarmDataDescribeAsset),
          cloneDeep(mockAlarmDataDescribeAsset2),
        ],
        fetchOnlyLatest: true,
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    await waitFor(() => {
      expect(result.current[0].status.isLoading).toBe(true);
      expect(result.current[1].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current[0].status.isSuccess).toBe(true);
      expect(result.current[1].status.isSuccess).toBe(true);
    });

    expect(batchGetAssetPropertyValueMock).not.toHaveBeenCalled();

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledOnce();
    expect(result.current[0].state?.data).toEqual([mockAssetProperty1]);
    expect(result.current[1].state?.data).toEqual([mockAssetProperty2]);

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('fetches the historical asset properties within an absolute viewport.', async () => {
    const anchorDate = new Date(1726689631845);
    const dates = [
      anchorDate,
      sub(anchorDate, { minutes: 5 }),
      sub(anchorDate, { minutes: 10 }),
      sub(anchorDate, { hours: 1 }),
      sub(anchorDate, { hours: 1, minutes: 5 }),
      sub(anchorDate, { hours: 1, minutes: 10 }),
    ];

    const mockAssetProperty1Data = dates.map((date) =>
      mockStringAssetPropertyValue(mockDefaultAlarmState, date)
    );
    const mockAssetProperty2Data = dates.map((date) =>
      mockStringAssetPropertyValue(mockDefaultAlarmState2, date)
    );

    batchGetAssetPropertyValueHistoryMock.mockImplementation(
      (request: BatchGetAssetPropertyValueHistoryRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValueHistory: mockAssetProperty1Data,
            },
            {
              entryId: request.entries![1].entryId,
              assetPropertyValueHistory: mockAssetProperty2Data,
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    const { result, rerender } = renderHook(
      ({ viewport }: Pick<UseAlarmStateOptions, 'viewport'> = {}) =>
        useAlarmState({
          iotSiteWiseClient: iotSiteWiseClientMock,
          viewport: viewport ?? {
            start: sub(anchorDate, { hours: 2 }),
            end: anchorDate,
          },
          alarms: [
            cloneDeep(mockAlarmDataDescribeAsset),
            cloneDeep(mockAlarmDataDescribeAsset2),
          ],
          refreshRate: TEST_REFRESH_RATE,
        })
    );

    await waitFor(() => {
      expect(result.current[0].status.isLoading).toBe(true);
      expect(result.current[1].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current[0].status.isSuccess).toBe(true);
      expect(result.current[1].status.isSuccess).toBe(true);
    });

    expect(batchGetAssetPropertyValueMock).not.toHaveBeenCalled();

    expect(batchGetAssetPropertyValueHistoryMock).toBeCalledTimes(2);
    expect(result.current[0].state?.data).toEqual(
      mockAssetProperty1Data.reverse()
    );
    expect(result.current[1].state?.data).toEqual(
      mockAssetProperty2Data.reverse()
    );

    rerender({
      viewport: { start: sub(anchorDate, { minutes: 30 }), end: anchorDate },
    });

    await waitFor(() => {
      expect(result.current[0].status.isLoading).toBe(true);
      expect(result.current[1].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current[0].status.isSuccess).toBe(true);
      expect(result.current[1].status.isSuccess).toBe(true);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(4);

    expect(result.current[0].state?.data).toEqual(mockAssetProperty1Data);
    expect(result.current[1].state?.data).toEqual(mockAssetProperty2Data);
  });

  it('fetches the historical asset properties within a live viewport.', async () => {
    jest.useFakeTimers();

    const anchorDate = new Date();
    const dates = [
      anchorDate,
      sub(anchorDate, { minutes: 5 }),
      sub(anchorDate, { minutes: 10 }),
      sub(anchorDate, { hours: 1 }),
      sub(anchorDate, { hours: 1, minutes: 5 }),
      sub(anchorDate, { hours: 1, minutes: 10 }),
    ];

    const mockAssetProperty1Data = dates.map((date) =>
      mockStringAssetPropertyValue(mockDefaultAlarmState, date)
    );
    const mockAssetProperty2Data = dates.map((date) =>
      mockStringAssetPropertyValue(mockDefaultAlarmState2, date)
    );

    batchGetAssetPropertyValueHistoryMock.mockImplementation(
      (request: BatchGetAssetPropertyValueHistoryRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValueHistory: mockAssetProperty1Data,
            },
            {
              entryId: request.entries![1].entryId,
              assetPropertyValueHistory: mockAssetProperty2Data,
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    const { result } = renderHook(() =>
      useAlarmState({
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: { duration: '2hr' },
        alarms: [
          cloneDeep(mockAlarmDataDescribeAsset),
          cloneDeep(mockAlarmDataDescribeAsset2),
        ],
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    await waitFor(() => {
      expect(result.current[0].status.isLoading).toBe(true);
      expect(result.current[1].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current[0].status.isSuccess).toBe(true);
      expect(result.current[1].status.isSuccess).toBe(true);
    });

    expect(batchGetAssetPropertyValueMock).not.toHaveBeenCalled();

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);
    expect(result.current[0].state?.data).toEqual(
      mockAssetProperty1Data.reverse()
    );
    expect(result.current[1].state?.data).toEqual(
      mockAssetProperty2Data.reverse()
    );

    batchGetAssetPropertyValueHistoryMock.mockImplementation(
      (request: BatchGetAssetPropertyValueHistoryRequest) => {
        return {
          errorEntries: [],
          skippedEntries: [],
          successEntries: [
            {
              entryId: request.entries![0].entryId,
              assetPropertyValueHistory: mockAssetProperty1Data.slice(5),
            },
            {
              entryId: request.entries![1].entryId,
              assetPropertyValueHistory: mockAssetProperty2Data.slice(5),
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(4);

    jest.useRealTimers();
  });

  it('is referentially equal if there is no new data.', async () => {
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
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>;
      }
    );

    const alarm = cloneDeep(mockAlarmDataDescribeAsset);

    const { result } = renderHook(() =>
      useAlarmState({
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarms: [alarm],
        refreshRate: TEST_REFRESH_RATE,
      })
    );

    await waitFor(() => {
      expect(result.current[0].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current[0].status.isSuccess).toBe(true);
    });

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledOnce();
    expect(result.current[0].state?.data).toEqual([
      mockStringAssetPropertyValue(mockDefaultAlarmState),
    ]);

    const referenceToData = result.current[0].state?.data;

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledTimes(2);

    expect(result.current[0].state?.data).toBe(referenceToData);

    jest.useRealTimers();
  });

  it('is referentially equal if there is no new data within a viewport.', async () => {
    jest.useFakeTimers();

    const now = new Date();

    const mockAssetProperty1 = mockStringAssetPropertyValue(
      mockDefaultAlarmState,
      sub(now, { minutes: 2 })
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
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValueHistory>>;
      }
    );

    const alarm = cloneDeep(mockAlarmDataDescribeAsset);

    const { result, rerender } = renderHook(
      ({ viewport }: Pick<UseAlarmStateOptions, 'viewport'> = {}) =>
        useAlarmState({
          iotSiteWiseClient: iotSiteWiseClientMock,
          viewport: viewport ?? { duration: '5m' },
          alarms: [alarm],
          fetchOnlyLatest: true,
          refreshRate: TEST_REFRESH_RATE,
        })
    );

    await waitFor(() => {
      expect(result.current[0].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current[0].status.isSuccess).toBe(true);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledOnce();
    expect(result.current[0].state?.data).toEqual([mockAssetProperty1]);

    const referenceToData = result.current[0].state?.data;

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

    expect(result.current[0].state?.data).toBe(referenceToData);

    rerender({
      viewport: {
        start: sub(now, { minutes: 6 }),
        end: sub(now, { minutes: 1 }),
      },
    });

    await waitFor(() => {
      expect(result.current[0].status.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current[0].status.isSuccess).toBe(true);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(3);

    expect(result.current[0].state?.data).toBe(referenceToData);

    jest.useRealTimers();
  });
});
