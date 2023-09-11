import { useMemo } from 'react';
import { DataStream, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';
import { useTimeSeriesData } from '../../../hooks/useTimeSeriesData';
import { useViewport } from '../../../hooks/useViewport';
import { DEFAULT_VIEWPORT, StreamType } from '../../../common/constants';

const isNotAlarmStream = ({ streamType }: DataStream) => streamType !== StreamType.ALARM;
const dataStreamIsLoading = ({ isLoading }: DataStream) => isLoading;
const dataStreamHasError = ({ error }: DataStream) => error != null;

export const useVisualizedDataStreams = (queries: TimeSeriesDataQuery[], passedInViewport?: Viewport) => {
  const { viewport, lastUpdatedBy } = useViewport();

  // synchro-charts gesture overrides passed in viewport else explicitly passed in viewport overrides viewport group
  const utilizedViewport = (lastUpdatedBy ? viewport : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

  const { dataStreams, thresholds } = useTimeSeriesData({
    viewport: utilizedViewport,
    queries,
    settings: {
      fetchFromStartToEnd: true,
      fetchMostRecentBeforeStart: true,
    },
  });

  // Line | Scatter | Bar charts do not support alarm streams.
  const dataStreamsWithoutAlarms = useMemo(() => dataStreams.filter(isNotAlarmStream), [dataStreams]);

  const hasError = useMemo(() => dataStreamsWithoutAlarms.some(dataStreamHasError), [dataStreamsWithoutAlarms]);

  const isLoading = useMemo(
    () => !hasError && dataStreamsWithoutAlarms.some(dataStreamIsLoading),
    [hasError, dataStreamsWithoutAlarms]
  );

  return {
    hasError,
    isLoading,
    dataStreams: dataStreamsWithoutAlarms,
    thresholds,
    utilizedViewport,
  };
};
