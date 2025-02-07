import type { DataStream } from '@iot-app-kit/core';

export interface UpdateAlarmInputDataActionPayload {
  dataStreams?: DataStream[];
}

export interface UpdateAlarmInputDataAction
  extends UpdateAlarmInputDataActionPayload {
  type: 'UPDATE_ALARM_INPUT_PROPERTY_DATA';
}
