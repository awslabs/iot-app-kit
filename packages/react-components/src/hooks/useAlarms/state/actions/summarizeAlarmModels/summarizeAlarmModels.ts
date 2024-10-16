import { isEqual, uniqWith } from 'lodash';
import {
  extractAssetPropertyId,
  getAlarmModelNameFromAlarmSourceProperty,
  getStaticThresholdAsAssetPropertyValue,
} from '../../../utils/parseAlarmModels';
import { isInputPropertyRequest } from '../../converter/utils';
import { AlarmDataState, AlarmsState } from '../../types';
import {
  SummarizeAlarmModelsAction,
  SummarizeAlarmModelsActionPayload,
} from './types';
import { createNonNullableList } from '../../../../../utils/createNonNullableList';

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
            describeAssetModelQueryStatus: modelSummary.status,
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
