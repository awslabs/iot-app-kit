import { useEffect, useState } from 'react';
import { DataStream, TimeSeriesDataQuery, Viewport, getVisibleData } from '@iot-app-kit/core';
import { useTimeSeriesData } from '../../../hooks/useTimeSeriesData';
import { useViewport } from '../../../hooks/useViewport';
import { DEFAULT_VIEWPORT, StreamType } from '../../../common/constants';
import { PERFORMANCE_MODE_THRESHOLD } from '../eChartsConstants';

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
    },
  });

  // dependencies converted to string
  // useEffect performs an equal check on the previous and current values , for object it check the reference
  // if the reference has changed i.e. new element but has the same value, the useEffect is triggered, to avoid this
  // strings are used to compare
  const dataString = JSON.stringify(dataStreams);
  const thresholdsString = JSON.stringify(thresholds);
  const utilizedString = JSON.stringify(utilizedViewport);

  // utilizing state to make sure these values are updated only on change else
  // creating a new object will trigger the useEffect in every cycle
  const [dataStreamsWithoutAlarms, setDataStreamsWithoutAlarms] = useState(dataStreams);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);

  useEffect(() => {
    const dataWOAlarms = dataStreams.filter(isNotAlarmStream) as DataStream[];
    setDataStreamsWithoutAlarms(dataWOAlarms);

    const hasErrorLocal = dataWOAlarms.some(dataStreamHasError);
    const isLoadingLocal = !hasErrorLocal && dataWOAlarms.some(dataStreamIsLoading);
    setHasError(hasErrorLocal);
    setIsLoading(isLoadingLocal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataString, thresholdsString]);

  useEffect(() => {
    const visibleData = dataStreamsWithoutAlarms.flatMap(({ data }) => getVisibleData(data, utilizedViewport, false));
    const performanceModeLocal = visibleData.length > PERFORMANCE_MODE_THRESHOLD;
    setPerformanceMode(performanceModeLocal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStreamsWithoutAlarms, utilizedString]);

  return {
    hasError,
    isLoading,
    dataStreams: dataStreamsWithoutAlarms,
    thresholds,
    utilizedViewport,
    performanceMode,
  };
};
