import { summarizeAlarmModels, updateAlarmSourceData } from './actions';
import { summarizeAlarms } from './actions/summarizeAlarms';
import { updateAlarmInputPropertyData } from './actions/updateAlarmInputPropertyData';
import { updateAlarmStateData } from './actions/updateAlarmStateData/updateAlarmStateData';
import { updateAlarmThresholdData } from './actions/updateAlarmThresholdData';
import { updateAlarmTypeData } from './actions/updateAlarmTypeData';
import { AlarmAction, AlarmsState } from './types';

export const alarmsStateReducer = (
  state: AlarmsState,
  action: AlarmAction
): AlarmsState => {
  switch (action.type) {
    case 'SUMMARIZE_ALARMS':
      return summarizeAlarms(state, action);
    case 'UPDATE_ALARM_SOURCE_DATA':
      return updateAlarmSourceData(state, action);
    case 'UPDATE_ALARM_TYPE_DATA':
      return updateAlarmTypeData(state, action);
    case 'SUMMARIZE_ALARM_MODELS':
      return summarizeAlarmModels(state, action);
    case 'UPDATE_ALARM_INPUT_PROPERTY_DATA':
      return updateAlarmInputPropertyData(state, action);
    case 'UPDATE_ALARM_STATE_DATA':
      return updateAlarmStateData(state, action);
    case 'UPDATE_ALARM_THRESHOLD_DATA':
      return updateAlarmThresholdData(state, action);
    default:
      return state;
  }
};
