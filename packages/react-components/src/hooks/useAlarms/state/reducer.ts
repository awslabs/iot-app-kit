import { updateAlarmSourceData } from './actions';
import { summarizeAlarms } from './actions/summarizeAlarms';
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
    default:
      return state;
  }
};
