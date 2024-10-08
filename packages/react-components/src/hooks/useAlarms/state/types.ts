import { AssetModelProperty, AssetProperty } from '@aws-sdk/client-iotsitewise';
import { AlarmData, AlarmDataStatus, AlarmRequest } from '../types';
import { SummarizeAlarmAction } from './actions';
import { SummarizeAlarmModelsAction } from './actions/summarizeAlarmModels/types';
import { UpdateAlarmSourceDataAction } from './actions/updateAlarmSourceData/types';
import { UpdateAlarmTypeDataAction } from './actions/updateAlarmTypeData/types';
import { UpdateAlarmInputDataAction } from './actions/updateAlarmInputPropertyData/types';

export type AlarmDataState = Omit<AlarmData, 'status'> & {
  /**
   * The list of asset or assetModel properties on the alarm's asset.
   * Used to assign a property object to the inputProperty field.
   */
  properties?: (AssetProperty | AssetModelProperty)[];
  getLatestAlarmSourceValueQueryStatus?: AlarmDataStatus;
  getInputPropertyValueQueryStatus?: AlarmDataStatus;
  getLatestAlarmTypeValueQueryStatus?: AlarmDataStatus;
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
  | UpdateAlarmInputDataAction;
