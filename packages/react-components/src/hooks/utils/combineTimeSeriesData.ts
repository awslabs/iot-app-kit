import type { TimeSeriesData, Viewport } from '@iot-app-kit/core';

export const combineTimeSeriesData = (timeSeresDataResults: TimeSeriesData[], viewport: Viewport): TimeSeriesData =>
  timeSeresDataResults.reduce(
    (timeSeriesData, newTimeSeriesData) => {
      const { dataStreams, viewport, thresholds } = newTimeSeriesData;

      return {
        dataStreams: [...timeSeriesData.dataStreams, ...dataStreams],
        viewport, // all viewports will be the same since they came from the same query which shares a viewport.
        thresholds: [...timeSeriesData.thresholds, ...thresholds],
      };
    },
    { dataStreams: [], viewport, thresholds: [] }
  );
