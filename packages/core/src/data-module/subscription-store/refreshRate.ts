import { type DataStreamQuery } from '../types';

export interface QueryRequestSettings {
  requestSettings: {
    refreshRate?: number;
  };
}

const REFRESH_RATE_MINUMUM = 1000;

export function isQueryWithRequestSettings<Query extends DataStreamQuery>(
  query: Query | (Query & QueryRequestSettings)
): query is Query & QueryRequestSettings {
  return 'requestSettings' in query;
}

export function getValidRefreshRate(refreshRate: number) {
  return refreshRate < REFRESH_RATE_MINUMUM
    ? REFRESH_RATE_MINUMUM
    : refreshRate;
}
