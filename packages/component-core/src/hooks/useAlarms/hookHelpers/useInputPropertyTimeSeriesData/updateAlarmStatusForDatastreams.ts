import { type DataStream } from '@iot-app-kit/core';
import isEqual from 'lodash-es/isEqual';
import { type AlarmData } from '../../types';
import { combineStatusForQueries } from '../../utils/queryStatus';

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
