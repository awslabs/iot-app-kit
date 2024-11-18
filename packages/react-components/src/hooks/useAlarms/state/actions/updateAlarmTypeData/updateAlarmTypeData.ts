import { type AlarmDataState, type AlarmsState } from '../../types';
import {
  type UpdateAlarmTypeDataAction,
  type UpdateAlarmTypeDataActionPayload,
} from './types';

const findAssetPropertyValueSummary = (
  alarmData: AlarmDataState,
  summaries: UpdateAlarmTypeDataActionPayload['assetPropertyValueSummaries']
) => {
  return summaries?.find(({ request }) => {
    return (
      request.assetId === alarmData.assetId &&
      request.propertyId === alarmData.type?.property.id
    );
  });
};

export const onUpdateAlarmTypeDataAction = (
  payload: UpdateAlarmTypeDataActionPayload
): UpdateAlarmTypeDataAction => ({
  type: 'UPDATE_ALARM_TYPE_DATA',
  ...payload,
});

export const updateAlarmTypeData = (
  state: AlarmsState,
  { assetPropertyValueSummaries = [] }: UpdateAlarmTypeDataActionPayload
): AlarmsState => {
  if (assetPropertyValueSummaries.length === 0) return state;

  return {
    ...state,
    alarms: state.alarms.map((alarm) => {
      return {
        ...alarm,
        alarmDatas: alarm.alarmDatas.map((alarmData) => {
          if (alarmData.type == null) return alarmData;

          const summary = findAssetPropertyValueSummary(
            alarmData,
            assetPropertyValueSummaries
          );

          if (summary == null) return alarmData;

          const updatedAlarmData = {
            ...alarmData,
            getLatestAlarmTypeValueQueryStatus: summary.status,
          };

          const alarmTypeData = summary.data?.propertyValue;

          if (alarmTypeData == null) return updatedAlarmData;

          return {
            ...updatedAlarmData,
            type: {
              ...alarmData.type,
              data: [alarmTypeData],
            },
          };
        }),
      };
    }),
  };
};
