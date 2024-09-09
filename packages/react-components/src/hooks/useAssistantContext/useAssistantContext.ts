import type { TimeSeriesDataQuery } from '@iot-app-kit/core';
import {
  getAssistantStore,
  getAllAssistantContext,
  getContextByComponent,
  setContextByComponent,
  updateContextByComponent,
} from '@iot-app-kit/core-util';

export const useAssistantContext = () => {
  const assistantContext = getAssistantStore();
  return {
    assistantContext,
    getAllAssistantContext,
    getContextByComponent,
    setContextByComponent,
    updateContextByComponent,
    getSupportedTimeRange: (start: Date, end: Date) => {
      return {
        start: start.toISOString(),
        end: end.toISOString(),
      };
    },
    getQueriesForContext: (queries: TimeSeriesDataQuery[]) => {
      return queries.map((query) => {
        try {
          return JSON.parse(query.toQueryString());
        } catch (_error) {
          return {};
        }
      });
    },
  };
};
