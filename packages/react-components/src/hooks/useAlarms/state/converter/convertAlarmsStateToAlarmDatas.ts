import { isEqual, uniqWith } from 'lodash';

import { AlarmData } from '../../types';
import { AlarmsState } from '../types';
import { convertAlarmRequestStateToAlarmData } from './convertAlarmRequestStateToAlarmData';
import { convertAlarmRequestStateToInitialAlarmData } from './convertAlarmRequestStateToInitialAlarmData';
// import { convertInputPropertyAlarmRequestStateToAlarmData } from './convertInputPropertyAlarmRequestStateToAlarmData';
// import { isInputPropertyRequest } from './utils/isInputPropertyRequest';
import { alarmDataAsComparable, isSummarizingAlarms } from './utils';

export const convertAlarmsStateToAlarmDatas = (
  state: AlarmsState
): AlarmData[] => {
  const alarmData = state.alarms.flatMap((alarm) => {
    if (isSummarizingAlarms(alarm)) {
      return convertAlarmRequestStateToInitialAlarmData(alarm);
    }

    /**
     * TODO:
     * commenting these out until this case is explicilty
     * handled in the other helper hooks and the filter
     * is removed from useAlarms
     */
    // else if (isInputPropertyRequest(alarm)) {
    //   return convertInputPropertyAlarmRequestStateToAlarmData(alarm);
    // }

    return convertAlarmRequestStateToAlarmData(alarm);
  });

  /**
   * Return unique list of alarms by their
   * assetId + assetModelId + compositeModelId
   * This will ensure we don't return the same
   * alarm twice in the list if a user adds
   * requests that would return overlapping results.
   * This could be the case if the user included
   * an asset request with an input property
   * request.
   */
  return uniqWith(alarmData, (alarmA, alarmB) =>
    isEqual(alarmDataAsComparable(alarmA), alarmDataAsComparable(alarmB))
  );
};
