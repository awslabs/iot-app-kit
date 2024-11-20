import { type IoTEvents } from '@aws-sdk/client-iot-events';

export const describeAlarmModelMock = vi.fn();
export const iotEventsClientMock = {
  describeAlarmModel: describeAlarmModelMock,
} as unknown as IoTEvents;
