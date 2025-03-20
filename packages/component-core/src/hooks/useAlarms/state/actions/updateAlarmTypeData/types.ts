import { type GetAssetPropertyValueResponse } from '@aws-sdk/client-iotsitewise';
import { type AlarmDataStatus } from '../../../types';

export interface AssetPropertyValueSummary {
  request: {
    assetId?: string;
    propertyId?: string;
  };
  status: AlarmDataStatus;
  data: GetAssetPropertyValueResponse | undefined;
}

export interface UpdateAlarmTypeDataActionPayload {
  assetPropertyValueSummaries?: AssetPropertyValueSummary[];
}

export interface UpdateAlarmTypeDataAction
  extends UpdateAlarmTypeDataActionPayload {
  type: 'UPDATE_ALARM_TYPE_DATA';
}
