import { TimeSeriesData } from '@iot-app-kit/core';
import { combineAnnotations } from './combineAnnotations';
import { MinimalViewPortConfig } from '../../common/dataTypes';

export const combineTimeSeriesData = (
  timeSeresDataResults: TimeSeriesData[],
  viewport: MinimalViewPortConfig
): TimeSeriesData =>
  timeSeresDataResults.reduce(
    (timeSeriesData, newTimeSeriesData) => {
      const { dataStreams, viewport, annotations } = newTimeSeriesData;

      const combinedAnnotations = combineAnnotations(timeSeriesData.annotations, annotations);

      return {
        dataStreams: [...timeSeriesData.dataStreams, ...dataStreams],
        viewport, // all viewports will be the same since they came from the same query which shares a viewport.
        annotations: combinedAnnotations,
      };
    },
    { dataStreams: [], viewport, annotations: {} }
  );
