import { act, renderHook, waitFor } from '@testing-library/react';
import {
  BatchGetAssetPropertyValueHistoryRequest,
  BatchGetAssetPropertyValueRequest,
} from '@aws-sdk/client-iotsitewise';
import {
  BatchGetAssetPropertyValue,
  BatchGetAssetPropertyValueHistory,
  Viewport,
} from '@iot-app-kit/core';
import { sub } from 'date-fns';
import { cloneDeep } from 'lodash';
import { queryClient } from '../../../queries';
import { useAlarmThreshold } from './useAlarmThreshold';
import {
  batchGetAssetPropertyValueHistoryMock,
  batchGetAssetPropertyValueMock,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAlarmModel,
  mockAlarmDataDescribeAlarmModel2,
  mockAlarmModel,
  mockDoubleAssetPropertyValue,
} from '../../../testing/alarms';
import type { AlarmData } from '../types';

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

    const { result } = renderHook(() =>
      useAlarmThreshold({
        enabled: true,
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarms: [
          cloneDeep(mockAlarmDataDescribeAlarmModel),
          cloneDeep(mockAlarmDataDescribeAlarmModel2),
        ],
        refreshRate: Infinity,
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
    expect(result.current[0].thresholds).toEqual([
      mockDoubleAssetPropertyValue(MOCK_THRESHOLD),
    ]);
    expect(result.current[1].thresholds).toEqual([
      mockDoubleAssetPropertyValue(MOCK_THRESHOLD_2),
    ]);
  });

  it('fetches the latest threshold asset property within a viewport.', async () => {
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

    const { result } = renderHook(() =>
      useAlarmThreshold({
        enabled: true,
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: { duration: '5m' },
        alarms: [
          cloneDeep(mockAlarmDataDescribeAlarmModel),
          cloneDeep(mockAlarmDataDescribeAlarmModel2),
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
    expect(result.current[0].thresholds).toEqual([mockAssetProperty1]);
    expect(result.current[1].thresholds).toEqual([mockAssetProperty2]);

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('fetches the historical threshold asset properties within an absolute viewport.', async () => {
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
      mockDoubleAssetPropertyValue(MOCK_THRESHOLD, date)
    );
    const mockAssetProperty2Data = dates.map((date) =>
      mockDoubleAssetPropertyValue(MOCK_THRESHOLD_2, date)
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
      ({ viewport }: { viewport?: Viewport } = {}) =>
        useAlarmThreshold({
          enabled: true,
          iotSiteWiseClient: iotSiteWiseClientMock,
          viewport: viewport ?? {
            start: sub(anchorDate, { hours: 2 }),
            end: anchorDate,
          },
          alarms: [
            cloneDeep(mockAlarmDataDescribeAlarmModel),
            cloneDeep(mockAlarmDataDescribeAlarmModel2),
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

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledOnce();
    expect(result.current[0].thresholds).toEqual(
      mockAssetProperty1Data.reverse()
    );
    expect(result.current[1].thresholds).toEqual(
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

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

    expect(result.current[0].thresholds).toEqual(
      mockAssetProperty1Data.slice(2)
    );
    expect(result.current[1].thresholds).toEqual(
      mockAssetProperty2Data.slice(2)
    );
  });

  it('fetches the historical threshold asset properties within a live viewport.', async () => {
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
      mockDoubleAssetPropertyValue(MOCK_THRESHOLD, date)
    );
    const mockAssetProperty2Data = dates.map((date) =>
      mockDoubleAssetPropertyValue(MOCK_THRESHOLD_2, date)
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
      useAlarmThreshold({
        enabled: true,
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: { duration: '2hr' },
        alarms: [
          cloneDeep(mockAlarmDataDescribeAlarmModel),
          cloneDeep(mockAlarmDataDescribeAlarmModel2),
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

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledOnce();
    expect(result.current[0].thresholds).toEqual(
      mockAssetProperty1Data.reverse()
    );
    expect(result.current[1].thresholds).toEqual(
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

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

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
              assetPropertyValue: mockDoubleAssetPropertyValue(MOCK_THRESHOLD),
            },
          ],
        } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>;
      }
    );

    const alarm = cloneDeep(mockAlarmDataDescribeAlarmModel);

    const { result } = renderHook(() =>
      useAlarmThreshold({
        enabled: true,
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
    expect(result.current[0].thresholds).toEqual([
      mockDoubleAssetPropertyValue(MOCK_THRESHOLD),
    ]);

    const referenceToData = result.current[0].thresholds;

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueMock).toHaveBeenCalledTimes(2);

    expect(result.current[0].thresholds).toBe(referenceToData);

    jest.useRealTimers();
  });

  it('is referentially equal if there is no new data within a viewport.', async () => {
    jest.useFakeTimers();

    const now = new Date();

    const mockAssetProperty1 = mockDoubleAssetPropertyValue(
      MOCK_THRESHOLD,
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

    const alarm = cloneDeep(mockAlarmDataDescribeAlarmModel);

    const { result, rerender } = renderHook(
      ({ viewport }: { viewport?: Viewport } = {}) =>
        useAlarmThreshold({
          enabled: true,
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
    expect(result.current[0].thresholds).toEqual([mockAssetProperty1]);

    const referenceToData = result.current[0].thresholds;

    act(() => {
      jest.advanceTimersByTime(TEST_ADVANCE_TIMERS_PAST_REFRESH_RATE);
    });

    expect(batchGetAssetPropertyValueHistoryMock).toHaveBeenCalledTimes(2);

    expect(result.current[0].thresholds).toBe(referenceToData);

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

    expect(result.current[0].thresholds).toBe(referenceToData);

    jest.useRealTimers();
  });

  it('no queries run when hook disabled', async () => {
    const { result } = renderHook(() =>
      useAlarmThreshold({
        enabled: false,
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarms: [cloneDeep(mockAlarmDataDescribeAlarmModel)],
        refreshRate: Infinity,
      })
    );

    expect(result.current[0]).toMatchObject(mockAlarmDataDescribeAlarmModel);

    expect(batchGetAssetPropertyValueHistoryMock).not.toHaveBeenCalled();
    expect(batchGetAssetPropertyValueMock).not.toHaveBeenCalled();
  });

  it('fetches the static threshold value from alarm models', async () => {
    const mockAlarmDataAlarmModelWithStaticThreshold = {
      ...mockAlarmDataDescribeAlarmModel,
      models: [
        {
          ...mockAlarmModel,
          alarmRule: {
            simpleRule: {
              ...mockAlarmModel.alarmRule.simpleRule,
              threshold: `${MOCK_THRESHOLD}`,
            },
          },
        },
      ],
    } satisfies AlarmData;

    const mockAlarmDataAlarmModelWithStaticThreshold2 = {
      ...mockAlarmDataDescribeAlarmModel,
      models: [
        {
          ...mockAlarmModel,
          alarmRule: {
            simpleRule: {
              ...mockAlarmModel.alarmRule.simpleRule,
              threshold: `${MOCK_THRESHOLD_2}`,
            },
          },
        },
      ],
    } satisfies AlarmData;

    const { result } = renderHook(() =>
      useAlarmThreshold({
        enabled: true,
        iotSiteWiseClient: iotSiteWiseClientMock,
        alarms: [
          cloneDeep(mockAlarmDataAlarmModelWithStaticThreshold),
          cloneDeep(mockAlarmDataAlarmModelWithStaticThreshold2),
        ],
      })
    );

    expect(
      result.current[0].thresholds &&
        result.current[0].thresholds[0].value?.doubleValue
    ).toEqual(MOCK_THRESHOLD);
    expect(
      result.current[1].thresholds &&
        result.current[1].thresholds[0].value?.doubleValue
    ).toEqual(MOCK_THRESHOLD_2);

    expect(batchGetAssetPropertyValueHistoryMock).not.toHaveBeenCalled();
    expect(batchGetAssetPropertyValueMock).not.toHaveBeenCalled();
  });
});
