import { EventsClient } from './client';
import { createMockIoTEventsSDK } from '../../__mocks__/ioteventsSDK';

it('getAlarmModel should correctly call DescribeAlarmModelCommand', () => {
  const getAlarmModel = jest.fn();
  const client = new EventsClient(createMockIoTEventsSDK({ getAlarmModel }));

  const input = { alarmModelName: 'test-alarm-model-name' };

  client.getAlarmModel(input.alarmModelName);

  expect(getAlarmModel).toHaveBeenCalledWith(input);
});
