import { AlarmsState } from '../../types';
import { createAlarmsByAsset } from './createAlarmsByAsset';
import { createAlarmsByAssetModel } from './createAlarmsByAssetModel';
import { SummarizeAlarmAction, SummarizeAlarmActionPayload } from './types';

export const onSummarizeAlarmAction = (
  payload: SummarizeAlarmActionPayload
): SummarizeAlarmAction => ({
  type: 'SUMMARIZE_ALARMS',
  ...payload,
});

export const summarizeAlarms = (
  state: AlarmsState,
  { assetModelSummaries = [], assetSummaries = [] }: SummarizeAlarmActionPayload
): AlarmsState => {
  const alarmsByAsset = assetSummaries.flatMap(createAlarmsByAsset);
  const alarmsByAssetModel = assetModelSummaries.flatMap(
    createAlarmsByAssetModel
  );

  return {
    ...state,
    alarms: [...alarmsByAsset, ...alarmsByAssetModel],
  };
};
