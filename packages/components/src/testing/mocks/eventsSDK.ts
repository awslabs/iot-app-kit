import { ALARM_MODEL } from '@iot-app-kit/source-iotsitewise';
import { createMockIoTEventsSDK } from '@iot-app-kit/testing-util';

const getAlarmModel = jest.fn().mockResolvedValue(ALARM_MODEL);

export const mockEventsSDK = createMockIoTEventsSDK({
  getAlarmModel,
});
