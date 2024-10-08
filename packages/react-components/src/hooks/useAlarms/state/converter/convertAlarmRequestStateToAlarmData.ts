import { createNonNullableList } from '../../../../utils/createNonNullableList';
import { AlarmDataInternal, AlarmRequest } from '../../types';
import { combineStatusForQueries } from '../../utils/queryStatus';
import { AlarmRequestState } from '../types';

export const convertAlarmRequestStateToAlarmData = (
  alarmRequestState: AlarmRequestState<AlarmRequest>
): AlarmDataInternal[] => {
  return alarmRequestState.alarmDatas.map(({ properties, ...alarm }) => ({
    ...alarm,
    /**
     * TODO: remove this once we have moved
     * the models queries into the reducer
     */
    properties,
    status: combineStatusForQueries(
      createNonNullableList([
        alarmRequestState.describeAssetModelQueryStatus,
        alarmRequestState.describeAssetQueryStatus,
        alarm.getLatestAlarmSourceValueQueryStatus,
        alarm.getLatestAlarmTypeValueQueryStatus,
        alarm.describeAlarmModelsQueryStatus,
      ])
    ),
  }));
};
