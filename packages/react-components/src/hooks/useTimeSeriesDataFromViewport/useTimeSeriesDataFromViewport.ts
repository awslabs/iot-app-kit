import { useEffect, useState } from 'react';
import {
  TimeSeriesData,
  TimeSeriesDataRequest,
  Viewport,
  TimeQuery,
  TimeSeriesDataRequestSettings,
  StyleSettingsMap,
} from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';
import { bindStylesToDataStreams } from '../utils/bindStylesToDataStreams';
import { combineTimeSeriesData } from '../utils/combineTimeSeriesData';

const DEFAULT_SETTINGS: TimeSeriesDataRequestSettings = {
  resolution: '0',
  fetchFromStartToEnd: true,
};

export const useTimeSeriesDataFromViewport = ({
  query,
  viewport,
  settings = DEFAULT_SETTINGS,
  styles,
}: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport: Viewport;
  settings?: TimeSeriesDataRequestSettings;
  styles?: StyleSettingsMap;
}): TimeSeriesData => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | undefined>(undefined);

  useEffect(() => {
    const id = uuid();
    const provider = query.build(id, {
      viewport,
      settings,
    });

    provider.subscribe({
      next: (timeSeriesDataCollection: TimeSeriesData[]) => {
        const timeSeriesData = combineTimeSeriesData(timeSeriesDataCollection, viewport);

        setTimeSeriesData({
          ...timeSeriesData,
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
        provider.unsubscribe();
      });
    };
  }, [query]);

  return timeSeriesData || { dataStreams: [], viewport, annotations: {} };
};
