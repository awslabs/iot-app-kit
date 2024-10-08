import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { AlarmDataStatus } from '../../../types';
import { Viewport } from '@iot-app-kit/core';

export type AssetPropertyValueSummary = {
  request: {
    assetId?: string;
    propertyId?: string;
  };
  status: AlarmDataStatus;
  data: AssetPropertyValue[] | undefined;
};

export type UpdateAlarmStateDataActionPayload = {
  viewport?: Viewport;
  assetPropertyValueSummaries?: AssetPropertyValueSummary[];
};

export type UpdateAlarmStateDataAction = UpdateAlarmStateDataActionPayload & {
  type: 'UPDATE_ALARM_STATE_DATA';
};
