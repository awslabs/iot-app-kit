import { createNonNullableList } from '@iot-app-kit/core';
import { type AlarmData, type AlarmRequest } from '../../types';
import { combineStatusForQueries } from '../../utils/queryStatus';
import { type AlarmRequestState } from '../types';

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
