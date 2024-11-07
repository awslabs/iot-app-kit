import { type DataStream } from '@iot-app-kit/core';

export type UpdateAlarmInputDataActionPayload = {
  dataStreams?: DataStream[];
};

export type UpdateAlarmInputDataAction = UpdateAlarmInputDataActionPayload & {
  type: 'UPDATE_ALARM_INPUT_PROPERTY_DATA';
};
