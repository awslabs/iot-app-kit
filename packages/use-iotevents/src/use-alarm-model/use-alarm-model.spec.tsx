import { type DescribeAlarmModelCommandOutput, type IoTEventsClient } from '@aws-sdk/client-iot-events';

import { renderHook, waitFor } from '@testing-library/react';

import { useAlarmModel } from './use-alarm-model';
import { iotEventsKeys } from '../cache';
import { queryClient, wrapper } from '../helpers/test';

const alarmModelDescriptionStub: DescribeAlarmModelCommandOutput = {
  alarmModelName: 'AlarmModel Description Test Stub',
  alarmModelArn: 'arn:${Partition}:iotsitewise:${Region}:${Account}:alarmModel/${AlarmModelId}',
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(alarmModelDescriptionStub),
} as unknown as IoTEventsClient;

describe('useAlarmModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    expect(mockClient.send).not.toHaveBeenCalled();
    const { result } = renderHook(
      () => useAlarmModel({ client: mockClient, input: { alarmModelName: alarmModelDescriptionStub.alarmModelName } }),
      { wrapper }
    );

    expect(result.current.status).toBe('loading');
    expect(mockClient.send).toHaveBeenCalled();
    expect(result.current.data).toBe(undefined);

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(alarmModelDescriptionStub);
  });

  it('passes an abort signal to the client', () => {
    renderHook(
      () => useAlarmModel({ client: mockClient, input: { alarmModelName: alarmModelDescriptionStub.alarmModelName } }),
      {
        wrapper,
      }
    );
    expect(mockClient.send).toHaveBeenCalledWith(expect.anything(), {
      abortSignal: expect.objectContaining({ aborted: false }),
    });
  });

  it('does not send a request when input is not defined', async () => {
    const { result } = renderHook(() => useAlarmModel({ client: mockClient }), { wrapper });
    expect(mockClient.send).not.toHaveBeenCalled();
    expect(result.current.status).toBe('loading');
    const alarmModels = queryClient.getQueryData(iotEventsKeys.alarmModels());

    expect(alarmModels).toEqual(undefined);
  });

  it('caches data accessibly', async () => {
    const { result } = renderHook(
      () => useAlarmModel({ client: mockClient, input: { alarmModelName: alarmModelDescriptionStub.alarmModelName } }),
      {
        wrapper,
      }
    );

    const queryCache = queryClient.getQueryCache();

    expect(
      queryCache.find(iotEventsKeys.alarmModelDescription({ alarmModelName: alarmModelDescriptionStub.alarmModelName }))
        ?.state.data
    ).toBeUndefined();

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(
      queryCache.find(iotEventsKeys.alarmModelDescription({ alarmModelName: alarmModelDescriptionStub.alarmModelName }))
        ?.state.data
    ).toEqual(alarmModelDescriptionStub);
  });

  it('returns cached data with multiple instantiations of the same query', async () => {
    const { result: resultA } = renderHook(
      () => useAlarmModel({ client: mockClient, input: { alarmModelName: alarmModelDescriptionStub.alarmModelName } }),
      {
        wrapper,
      }
    );
    const { result: resultB } = renderHook(
      () => useAlarmModel({ client: mockClient, input: { alarmModelName: alarmModelDescriptionStub.alarmModelName } }),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(resultA.current.status).toBe('success'));
    await waitFor(() => expect(resultB.current.status).toBe('success'));

    expect(mockClient.send).toHaveBeenCalledOnce();
  });

  it('is configurable', async () => {
    const { result } = renderHook(
      () =>
        useAlarmModel({
          client: mockClient,
          input: { alarmModelName: alarmModelDescriptionStub.alarmModelName },
          options: {},
        }),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(alarmModelDescriptionStub);
  });
});
