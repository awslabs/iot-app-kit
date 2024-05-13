import { DataStreamQuery } from '../types';

export type QueryRequestSettings = {
  requestSettings: { refreshRate?: number };
};

const REFRESH_RATE_MINUMUM = 1000;

export function isQueryWithRequestSettings<Query extends DataStreamQuery>(
  query: Query | (Query & QueryRequestSettings)
): query is Query & QueryRequestSettings {
  return 'requestSettings' in query;
}

export function getValidRefreshRate(refreshRate: number) {
  try {
    if (refreshRate && refreshRate < 1000) {
      throw new Error(
        'Refresh rate has minimum value of 1000 milliseconds. Setting refresh rate to 1 second.'
      );
    }
    return refreshRate;
  } catch (error) {
    console.error(error);
    return REFRESH_RATE_MINUMUM; // reasign to minumum value if under 1000 ms
  }
}
