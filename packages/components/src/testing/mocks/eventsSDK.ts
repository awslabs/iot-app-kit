import { ALARM_MODEL, createMockIoTEventsSDK } from '@iot-app-kit/source-iotsitewise';

const getAlarmModel = jest.fn().mockResolvedValue(ALARM_MODEL);

export const mockEventsSDK = createMockIoTEventsSDK({
  getAlarmModel,
});
