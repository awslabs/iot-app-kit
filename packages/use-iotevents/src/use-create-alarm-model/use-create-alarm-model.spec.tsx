import { type CreateAlarmModelCommandOutput, type IoTEventsClient } from '@aws-sdk/client-iot-events';

import { renderHook } from '@testing-library/react';

import { useCreateAlarmModel } from './index';
import { queryClient, wrapper } from '../helpers/test';

const createAlarmModelOutputStub: CreateAlarmModelCommandOutput = {
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(createAlarmModelOutputStub),
} as unknown as IoTEventsClient;

describe('useCreateAlarmModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useCreateAlarmModel({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ alarmModelName: 'ALARM MODEL TEST STUB', roleArn: '', alarmRule: {} });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useCreateAlarmModel({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ alarmModelName: 'ALARM MODEL TEST STUB', roleArn: '', alarmRule: {} });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
