import type { GetAssetPropertyValueResponse } from '@aws-sdk/client-iotsitewise';
import type { AlarmDataStatus } from '../../../types';

export interface AssetPropertyValueSummary {
  request: {
    assetId?: string;
    propertyId?: string;
  };
  status: AlarmDataStatus;
  data: GetAssetPropertyValueResponse | undefined;
}

export interface UpdateAlarmSourceDataActionPayload {
  assetPropertyValueSummaries?: AssetPropertyValueSummary[];
}

export interface UpdateAlarmSourceDataAction
  extends UpdateAlarmSourceDataActionPayload {
  type: 'UPDATE_ALARM_SOURCE_DATA';
}
