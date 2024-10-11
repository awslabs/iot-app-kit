import { isEqual, uniqWith } from 'lodash';

import { AlarmData } from '../../types';
import { AlarmsState } from '../types';
import { convertAlarmRequestStateToAlarmData } from './convertAlarmRequestStateToAlarmData';
import { convertAlarmRequestStateToInitialAlarmData } from './convertAlarmRequestStateToInitialAlarmData';
import { isInputPropertyRequest } from './utils/isInputPropertyRequest';
import {
  alarmDataAsComparable,
  isGettingLatestAlarmSourceValue,
  isSummarizingAlarmModels,
  isSummarizingAlarms,
} from './utils';

export const convertAlarmsStateToAlarmDatas = (
  state: AlarmsState
): AlarmData[] => {
  const alarmData = state.alarms.flatMap((alarm) => {
    if (
      isSummarizingAlarms(alarm) ||
      /**
       * an input property alarm request should be considered
       * loading until the alarm model is fetched. This is
       * because we cannot tell which alarms are
       * associated to the requested input property
       * until the model is described.
       */
      (isInputPropertyRequest(alarm) &&
        (isSummarizingAlarms(alarm) ||
          isGettingLatestAlarmSourceValue(alarm) ||
          isSummarizingAlarmModels(alarm)))
    ) {
      return convertAlarmRequestStateToInitialAlarmData(alarm);
    }

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
