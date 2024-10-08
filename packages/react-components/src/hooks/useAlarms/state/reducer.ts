import { summarizeAlarms } from './actions/summarizeAlarms';
import { AlarmAction, AlarmsState } from './types';

export const alarmsStateReducer = (
  state: AlarmsState,
  action: AlarmAction
): AlarmsState => {
  switch (action.type) {
    case 'SUMMARIZE_ALARMS':
      return summarizeAlarms(state, action);
    default:
      return state;
  }
};
