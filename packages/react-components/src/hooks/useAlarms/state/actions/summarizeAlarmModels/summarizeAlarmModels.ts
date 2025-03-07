import isEqual from 'lodash-es/isEqual';
import uniqWith from 'lodash-es/uniqWith';
import { createNonNullableList } from '../../../../../utils/createNonNullableList';
import {
  extractAssetPropertyId,
  getAlarmModelNameFromAlarmSourceProperty,
  getStaticThresholdAsAssetPropertyValue,
} from '../../../utils/parseAlarmModels';
import { isInputPropertyRequest } from '../../converter/utils';
import { type AlarmDataState, type AlarmsState } from '../../types';
import {
  type SummarizeAlarmModelsAction,
  type SummarizeAlarmModelsActionPayload,
} from './types';

export const onSummarizeAlarmModelsAction = (
  payload: SummarizeAlarmModelsActionPayload
): SummarizeAlarmModelsAction => ({
  type: 'SUMMARIZE_ALARM_MODELS',
  ...payload,
});

export const summarizeAlarmModels = (
  state: AlarmsState,
  { alarmModelSummaries = [] }: SummarizeAlarmModelsActionPayload
): AlarmsState => {
  if (alarmModelSummaries.length === 0) return state;

  return {
    ...state,
    alarms: state.alarms.map((alarm) => {
      let updatedAlarmData = alarm.alarmDatas.map(
        (alarmData): AlarmDataState => {
          const modelSummary = alarmModelSummaries.find(
            (summary) =>
              summary.request.alarmModelName ===
              getAlarmModelNameFromAlarmSourceProperty(alarmData.source)
          );

          if (modelSummary == null) return alarmData;

          const updatedAlarm = {
            ...alarmData,
            describeAlarmModelsQueryStatus: modelSummary.status,
          };

          const model = modelSummary.data;

          if (model == null) return updatedAlarm;

          const models = uniqWith(
            [...(updatedAlarm.models ?? []), model],
            isEqual
          );

          const inputPropertyIds = createNonNullableList(
            models.map((model) =>
              extractAssetPropertyId(model.alarmRule?.simpleRule?.inputProperty)
            )
          );
          const inputProperties = (alarmData.properties ?? []).filter(
            (property) =>
              property.id != null && inputPropertyIds.includes(property.id)
          );

          const existingInputProperty = updatedAlarm.inputProperty ?? [];
          const inputPropertyFromModel: AlarmDataState['inputProperty'] =
            inputProperties.map((property) => ({ property }));
          const inputProperty = uniqWith(
            [...existingInputProperty, ...inputPropertyFromModel],
            isEqual
          );

          const staticThresholds = createNonNullableList(
            models.map(getStaticThresholdAsAssetPropertyValue)
          );

          return {
            ...updatedAlarm,
            models,
            inputProperty,
            thresholds: staticThresholds,
          };
        }
      );

      if (isInputPropertyRequest(alarm)) {
        updatedAlarmData = updatedAlarmData.filter((alarmData) => {
          const alarmModelInputProperties = alarmData.inputProperty?.map(
            ({ property }) => property.id
          );

          // will be undefined while we are still fetching the model
          // input property will be mapped above from the model
          if (alarmModelInputProperties == null) return true;

          return alarmModelInputProperties.includes(
            alarm.request.inputPropertyId
          );
        });
      }

      return {
        ...alarm,
        alarmDatas: updatedAlarmData,
      };
    }),
  };
};
