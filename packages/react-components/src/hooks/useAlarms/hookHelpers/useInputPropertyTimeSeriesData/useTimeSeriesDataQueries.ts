import { useMemo } from 'react';
import { UseInputPropertyTimeSeriesDataOptions } from './types';
import { alarmToSiteWiseDataStreamQuery } from './alarmToSiteWiseDataStreamQuery';

export const useTimeSeriesDataQueries = ({
  alarms,
  timeSeriesData,
  fetchInputPropertyData,
  viewport,
  aggregationType = 'AVERAGE',
  resolution = undefined,
}: Pick<
  UseInputPropertyTimeSeriesDataOptions,
  | 'alarms'
  | 'viewport'
  | 'timeSeriesData'
  | 'fetchInputPropertyData'
  | 'aggregationType'
  | 'resolution'
>) => {
  return useMemo(() => {
    const query = alarmToSiteWiseDataStreamQuery(alarms, {
      aggregationType,
      resolution,
    });

    const enabled =
      !!fetchInputPropertyData &&
      timeSeriesData != null &&
      viewport != null &&
      (query.assets?.length ?? 0) > 0;

    return enabled ? [timeSeriesData(query)] : [];
  }, [
    alarms,
    timeSeriesData,
    fetchInputPropertyData,
    viewport,
    aggregationType,
    resolution,
  ]);
};
