import type {
  Viewport,
  DataStream,
  Threshold,
  TimeSeriesData,
  TimeSeriesDataRequest,
  TimeQuery,
  TimeSeriesDataRequestSettings,
  StyleSettingsMap,
} from '@iot-app-kit/core';
import { useState } from 'react';
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect';

import { DEFAULT_SETTINGS, DEFAULT_VIEWPORT } from './constants';
import { useProviderManager } from './useProviderManager';
import { useViewport } from '../useViewport';
import { useDataStreamStyler } from '../useColoredDataStreams/useDataStreamColorer';
import { combineTimeSeriesData } from '../utils/combineTimeSeriesData';

interface UseTimeSeriesDataOptions {
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  viewport?: Viewport;
  settings?: TimeSeriesDataRequestSettings;
  styles?: StyleSettingsMap;
}

interface UseTimeSeriesDataResult {
  dataStreams: DataStream[];
  thresholds: Threshold[];
}

export function useTimeSeriesData({
  queries,
  viewport: passedInViewport,
  settings = DEFAULT_SETTINGS,
  styles,
}: UseTimeSeriesDataOptions): UseTimeSeriesDataResult {
  const [dataStreams, setDataStreams] = useState<DataStream[]>([]);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const { styleDatastreams } = useDataStreamStyler(styles);
  const { viewport: injectedViewport } = useViewport();
  const viewport = passedInViewport ?? injectedViewport ?? DEFAULT_VIEWPORT;

  useProviderManager({
    queries,
    viewport,
    settings,
    onData: (timeSeriesDataCollection) => {
      const {
        dataStreams: combinedDataStreams,
        thresholds: combinedThresholds,
      } = combineTimeSeriesData(timeSeriesDataCollection, viewport);

      setDataStreams(styleDatastreams(combinedDataStreams));
      setThresholds(combinedThresholds);
    },
  });

  // Re-style query if the style settings have changed.
  useDeepCompareEffect(() => {
    if (dataStreams.length === 0) {
      return;
    }

    setDataStreams(styleDatastreams(dataStreams));
  }, [styles ?? {}]);

  return { dataStreams, thresholds };
}
