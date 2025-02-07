import isEqual from 'lodash-es/isEqual';
import { combineStatusForQueries } from '../../../utils/queryStatus';
import { type AlarmsState } from '../../types';
import { filterDataStreamsForAlarm } from './filterDataStreamsForAlarm';
import { matchesDatastream } from './matchesDataStream';
import {
  type UpdateAlarmInputDataAction,
  type UpdateAlarmInputDataActionPayload,
} from './types';

export const onUpdateAlarmInputDataAction = (
  payload: UpdateAlarmInputDataActionPayload
): UpdateAlarmInputDataAction => ({
  type: 'UPDATE_ALARM_INPUT_PROPERTY_DATA',
  ...payload,
});

export const updateAlarmInputPropertyData = (
  state: AlarmsState,
  { dataStreams = [] }: UpdateAlarmInputDataActionPayload
): AlarmsState => {
  if (dataStreams.length === 0) return state;

  return {
    ...state,
    alarms: state.alarms.map((alarm) => {
      return {
        ...alarm,
        alarmDatas: alarm.alarmDatas.map((alarmData) => {
          if (alarmData.assetId == null || alarmData.inputProperty == null)
            return alarmData;

          const datastreamForAlarmData = filterDataStreamsForAlarm(
            alarmData,
            dataStreams
          );

          if (datastreamForAlarmData.length === 0) return alarmData;

          const datastreamsAsQueryResults = datastreamForAlarmData.map(
            ({ isLoading, isRefreshing, error }) => ({
              isLoading: !!isLoading,
              isRefetching: !!isRefreshing,
              isError: error != null,
              isSuccess: !isLoading && error == null,
            })
          );

          const datastreamsAsStatus = combineStatusForQueries(
            datastreamsAsQueryResults
          );

          // Don't update the reference unless it is structurally different.
          const getInputPropertyValueQueryStatus = isEqual(
            alarmData.getInputPropertyValueQueryStatus,
            datastreamsAsStatus
          )
            ? alarmData.getInputPropertyValueQueryStatus
            : datastreamsAsStatus;

          return {
            ...alarmData,
            getInputPropertyValueQueryStatus,
            inputProperty: alarmData.inputProperty.map(
              (propertyWithDatastream) => {
                const dataStream = datastreamForAlarmData.find(
                  matchesDatastream({
                    assetId: alarmData.assetId,
                    propertyId: propertyWithDatastream.property.id,
                  })
                );

                if (dataStream == null) return propertyWithDatastream;

                return {
                  ...propertyWithDatastream,
                  dataStream,
                };
              }
            ),
          };
        }),
      };
    }),
  };
};
