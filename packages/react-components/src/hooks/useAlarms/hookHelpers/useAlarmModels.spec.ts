import { renderHook, waitFor } from '@testing-library/react';
import { queryClient } from '../../../queries';
import {
  describeAlarmModelMock,
  iotEventsClientMock,
  mockAlarmDataDescribeAsset,
  mockAlarmDataGetAssetPropertyValue,
  mockAlarmDataGetAssetPropertyValue2,
  mockAlarmModel,
  mockAlarmModel2,
} from '../../../testing/alarms';
import type { AlarmDataInternal } from '../types';
import { useAlarmModels } from './useAlarmModels';

describe('useAlarmModels', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('should inject alarm model into AlarmData for one alarm', async () => {
    describeAlarmModelMock.mockResolvedValue(mockAlarmModel);

    const expectedAlarmData = {
      ...mockAlarmDataGetAssetPropertyValue,
      models: [mockAlarmModel],
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmModels({
        iotEventsClient: iotEventsClientMock,
        alarmDataList: [mockAlarmDataGetAssetPropertyValue],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData);
    });

    expect(describeAlarmModelMock).toBeCalledTimes(1);
  });

  it('should not change AlarmData for external alarm without a source property', async () => {
    const externalAlarmData = {
      ...mockAlarmDataGetAssetPropertyValue,
      source: undefined,
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmModels({
        iotEventsClient: iotEventsClientMock,
        alarmDataList: [externalAlarmData],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(externalAlarmData);
    });

    expect(describeAlarmModelMock).toBeCalledTimes(0);
  });

  it('should not change AlarmData when alarm source property has no data', async () => {
    const { result: alarmDataResults } = renderHook(() =>
      useAlarmModels({
        iotEventsClient: iotEventsClientMock,
        alarmDataList: [mockAlarmDataDescribeAsset],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(
        mockAlarmDataDescribeAsset
      );
    });

    expect(describeAlarmModelMock).toBeCalledTimes(0);
  });

  it('should inject alarm model into AlarmData for multiple alarms', async () => {
    describeAlarmModelMock.mockResolvedValueOnce(mockAlarmModel);
    describeAlarmModelMock.mockResolvedValueOnce(mockAlarmModel2);

    const expectedAlarmData1 = {
      ...mockAlarmDataGetAssetPropertyValue,
      models: [mockAlarmModel],
    } satisfies AlarmDataInternal;

    const expectedAlarmData2 = {
      ...mockAlarmDataGetAssetPropertyValue2,
      models: [mockAlarmModel2],
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmModels({
        iotEventsClient: iotEventsClientMock,
        alarmDataList: [
          mockAlarmDataGetAssetPropertyValue,
          mockAlarmDataGetAssetPropertyValue2,
        ],
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(2);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData1);
      expect(alarmDataResults.current[1]).toMatchObject(expectedAlarmData2);
    });

    expect(describeAlarmModelMock).toBeCalledTimes(2);
  });

  it('should overwrite the status of AlarmData when queries fail', async () => {
    describeAlarmModelMock.mockRejectedValue(
      'Failure calling DescribeAlarmModel'
    );
    const expectedAlarmData = {
      ...mockAlarmDataGetAssetPropertyValue,
      status: {
        isLoading: false,
        isRefetching: false,
        isSuccess: false,
        isError: true,
      },
    } satisfies AlarmDataInternal;

    const { result: alarmDataResults } = renderHook(() =>
      useAlarmModels({
        iotEventsClient: iotEventsClientMock,
        alarmDataList: [mockAlarmDataGetAssetPropertyValue],
        retry: false,
      })
    );

    await waitFor(() => {
      expect(alarmDataResults.current.length).toBe(1);
      expect(alarmDataResults.current[0]).toMatchObject(expectedAlarmData);
    });

    expect(describeAlarmModelMock).toBeCalledTimes(1);
  });
});
