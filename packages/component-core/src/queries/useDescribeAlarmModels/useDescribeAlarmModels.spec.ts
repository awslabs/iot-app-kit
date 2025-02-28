import { renderHook, waitFor } from '@testing-library/react';
import { useDescribeAlarmModels } from './useDescribeAlarmModels';
import { queryClient } from '../queryClient';
import {
  MOCK_ALARM_MODEL_NAME,
  MOCK_ALARM_MODEL_NAME_2,
  describeAlarmModelMock,
  iotEventsClientMock,
} from '../../testing/alarms';

describe('useDescribeAlarmModels', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should call DescribeAlarmModel in successful queries when calling useDescribeAlarmModels', async () => {
    describeAlarmModelMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAlarmModels({
        iotEventsClient: iotEventsClientMock,
        requests: [{ alarmModelName: MOCK_ALARM_MODEL_NAME }],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(describeAlarmModelMock).toBeCalled();
  });

  it('should not call DescribeAlarmModel when no alarmModelNames passed into useDescribeAlarmModels', async () => {
    describeAlarmModelMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAlarmModels({
        iotEventsClient: iotEventsClientMock,
        requests: [],
      })
    );

    await waitFor(() => expect(queriesResult.current.length).toBe(0));

    expect(describeAlarmModelMock).not.toBeCalled();
  });

  it('should disable query when undefined alarmModelName passed into useDescribeAlarmModels', async () => {
    describeAlarmModelMock.mockResolvedValue({});
    const { result: queriesResult } = renderHook(() =>
      useDescribeAlarmModels({
        iotEventsClient: iotEventsClientMock,
        requests: [
          { alarmModelName: MOCK_ALARM_MODEL_NAME },
          undefined,
          { alarmModelName: MOCK_ALARM_MODEL_NAME_2 },
        ],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));
    await waitFor(() => {
      expect(queriesResult.current[1].fetchStatus).toBe('idle');
      expect(queriesResult.current[1].isPending).toBe(true);
      expect(queriesResult.current[1].isLoading).toBe(false);
    });
    await waitFor(() => expect(queriesResult.current[2].isSuccess).toBe(true));

    expect(describeAlarmModelMock).toBeCalledTimes(2);
  });

  it('should handle DescribeAlarmModel failure', async () => {
    describeAlarmModelMock.mockRejectedValue(
      new Error('DescribeAlarmModel failed')
    );
    const { result: queriesResult } = renderHook(() =>
      useDescribeAlarmModels({
        iotEventsClient: iotEventsClientMock,
        requests: [{ alarmModelName: MOCK_ALARM_MODEL_NAME }],
        retry: false,
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isError).toBe(true));
  });
});
