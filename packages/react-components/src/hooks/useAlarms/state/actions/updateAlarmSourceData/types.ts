import { type GetAssetPropertyValueResponse } from '@aws-sdk/client-iotsitewise';
import { type AlarmDataStatus } from '../../../types';

export type AssetPropertyValueSummary = {
  request: {
    assetId?: string;
    propertyId?: string;
  };
  status: AlarmDataStatus;
  data: GetAssetPropertyValueResponse | undefined;
};

export type UpdateAlarmSourceDataActionPayload = {
  assetPropertyValueSummaries?: AssetPropertyValueSummary[];
};

export type UpdateAlarmSourceDataAction = UpdateAlarmSourceDataActionPayload & {
  type: 'UPDATE_ALARM_SOURCE_DATA';
};
