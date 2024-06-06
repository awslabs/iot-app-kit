import { HistoricalViewport } from '@iot-app-kit/core';
import { sub } from 'date-fns';

export const DEFAULT_ANOMALY_DATA_SOURCE_VIEWPORT: HistoricalViewport = {
  start: sub(Date.now(), { days: 7 }),
  end: new Date(),
};
