import { useMemo, useState } from 'react';
import { type LiveDataConfiguration, type Viewport } from '../types';
import {
  DEFAULT_LIVE_DATA_CONFIGURATION,
  convertToLiveDataIntervals,
} from './liveData';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';

type UseLiveDataIntervalsOptions = {
  viewport: Viewport;
  liveDataConfguration?: LiveDataConfiguration[];
};
export const useLiveDataIntervals = ({
  viewport,
  liveDataConfguration = DEFAULT_LIVE_DATA_CONFIGURATION,
}: UseLiveDataIntervalsOptions) => {
  const [refreshRate, setRefreshRate] = useState(viewport.refreshRate);

  useCustomCompareEffect(
    () => {
      if (!isEqual(viewport.refreshRate, refreshRate)) {
        setRefreshRate(viewport.refreshRate);
      }
    },
    [viewport, refreshRate],
    isEqual
  );

  return useMemo(() => {
    if (liveDataConfguration.length === 0) {
      return [];
    }

    const [firstConfiguration, ...restConfiguration] =
      liveDataConfguration.sort((a, b) => a.duration - b.duration);

    /**
     * Apply custom refresh rate to the first live data confguration
     * The default is last 72 seconds.
     */
    if (refreshRate != null) {
      return convertToLiveDataIntervals([
        {
          ...firstConfiguration,
          refreshRate,
        },
        ...restConfiguration,
      ]);
    }

    return convertToLiveDataIntervals([
      firstConfiguration,
      ...restConfiguration,
    ]);
  }, [refreshRate, liveDataConfguration]);
};
