import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { type AlarmDataStatus } from '../../../types';
import { type Viewport } from '@iot-app-kit/core';

export interface AssetPropertyValueSummary {
  request: {
    assetId?: string;
    propertyId?: string;
  };
  status: AlarmDataStatus;
  data: AssetPropertyValue[] | undefined;
}

export interface UpdateAlarmThresholdDataActionPayload {
  viewport?: Viewport;
  assetPropertyValueSummaries?: AssetPropertyValueSummary[];
}

export interface UpdateAlarmThresholdDataAction
  extends UpdateAlarmThresholdDataActionPayload {
  type: 'UPDATE_ALARM_THRESHOLD_DATA';
}
