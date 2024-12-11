import { type AlarmDataState, type AlarmsState } from '../../types';
import { viewportAsInterval } from '../utils/viewportAsInterval';
import { filterAssetPropertyValues } from '../utils/filterAssetPropertyValues';
import { shouldUpdateAssetPropertyValues } from '../utils/shouldUpdateAssetPropertyValues';
import {
  type UpdateAlarmThresholdDataAction,
  type UpdateAlarmThresholdDataActionPayload,
} from './types';
import { uniqueSortAssetPropertyValues } from '../utils/uniqueSortAssetPropertyValues';
import { compact } from '@iot-app-kit/helpers';
import { extractAssetPropertyId } from '../../../utils/parseAlarmModels';

const findAssetPropertyValueSummary = (
  alarmData: AlarmDataState,
  summaries: UpdateAlarmThresholdDataActionPayload['assetPropertyValueSummaries']
) => {
  return summaries?.find(({ request }) => {
    const thresholdPropertyIds = compact(
      (alarmData.models ?? []).map((model) =>
        extractAssetPropertyId(model.alarmRule?.simpleRule?.threshold)
      )
    );
    return (
      request.assetId === alarmData.assetId &&
      request.propertyId != null &&
      thresholdPropertyIds.includes(request.propertyId)
    );
  });
};

export const onUpdateAlarmThresholdDataAction = (
  payload: UpdateAlarmThresholdDataActionPayload
): UpdateAlarmThresholdDataAction => ({
  type: 'UPDATE_ALARM_THRESHOLD_DATA',
  ...payload,
});

export const updateAlarmThresholdData = (
  state: AlarmsState,
  {
    assetPropertyValueSummaries = [],
    viewport,
  }: UpdateAlarmThresholdDataActionPayload
): AlarmsState => {
  if (assetPropertyValueSummaries.length === 0) return state;

  return {
    ...state,
    alarms: state.alarms.map((alarm) => {
      return {
        ...alarm,
        alarmDatas: alarm.alarmDatas.map((alarmData) => {
          if (!alarmData.models) return alarmData;

          const summary = findAssetPropertyValueSummary(
            alarmData,
            assetPropertyValueSummaries
          );

          if (!summary) return alarmData;

          const updatedAlarmData = {
            ...alarmData,
            getAlarmThresholdValueQueryStatus: summary.status,
          };

          const currentData = alarmData.thresholds ?? [];
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
            thresholds: filteredData,
          };
        }),
      };
    }),
  };
};
