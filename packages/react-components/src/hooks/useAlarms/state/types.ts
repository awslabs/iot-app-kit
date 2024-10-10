import { AlarmDataInternal, AlarmDataStatus, AlarmRequest } from '../types';
import { SummarizeAlarmAction } from './actions';

/**
 * TODO: will remove AlarmDataInternal after models is refactored
 */
export type AlarmDataState = Omit<AlarmDataInternal, 'request' | 'status'> & {
  getLatestAlarmSourceValueQueryStatus?: AlarmDataStatus;
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

export type AlarmAction = SummarizeAlarmAction;
