import { type AlarmDataState, type AlarmsState } from '../../types';
import { viewportAsInterval } from '../utils/viewportAsInterval';
import { filterAssetPropertyValues } from '../utils/filterAssetPropertyValues';
import { shouldUpdateAssetPropertyValues } from '../utils/shouldUpdateAssetPropertyValues';
import {
  type UpdateAlarmStateDataAction,
  type UpdateAlarmStateDataActionPayload,
} from './types';
import { uniqueSortAssetPropertyValues } from '../utils/uniqueSortAssetPropertyValues';

const findAssetPropertyValueSummary = (
  alarmData: AlarmDataState,
  summaries: UpdateAlarmStateDataActionPayload['assetPropertyValueSummaries']
) => {
  return summaries?.find(({ request }) => {
    return (
      request.assetId === alarmData.assetId &&
      request.propertyId === alarmData.state?.property.id
    );
  });
};

export const onUpdateAlarmStateDataAction = (
  payload: UpdateAlarmStateDataActionPayload
): UpdateAlarmStateDataAction => ({
  type: 'UPDATE_ALARM_STATE_DATA',
  ...payload,
});

export const updateAlarmStateData = (
  state: AlarmsState,
  {
    assetPropertyValueSummaries = [],
    viewport,
  }: UpdateAlarmStateDataActionPayload
): AlarmsState => {
  if (assetPropertyValueSummaries.length === 0) return state;

  return {
    ...state,
    alarms: state.alarms.map((alarm) => {
      return {
        ...alarm,
        alarmDatas: alarm.alarmDatas.map((alarmData) => {
          if (!alarmData.state) return alarmData;

          const summary = findAssetPropertyValueSummary(
            alarmData,
            assetPropertyValueSummaries
          );

          if (!summary) return alarmData;

          const updatedAlarmData = {
            ...alarmData,
            getAlarmStateValueQueryStatus: summary.status,
          };

          const currentData = alarmData.state.data;
          const updatedData = uniqueSortAssetPropertyValues([
            ...(currentData ?? []),
            ...(summary.data ?? []),
          ]);

          const filteredData = viewport
            ? filterAssetPropertyValues(
                updatedData,
                viewportAsInterval(viewport)
              )
            : updatedData;

          if (
            currentData != null &&
            !shouldUpdateAssetPropertyValues(currentData, filteredData)
          )
            return updatedAlarmData;

          return {
            ...updatedAlarmData,
            state: {
              ...alarmData.state,
              data: filteredData,
            },
          };
        }),
      };
    }),
  };
};
