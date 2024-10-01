import type { TimeSeriesDataQuery } from '@iot-app-kit/core';
import {
  getAssistantStore,
  getAllAssistantContext,
  getContextByComponent,
  getRawContextByComponent,
  setContextByComponent,
  updateContextByComponent,
} from '@iot-app-kit/core-util';
import {
  convertToSupportedTimeRange,
  transformQueriesForContext,
} from './utils';

export type TransformTimeseriesDataToAssistantContextParams = {
  start: Date;
  end: Date;
  queries: TimeSeriesDataQuery[];
};

export const useAssistantContext = () => {
  const assistantContext = getAssistantStore();
  return {
    assistantContext,
    getAllAssistantContext,
    getContextByComponent,
    getRawContextByComponent,
    setContextByComponent,
    updateContextByComponent,
    transformTimeseriesDataToAssistantContext: ({
      start,
      end,
      queries,
    }: TransformTimeseriesDataToAssistantContextParams) => ({
      timerange: convertToSupportedTimeRange(start, end),
      queries: transformQueriesForContext(queries),
    }),
  };
};
