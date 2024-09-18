import { UseQueryResult } from '@tanstack/react-query';
import isEqual from 'lodash.isequal';
import { AlarmData } from '../../types';
import {
  combineStatusForQueries,
  isQueryDisabled,
} from '../../utils/queryStatus';

export const updateAlarmStatusForAlarmStateQueries = (
  alarm: AlarmData,
  queries: UseQueryResult[]
): AlarmData => {
  const currentStatus = alarm.status;

  // remove irrelevant queries which are disabled
  const statusFromQueries = queries.filter((query) => !isQueryDisabled(query));

  const updatedStatus = combineStatusForQueries(statusFromQueries);

  if (!isEqual(currentStatus, updatedStatus)) {
    alarm.status = updatedStatus;
  }

  return alarm;
};
