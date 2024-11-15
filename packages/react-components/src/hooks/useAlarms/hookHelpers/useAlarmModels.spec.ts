import { renderHook, waitFor } from '@testing-library/react';
import { queryClient } from '../../../queries';
import {
  MOCK_ALARM_MODEL_NAME,
  MOCK_ALARM_MODEL_NAME_2,
  describeAlarmModelMock,
  iotEventsClientMock,
  mockAlarmDataGetAssetPropertyValue,
  mockAlarmDataGetAssetPropertyValue2,
  mockAlarmModel,
  mockAlarmModel2,
} from '../../../testing/alarms';
import { useAlarmModels } from './useAlarmModels';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../testing/alarms/mockStatuses';

describe('useAlarmModels', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('correctly calls onSummarizeAlarmModels', async () => {
    const onSummarizeAlarmModels = jest.fn();

    describeAlarmModelMock.mockResolvedValueOnce(mockAlarmModel);
    describeAlarmModelMock.mockResolvedValueOnce(mockAlarmModel2);

    renderHook(() =>
      useAlarmModels({
        iotEventsClient: iotEventsClientMock,
        requests: [
          {
            source: mockAlarmDataGetAssetPropertyValue.source,
          },
          {
            source: mockAlarmDataGetAssetPropertyValue2.source,
          },
        ],
        onSummarizeAlarmModels,
      })
    );

    await waitFor(() => {
      expect(onSummarizeAlarmModels).toBeCalledWith(
        expect.objectContaining({
          alarmModelSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: undefined,
              request: {
                alarmModelName: MOCK_ALARM_MODEL_NAME,
              },
              status: mockLoadingStatus,
            }),
            expect.objectContaining({
              data: undefined,
              request: {
                alarmModelName: MOCK_ALARM_MODEL_NAME_2,
              },
              status: mockLoadingStatus,
            }),
          ]),
        })
      );
    });

    await waitFor(() => {
      expect(onSummarizeAlarmModels).toBeCalledWith(
        expect.objectContaining({
          alarmModelSummaries: expect.arrayContaining([
            expect.objectContaining({
              data: mockAlarmModel,
              request: {
                alarmModelName: MOCK_ALARM_MODEL_NAME,
              },
              status: mockSuccessStatus,
            }),
            expect.objectContaining({
              data: mockAlarmModel2,
              request: {
                alarmModelName: MOCK_ALARM_MODEL_NAME_2,
              },
              status: mockSuccessStatus,
            }),
          ]),
        })
      );
    });
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
