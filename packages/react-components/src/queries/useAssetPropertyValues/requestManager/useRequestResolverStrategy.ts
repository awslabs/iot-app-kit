import { isDurationViewport, viewportEndDate } from '@iot-app-kit/core';
import { isAfter } from 'date-fns';
import minBy from 'lodash-es/minBy';
import { useCallback, useMemo, useState } from 'react';
import { useHarmonicIntervalFn } from 'react-use';
import {
  AbsoluteDurationTimeSeriesDataRequestResolver,
  getViewportType,
  IntervalTransformer,
  LIVE_DATA_INTERVALS,
  LiveDurationTimeSeriesDataRequestResolver,
  type RequestResolverStrategy,
  type Viewport,
} from '../../useTimeSeriesData';
import { type AssetPropertyValuesCacheClient } from '../cacheClient';
import { type AssetPropertyValueHistoryRequest } from '../types';
import { AssetPropertyValuesRequestResolver } from './assetPropertyValuesRequestResolver';

/**
 * Interval to update resolver strategy in case of
 * a historic viewport overlapping live data or
 * future data intervals
 */
const UPDATE_RESOLVER_INTERVAL = 1000;

type UseRequestResolverStrategyOptions = {
  viewport: Viewport;
  cacheClient: AssetPropertyValuesCacheClient;
  liveDataIntervals?: Viewport[];
};

export const useRequestResolverStrategy = ({
  viewport,
  cacheClient,
  liveDataIntervals = LIVE_DATA_INTERVALS,
}: UseRequestResolverStrategyOptions) => {
  const liveDurationRequestResolver = useMemo(() => {
    return new AssetPropertyValuesRequestResolver(
      new LiveDurationTimeSeriesDataRequestResolver({
        liveDataIntervals,
        cacheClient,
      })
    );
  }, [liveDataIntervals, cacheClient]);

  const absoluteDurationRequestResolver = useMemo(() => {
    return new AssetPropertyValuesRequestResolver(
      new AbsoluteDurationTimeSeriesDataRequestResolver({ cacheClient })
    );
  }, [cacheClient]);

  const pickResolverStrategy = useCallback(() => {
    const viewportType = getViewportType(viewport);
    const now = Date.now();

    const intervalTransformer = new IntervalTransformer({
      now,
      viewportType,
    });

    const liveDataIntervalCutoff =
      minBy(
        liveDataIntervals.map((viewport) =>
          intervalTransformer.toInterval(viewport)
        ),
        (interval) => interval.start.getTime()
      )?.start ?? new Date(now);

    if (
      isDurationViewport(viewport) ||
      isAfter(viewportEndDate(viewport), liveDataIntervalCutoff)
    ) {
      return {
        strategy: liveDurationRequestResolver,
        type: 'live',
      } as const;
    }

    return {
      strategy: absoluteDurationRequestResolver,
      type: 'absolute',
    } as const;
  }, [
    liveDurationRequestResolver,
    absoluteDurationRequestResolver,
    viewport,
    liveDataIntervals,
  ]);

  const [resolverType, setResolverType] = useState<'live' | 'absolute'>(
    pickResolverStrategy().type
  );

  const [requestResolverStrategy, setRequestResolverStrategy] = useState<
    RequestResolverStrategy<AssetPropertyValueHistoryRequest>
  >(pickResolverStrategy().strategy);

  /**
   * Update the resolver strategy incase a historic viewport
   * whose enddate is in the live data range moves
   * is before now
   */
  useHarmonicIntervalFn(() => {
    const { type, strategy } = pickResolverStrategy();
    if (resolverType !== type) {
      setResolverType(type);
      setRequestResolverStrategy(strategy);
    }
  }, UPDATE_RESOLVER_INTERVAL);

  return requestResolverStrategy;
};
