import { type AlarmDataState, type AlarmsState } from '../../types';
import {
  type UpdateAlarmSourceDataAction,
  type UpdateAlarmSourceDataActionPayload,
} from './types';

const findAssetPropertyValueSummary = (
  alarmData: AlarmDataState,
  summaries: UpdateAlarmSourceDataActionPayload['assetPropertyValueSummaries']
) => {
  return summaries?.find(({ request }) => {
    return (
      request.assetId === alarmData.assetId &&
      request.propertyId === alarmData.source?.property.id
    );
  });
};

export const onUpdateAlarmSourceDataAction = (
  payload: UpdateAlarmSourceDataActionPayload
): UpdateAlarmSourceDataAction => ({
  type: 'UPDATE_ALARM_SOURCE_DATA',
  ...payload,
});

export const updateAlarmSourceData = (
  state: AlarmsState,
  { assetPropertyValueSummaries = [] }: UpdateAlarmSourceDataActionPayload
): AlarmsState => {
  if (assetPropertyValueSummaries.length === 0) return state;

  return {
    ...state,
    alarms: state.alarms.map((alarm) => {
      return {
        ...alarm,
        alarmDatas: alarm.alarmDatas.map((alarmData) => {
          if (alarmData.source == null) return alarmData;

          const summary = findAssetPropertyValueSummary(
            alarmData,
            assetPropertyValueSummaries
          );

          if (summary == null) return alarmData;

          const updatedAlarmData = {
            ...alarmData,
            getLatestAlarmSourceValueQueryStatus: summary.status,
          };

          const alarmSourceData = summary.data?.propertyValue;

          if (alarmSourceData == null) return updatedAlarmData;

          return {
            ...updatedAlarmData,
            source: {
              ...alarmData.source,
              data: [alarmSourceData],
            },
          };
        }),
      };
    }),
  };
};
