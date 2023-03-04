import { useEffect, useState, useRef } from 'react';
import {
  Viewport,
  TimeSeriesData,
  TimeSeriesDataRequest,
  TimeQuery,
  TimeSeriesDataRequestSettings,
  ProviderWithViewport,
  StyleSettingsMap,
  combineProviders,
} from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';
import { bindStylesToDataStreams } from '../utils/bindStylesToDataStreams';
import { combineTimeSeriesData } from '../utils/combineTimeSeriesData';

import { useViewport } from '../useViewport';

const DEFAULT_SETTINGS: TimeSeriesDataRequestSettings = {
  resolution: '0',
  fetchFromStartToEnd: true,
};

const DEFAULT_VIEWPORT = { duration: '10m' };

export const useTimeSeriesData = ({
  queries,
  viewport: passedInViewport,
  settings = DEFAULT_SETTINGS,
  styles,
}: {
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  viewport?: Viewport;
  settings?: TimeSeriesDataRequestSettings;
  styles?: StyleSettingsMap;
}) => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | undefined>(undefined);

  const { viewport: injectedViewport } = useViewport();
  const viewport = passedInViewport || injectedViewport || DEFAULT_VIEWPORT;

  const prevViewport = useRef<undefined | Viewport>(undefined);
  const provider = useRef<undefined | ProviderWithViewport<TimeSeriesData[]>>(undefined);

  useEffect(
    () => {
      const id = uuid();
      provider.current = combineProviders(
        queries.map((query) =>
          query.build(id, {
            viewport,
            settings,
          })
        )
      );

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
    },
    queries.map((query) => query.toQueryString())
  );

  useEffect(() => {
    if (prevViewport.current != null) {
      provider.current?.updateViewport(viewport);
    }
    prevViewport.current = viewport;
  }, [viewport]);

  return { dataStreams: timeSeriesData?.dataStreams || [] };
};
