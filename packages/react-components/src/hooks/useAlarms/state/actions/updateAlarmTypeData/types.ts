import { GetAssetPropertyValueResponse } from '@aws-sdk/client-iotsitewise';
import { AlarmDataStatus } from '../../../types';

export type AssetPropertyValueSummary = {
  request: {
    assetId?: string;
    propertyId?: string;
  };
  status: AlarmDataStatus;
  data: GetAssetPropertyValueResponse | undefined;
};

export type UpdateAlarmTypeDataActionPayload = {
  assetPropertyValueSummaries?: AssetPropertyValueSummary[];
};

export type UpdateAlarmTypeDataAction = UpdateAlarmTypeDataActionPayload & {
  type: 'UPDATE_ALARM_TYPE_DATA';
};
