import { useEffect, useMemo, useState } from 'react';
import {
  DataStream,
  StyledThreshold,
  Threshold,
  TimeSeriesDataQuery,
  Viewport,
  getVisibleData,
} from '@iot-app-kit/core';
import isEqual from 'lodash.isequal';
import { useTimeSeriesData } from '../../../hooks/useTimeSeriesData';
import { useViewport } from '../../../hooks/useViewport';
import { DEFAULT_VIEWPORT, StreamType } from '../../../common/constants';

const isNotAlarmStream = ({ streamType }: DataStream) =>
  streamType !== StreamType.ALARM;
const dataStreamIsLoading = ({ isLoading }: DataStream) => isLoading;
const dataStreamHasError = ({ error }: DataStream) => error != null;
const dataStreamIsRefreshing = ({ isRefreshing }: DataStream) => isRefreshing;

export const useVisualizedDataStreams = (
  queries: TimeSeriesDataQuery[],
  passedInViewport?: Viewport,
  thresholdOptions: StyledThreshold[] = []
) => {
  const { viewport, lastUpdatedBy } = useViewport();
  const [thresholds, setThresholds] = useState<Threshold[]>([]);

  // synchro-charts gesture overrides passed in viewport else explicitly passed in viewport overrides viewport group
  const utilizedViewport =
    (lastUpdatedBy ? viewport : passedInViewport || viewport) ??
    DEFAULT_VIEWPORT;

  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: utilizedViewport,
    queries,
    settings: {
      fetchFromStartToEnd: true,
    },
  });

  useEffect(() => {
    // setting thresholds locally to avoid new object creation
    // when merging query and option thresholds
    if (!isEqual(thresholds, [...queryThresholds, ...thresholdOptions])) {
      setThresholds([...queryThresholds, ...thresholdOptions]);
    }
  }, [thresholds, queryThresholds, thresholdOptions]);

  return useMemo(() => {
    // Line | Scatter | Bar charts do not support alarm streams.
    const dataStreamsWithoutAlarms = dataStreams.filter(isNotAlarmStream);

    const hasError = dataStreamsWithoutAlarms.some(dataStreamHasError);

    const isLoading =
      !hasError && dataStreamsWithoutAlarms.some(dataStreamIsLoading);

    const isRefreshing =
      !hasError && dataStreamsWithoutAlarms.some(dataStreamIsRefreshing);

    const visibleData = dataStreamsWithoutAlarms.flatMap(({ data }) =>
      getVisibleData(data, utilizedViewport, false)
    );

    return {
      hasError,
      isLoading,
      dataStreams: dataStreamsWithoutAlarms,
      thresholds,
      utilizedViewport,
      visibleData,
      isRefreshing,
    };
  }, [dataStreams, thresholds, utilizedViewport]);
};
