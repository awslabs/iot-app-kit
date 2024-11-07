import {
  type AssetModelProperty,
  type AssetProperty,
} from '@aws-sdk/client-iotsitewise';
import {
  type AlarmData,
  type AlarmDataStatus,
  type AlarmRequest,
} from '../types';
import { type SummarizeAlarmAction } from './actions';
import { type SummarizeAlarmModelsAction } from './actions/summarizeAlarmModels/types';
import { type UpdateAlarmSourceDataAction } from './actions/updateAlarmSourceData/types';
import { type UpdateAlarmTypeDataAction } from './actions/updateAlarmTypeData/types';
import { type UpdateAlarmInputDataAction } from './actions/updateAlarmInputPropertyData/types';
import { type UpdateAlarmStateDataAction } from './actions/updateAlarmStateData/types';
import { type UpdateAlarmThresholdDataAction } from './actions/updateAlarmThresholdData/types';

export type AlarmDataState = Omit<AlarmData, 'status'> & {
  /**
   * The list of asset or assetModel properties on the alarm's asset.
   * Used to assign a property object to the inputProperty field.
   */
  properties?: (AssetProperty | AssetModelProperty)[];
  getLatestAlarmSourceValueQueryStatus?: AlarmDataStatus;
  getInputPropertyValueQueryStatus?: AlarmDataStatus;
  getLatestAlarmTypeValueQueryStatus?: AlarmDataStatus;
  getAlarmStateValueQueryStatus?: AlarmDataStatus;
  getAlarmThresholdValueQueryStatus?: AlarmDataStatus;
  describeAlarmModelsQueryStatus?: AlarmDataStatus;
};

export type AlarmRequestState<Request extends AlarmRequest> = {
  request: Request;
  describeAssetQueryStatus?: AlarmDataStatus;
  describeAssetModelQueryStatus?: AlarmDataStatus;
  alarmDatas: AlarmDataState[];
};

export type AlarmsState = {
  alarms: AlarmRequestState<AlarmRequest>[];
};

export type AlarmAction =
  | SummarizeAlarmAction
  | UpdateAlarmSourceDataAction
  | UpdateAlarmTypeDataAction
  | SummarizeAlarmModelsAction
  | UpdateAlarmInputDataAction
  | UpdateAlarmStateDataAction
  | UpdateAlarmThresholdDataAction;
