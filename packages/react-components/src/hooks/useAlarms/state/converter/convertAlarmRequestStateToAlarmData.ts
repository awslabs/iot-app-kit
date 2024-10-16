import { createNonNullableList } from '../../../../utils/createNonNullableList';
import { AlarmData, AlarmRequest } from '../../types';
import { combineStatusForQueries } from '../../utils/queryStatus';
import { AlarmRequestState } from '../types';

export const convertAlarmRequestStateToAlarmData = (
  alarmRequestState: AlarmRequestState<AlarmRequest>
): AlarmData[] => {
  return alarmRequestState.alarmDatas.map(
    ({ properties: _properties, ...alarm }) => ({
      ...alarm,
      status: combineStatusForQueries(
        createNonNullableList([
          alarmRequestState.describeAssetModelQueryStatus,
          alarmRequestState.describeAssetQueryStatus,
          alarm.getLatestAlarmSourceValueQueryStatus,
          alarm.getInputPropertyValueQueryStatus,
          alarm.getLatestAlarmTypeValueQueryStatus,
          alarm.getAlarmStateValueQueryStatus,
          alarm.getAlarmThresholdValueQueryStatus,
          alarm.describeAlarmModelsQueryStatus,
        ])
      ),
    })
  );
};
