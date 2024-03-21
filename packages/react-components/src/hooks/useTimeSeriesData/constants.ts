import type {
  Viewport,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';

export const DEFAULT_SETTINGS: TimeSeriesDataRequestSettings = {
  resolution: '0',
  fetchFromStartToEnd: true,
};

export const DEFAULT_VIEWPORT: Viewport = { duration: '10m' };
