import { createMockIoTEventsSDK } from '@iot-app-kit/testing-util';
import { EventsClient } from './client';

it('getAlarmModel should correctly call DescribeAlarmModelCommand', () => {
  const getAlarmModel = vi.fn();
  const client = new EventsClient(createMockIoTEventsSDK({ getAlarmModel }));

  const input = { alarmModelName: 'test-alarm-model-name' };

  client.getAlarmModel(input.alarmModelName);

  expect(getAlarmModel).toHaveBeenCalledWith(input);
});
