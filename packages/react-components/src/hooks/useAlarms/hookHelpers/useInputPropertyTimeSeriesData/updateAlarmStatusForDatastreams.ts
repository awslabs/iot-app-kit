import { DataStream } from '@iot-app-kit/core';
import { AlarmData } from '../../types';
import { combineStatusForQueries } from '../../utils/queryStatus';
import isEqual from 'lodash.isequal';

export const updateAlarmStatusForDatastreams = (
  alarm: AlarmData,
  datastreams: DataStream[]
): AlarmData => {
  const currentStatus = alarm.status;

  const datastreamsAsQueryResults = datastreams.map(
    ({ isLoading, isRefreshing, error }) => ({
      isLoading: !!isLoading,
      isRefetching: !!isRefreshing,
      isError: error != null,
      isSuccess: !isLoading && error == null,
      error: null,
    })
  );

  const updatedStatus = combineStatusForQueries(datastreamsAsQueryResults);

  if (!isEqual(currentStatus, updatedStatus)) {
    alarm.status = updatedStatus;
  }

  return alarm;
};
