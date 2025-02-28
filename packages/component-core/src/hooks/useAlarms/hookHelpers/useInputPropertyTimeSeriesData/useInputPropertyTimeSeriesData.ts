import { useEffect, useMemo } from 'react';

import { type UseInputPropertyTimeSeriesDataOptions } from './types';

import { useTimeSeriesData } from '../../../useTimeSeriesData';
import { useRequestSelector } from '../../state';
import { alarmToSiteWiseDataStreamQuery } from './alarmToSiteWiseDataStreamQuery';

export const useInputPropertyTimeSeriesData = ({
  requests,
  onUpdateAlarmInputPropertyData,
  viewport,
  fetchOnlyLatest,
  refreshRate,
  fetchInputPropertyData,
  timeSeriesData,
  aggregationType = 'AVERAGE',
  resolution = undefined,
  resolutionConfig = undefined,
}: UseInputPropertyTimeSeriesDataOptions) => {
  const query = useRequestSelector(requests, (inputPropertyRequests) =>
    alarmToSiteWiseDataStreamQuery(inputPropertyRequests, {
      aggregationType,
      resolution,
    })
  );

  const queries = useMemo(() => {
    const enabled =
      !!fetchInputPropertyData &&
      timeSeriesData != null &&
      viewport != null &&
      (query.assets?.length ?? 0) > 0;

    return enabled ? [timeSeriesData(query)] : [];
  }, [fetchInputPropertyData, timeSeriesData, viewport, query]);

  const { dataStreams } = useTimeSeriesData({
    queries,
    viewport,
    settings: {
      refreshRate,
      fetchFromStartToEnd: !fetchOnlyLatest,
      fetchMostRecentBeforeEnd: !!fetchOnlyLatest,
      resolution: resolutionConfig,
    },
  });

  useEffect(() => {
    onUpdateAlarmInputPropertyData({
      dataStreams,
    });
  }, [onUpdateAlarmInputPropertyData, dataStreams]);
};
