import { useEffect, useState, useRef } from 'react';
import {
  TimeSeriesData,
  TimeSeriesDataRequest,
  TimeQuery,
  TimeSeriesDataRequestSettings,
  ProviderWithViewport,
  StyleSettingsMap,
} from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';
import { bindStylesToDataStreams } from '../utils/bindStylesToDataStreams';
import { combineTimeSeriesData } from '../utils/combineTimeSeriesData';

import { useViewport } from '../useViewport/useViewport';
import { MinimalViewPortConfig } from '../../common/dataTypes';

const DEFAULT_SETTINGS: TimeSeriesDataRequestSettings = {
  resolution: '0',
  fetchFromStartToEnd: true,
};

const DEFAULT_VIEWPORT = { duration: '10m' };

export const useTimeSeriesData = ({
  query,
  viewport: passedInViewport,
  settings = DEFAULT_SETTINGS,
  styles,
}: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport?: MinimalViewPortConfig;
  settings?: TimeSeriesDataRequestSettings;
  styles?: StyleSettingsMap;
}) => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | undefined>(undefined);

  const { viewport: injectedViewport, setViewport } = useViewport();
  const viewport = passedInViewport || injectedViewport || DEFAULT_VIEWPORT;

  const prevViewport = useRef<undefined | MinimalViewPortConfig>(undefined);
  const provider = useRef<undefined | ProviderWithViewport<TimeSeriesData[]>>(undefined);

  useEffect(() => {
    const id = uuid();
    provider.current = query.build(id, {
      viewport,
      settings,
    });

    provider.current.subscribe({
      next: (timeSeriesDataCollection: TimeSeriesData[]) => {
        const timeSeriesData = combineTimeSeriesData(timeSeriesDataCollection, viewport);

        setTimeSeriesData({
          viewport,
          annotations: timeSeriesData.annotations,
          dataStreams: bindStylesToDataStreams({
            dataStreams: timeSeriesData.dataStreams,
            styleSettings: styles,
            assignDefaultColors: false,
          }),
        });
      },
    });

    return () => {
      // provider subscribe is asynchronous and will not be complete until the next frame stack, so we
      // defer the unsubscription to ensure that the subscription is always complete before unsubscribed.
      setTimeout(() => {
        provider.current.unsubscribe();
        provider.current = undefined;
        prevViewport.current = undefined;
      });
    };
  }, [query]);

  useEffect(() => {
    if (prevViewport.current != null) {
      provider.current?.updateViewport(viewport);
    }
    prevViewport.current = viewport;
  }, [viewport]);

  return { viewport, setViewport, dataStreams: timeSeriesData?.dataStreams || [] };
};
