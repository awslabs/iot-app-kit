import type { ComponentQuery } from '../common/chartTypes';
import type {
  AlarmDataQuery,
  TimeSeriesDataQuery,
} from '@iot-app-kit/source-iotsitewise';

export const getTimeSeriesQueries = (
  queries: ComponentQuery[]
): TimeSeriesDataQuery[] => {
  return queries.filter(
    (query): query is TimeSeriesDataQuery =>
      (query as TimeSeriesDataQuery).build !== undefined
  );
};

export const getAlarmQueries = (
  queries: ComponentQuery[]
): AlarmDataQuery[] => {
  return queries.filter(
    (query): query is AlarmDataQuery =>
      (query as AlarmDataQuery).query !== undefined
  );
};
