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
      let startISO = start.toISOString();
      startISO = `${startISO.substring(0, startISO.indexOf('.'))}Z`;

      let endISO = end.toISOString();
      endISO = `${endISO.substring(0, endISO.indexOf('.'))}Z`;
      return {
        start: startISO,
        end: endISO,
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
