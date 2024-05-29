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
// import { useTimeSeriesData } from '../../../hooks/useTimeSeriesData';
import { useViewport } from '../../../hooks/useViewport';
import { DEFAULT_VIEWPORT, StreamType } from '../../../common/constants';
// import { useAssetPropertyValueHistory } from '../../../queries/useAssetPropertyValueHistory/useAssetPropertyValueHistory';
import { getEnvCredentials, getRegion } from '../../../../stories/utils/query';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { useAssetPropertyValueHistory2 } from '../../../queries/useAssetPropertyValueHistory/useAssetPropertyValueHistory2';
import { useAssetPropertyValueHistory } from '../../../queries/final/useAssetPropertyValueHistory';
// import { ChartStyleSettings } from '../types';

const ioTSiteWise = new IoTSiteWise({
  credentials: getEnvCredentials(),
  region: getRegion(),
});

const isNotAlarmStream = ({ streamType }: DataStream) =>
  streamType !== StreamType.ALARM;
const dataStreamIsLoading = ({ isLoading }: DataStream) => isLoading;
const dataStreamHasError = ({ error }: DataStream) => error != null;
const dataStreamIsRefreshing = ({ isRefreshing }: DataStream) => isRefreshing;

export const useVisualizedDataStreams = (
  _queries: TimeSeriesDataQuery[],
  passedInViewport?: Viewport,
  thresholdOptions: StyledThreshold[] = []
) => {
  const { viewport, lastUpdatedBy } = useViewport();
  const [thresholds, setThresholds] = useState<Threshold[]>([]);

  // synchro-charts gesture overrides passed in viewport else explicitly passed in viewport overrides viewport group
  const utilizedViewport =
    (lastUpdatedBy ? viewport : passedInViewport || viewport) ??
    DEFAULT_VIEWPORT;

  const queryThresholds: Threshold[] = useMemo(() => [], []);
  // const { thresholds: queryThresholds } = useTimeSeriesData({
  //   viewport: utilizedViewport,
  //   queries,
  //   settings: {
  //     fetchFromStartToEnd: true,
  //   },
  //   // styles: styleSettings,
  // });
  // const test: any[] = [];
  // console.log('vs ds');

  // const [vp, setVp] = useState(utilizedViewport);
  // const updateVp = useCallback(throttle((nvp) => {
  //     setVp(nvp)
  // }, 100, { leading: lastUpdatedBy != null }), [utilizedViewport]);
  // useEffect(() => {
  //   updateVp(utilizedViewport);
  // }, [utilizedViewport])

  const qs = useMemo(() => {
    // console.log('????????????????')
    return [
      {
        assetId: '22ceb333-1929-44fc-a350-83e0dbd1f1e1',
        propertyId: 'bf7fe835-539f-46ed-ba0a-a4a5aacc9290',
        viewport: utilizedViewport,
      },
      {
        assetId: '22ceb333-1929-44fc-a350-83e0dbd1f1e1',
        propertyId: 'ae7bbfea-68ab-4137-ac87-e84bfffe5242',
        viewport: utilizedViewport,
      },
    ];
  }, [utilizedViewport]);

  // const test = useAssetPropertyValueHistory({
  //   queries: qs,
  //   getAssetPropertyValueHistory: ioTSiteWise?.getAssetPropertyValueHistory.bind(ioTSiteWise)
  // });

  const test = useAssetPropertyValueHistory({
    requests: qs,
    getAssetPropertyValueHistory:
      ioTSiteWise?.getAssetPropertyValueHistory.bind(ioTSiteWise),
  });
  // console.log(test);
  const dataStreams: DataStream[] = useMemo(() => {
    return (test as any).map((a: any, i: any) => {
      return {
        id: i,
        resolution: 0,
        isLoading: a.isLoading,
        data: (a.data?.assetPropertyValueHistory ?? []).map((v: any) => ({
          x: (v.timestamp?.timeInSeconds ?? 0) * 1000,
          y: v.value?.doubleValue ?? 0,
          quality: v.quality,
        })),
      };
    });
  }, [test]);

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
