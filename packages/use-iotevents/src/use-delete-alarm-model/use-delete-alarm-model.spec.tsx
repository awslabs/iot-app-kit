import { type DeleteAlarmModelCommandOutput, type IoTEventsClient } from '@aws-sdk/client-iot-events';

import { renderHook } from '@testing-library/react';

import { useDeleteAlarmModel } from './index';
import { queryClient, wrapper } from '../helpers/test';

const deleteAlarmModelOutputStub: DeleteAlarmModelCommandOutput = {
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(deleteAlarmModelOutputStub),
} as unknown as IoTEventsClient;

describe('useDeleteAlarmModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useDeleteAlarmModel({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ alarmModelName: 'ALARM MODEL TEST STUB' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useDeleteAlarmModel({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ alarmModelName: 'ALARM MODEL TEST STUB' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
